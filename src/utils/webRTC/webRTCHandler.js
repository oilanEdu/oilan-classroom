import React, { useState, useEffect } from 'react';
import store from '../../store/store';
import { setLocalStream, setCallState, callStates, setCallingDialogVisible, setCallerUsername, setCallRejected, setRemoteStream, setScreenSharingActive, resetCallDataState, setMessage } from '../../store/actions/callActions';
import * as wss from '../wssConnection/wssConnection';
import * as webRTCGroupCallHandler from './webRTCGroupCallHandler';

const preOfferAnswers = {
  CALL_ACCEPTED: 'CALL_ACCEPTED',
  CALL_REJECTED: 'CALL_REJECTED',
  CALL_NOT_AVAILABLE: 'CALL_NOT_AVAILABLE'
};

const defaultConstrains = {
  video: {
    width: 480,
    height: 360
  },
  audio: true,
};

const configuration = {
  iceServers: [{
    urls: 'stun:stun.l.google.com:13902'
  }]
};

let connectedUserSocketId;
let peerConnection;
let dataChannel;
let cameraStream;
let screenSharingStream;
let ls;

export const getLocalStream = async () => {
  let audioStream;

  if (!store.getState().call.screenSharingActive) {
    if (!cameraStream) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ ...defaultConstrains, video: true });
        cameraStream = stream;
        audioStream = new MediaStream();
        stream.getAudioTracks().forEach(track => audioStream.addTrack(track));
        wss.sendMessage('CAMERA_ON', connectedUserSocketId); // <-- Add this line
      } catch (err) {
        console.log('error occured when trying to get an access to get local camera stream');
        console.log(err);
        return;
      }
    }
    store.dispatch(setLocalStream(cameraStream));
    store.dispatch(setCallState(callStates.CALL_AVAILABLE));
    ls = cameraStream
    createPeerConnection(cameraStream)
  } else {
    if (!screenSharingStream) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenSharingStream = stream;
        audioStream = new MediaStream();
        cameraStream.getAudioTracks().forEach(track => audioStream.addTrack(track));
        const videoStream = new MediaStream();
        stream.getVideoTracks().forEach(track => videoStream.addTrack(track));
        const combinedStream = new MediaStream();
        audioStream.getTracks().forEach(track => combinedStream.addTrack(track));
        videoStream.getTracks().forEach(track => combinedStream.addTrack(track));
        screenSharingStream = combinedStream;
        wss.sendMessage('SCREEN_SHARING_ON', connectedUserSocketId); // <-- Add this line
      } catch (err) {
        console.log('error occured when trying to get an access to get local screen sharing stream');
        console.log(err);
        return;
      }
    }

    store.dispatch(setLocalStream(screenSharingStream));
    store.dispatch(setCallState(callStates.CALL_AVAILABLE));
    createPeerConnection(screenSharingStream)
    ls = screenSharingStream
  }
};

// export const getLocalStream = () => {
//   navigator.mediaDevices.getUserMedia(defaultConstrains)
//     .then(stream => {
//       store.dispatch(setLocalStream(stream));
//       store.dispatch(setCallState(callStates.CALL_AVAILABLE));
//       createPeerConnection();
//     })
//     .catch(err => {
//       console.log('error occured when trying to get an access to get local stream');
//       console.log(err);
//     });
// };

const createPeerConnection = () => {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
  peerConnection = new RTCPeerConnection(configuration);

  const localStream = store.getState().call.localStream;

  for (const track of localStream.getTracks()) {
    peerConnection.addTrack(track, localStream);
  }

  peerConnection.ontrack = ({ streams: [stream] }) => {
    store.dispatch(setRemoteStream(stream));
  };

  peerConnection.ondatachannel = (event) => {
    const dataChannel = event.channel;

    dataChannel.onopen = () => {
      console.log('peer connection is ready to receive data channel messages');
    };

    dataChannel.onmessage = (event) => {
      store.dispatch(setMessage(true, event.data));
    };
  };

  dataChannel = peerConnection.createDataChannel('chat');

  dataChannel.onopen = () => {
    console.log('chat data channel succesfully opened');
  };

  peerConnection.onicecandidate = (event) => {
    console.log('geeting candidates from stun server');
    if (event.candidate) {
      wss.sendWebRTCCandidate({
        candidate: event.candidate,
        connectedUserSocketId: connectedUserSocketId
      });
    }
  };

  peerConnection.onconnectionstatechange = (event) => {
    if (peerConnection.connectionState === 'connected') {
      console.log('succesfully connected with other peer');
    }
  };
};

export const callToOtherUser = (calleeDetails) => {
  connectedUserSocketId = calleeDetails.socketId;
  store.dispatch(setCallState(callStates.CALL_IN_PROGRESS));
  store.dispatch(setCallingDialogVisible(true));
  wss.sendPreOffer({
    callee: calleeDetails,
    caller: {
      username: store.getState().dashboard.username
    }
  });
};

export const handlePreOffer = (data) => {
  if (checkIfCallIsPossible()) {
    connectedUserSocketId = data.callerSocketId;
    store.dispatch(setCallerUsername(data.callerUsername));
    store.dispatch(setCallState(callStates.CALL_REQUESTED));
  } else {
    wss.sendPreOfferAnswer({
      callerSocketId: data.callerSocketId,
      answer: preOfferAnswers.CALL_NOT_AVAILABLE
    });
  }
};

export const acceptIncomingCallRequest = () => {
  wss.sendPreOfferAnswer({
    callerSocketId: connectedUserSocketId,
    answer: preOfferAnswers.CALL_ACCEPTED
  });

  store.dispatch(setCallState(callStates.CALL_IN_PROGRESS));
};

export const rejectIncomingCallRequest = () => {
  wss.sendPreOfferAnswer({
    callerSocketId: connectedUserSocketId,
    answer: preOfferAnswers.CALL_REJECTED
  });
  resetCallData();
};

export const handlePreOfferAnswer = (data) => {
  store.dispatch(setCallingDialogVisible(false));

  if (data.answer === preOfferAnswers.CALL_ACCEPTED) {
    sendOffer();
  } else {
    let rejectionReason;
    if (data.answer === preOfferAnswers.CALL_NOT_AVAILABLE) {
      rejectionReason = 'Callee is not able to pick up the call right now';
    } else {
      rejectionReason = 'Call rejected by the callee';
    }
    store.dispatch(setCallRejected({
      rejected: true,
      reason: rejectionReason
    }));

    resetCallData();
  }
};

export const changedCamera = (state, username, id, role, teacherUrl, studentsOfGroup) => {
  console.log('step2', {screenStatus: state, username: username, streamId: id, role: role, teacherUrl: teacherUrl, studentsOfGroup: studentsOfGroup});
  wss.changedCamera( state, username, id, role, teacherUrl, studentsOfGroup );
  console.log('step7', ls)
};

const sendOffer = async () => {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  wss.sendWebRTCOffer({
    calleeSocketId: connectedUserSocketId,
    offer: offer
  });
};

export const handleOffer = async (data) => {
  await peerConnection.setRemoteDescription(data.offer);
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  wss.sendWebRTCAnswer({
    callerSocketId: connectedUserSocketId,
    answer: answer
  });
};

export const handleAnswer = async (data) => {
  await peerConnection.setRemoteDescription(data.answer);
};

export const handleCandidate = async (data) => {
  try {
    console.log('adding ice candidates');
    await peerConnection.addIceCandidate(data.candidate);
  } catch (err) {
    console.error('error occured when trying to add received ice candidate', err);
  }
};

export const checkIfCallIsPossible = () => {
  if (store.getState().call.localStream === null ||
  store.getState().call.callState !== callStates.CALL_AVAILABLE) {
    return false;
  } else {
    return true;
  }
};

// export const switchForScreenSharingStream = async () => {
//   if (!store.getState().call.screenSharingActive) {
//     try {
//       screenSharingStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
//       store.dispatch(setScreenSharingActive(true));
//       const senders = peerConnection.getSenders();
//       const sender = senders.find(sender => sender.track.kind === screenSharingStream.getVideoTracks()[0].kind);
//       sender.replaceTrack(screenSharingStream.getVideoTracks()[0]);
//       getLocalStream()
//     } catch (err) {
//       console.error('error occured when trying to get screen sharing stream', err);
//     }
//   } else {
//     const localStream = store.getState().call.localStream;
//     const senders = peerConnection.getSenders();
//     const sender = senders.find(sender => sender.track.kind === localStream.getVideoTracks()[0].kind);
//     sender.replaceTrack(localStream.getVideoTracks()[0]);
//     store.dispatch(setScreenSharingActive(false));
//     screenSharingStream.getTracks().forEach(track => track.stop());
//   }
// };

// export const switchForScreenSharingStream = async () => {
//   store.dispatch(setScreenSharingActive(!store.getState().call.screenSharingActive));
//   getLocalStream();
// };

export const switchForScreenSharingStream = async (state, username, id, role, teacherUrl, studentsOfGroup) => {
  const screenSharingActive = store.getState().call.screenSharingActive;
  const localStream = store.getState().call.localStream;
  const audioTrack = localStream.getAudioTracks()[0];
  const videoTrack = screenSharingActive
    ? screenSharingStream.getVideoTracks()[0]
    : localStream.getVideoTracks()[0]; 

  try {
    if (!screenSharingActive || !store.getState().call.screenSharingActive) {
      // Switch to screen sharing
      screenSharingStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      audioTrack && screenSharingStream.addTrack(audioTrack);
      store.dispatch(setScreenSharingActive(true));

      wss.changedCamera( state, username, id, role, teacherUrl, studentsOfGroup );

      getLocalStream();
    } else {
      // Switch back to camera
      const senders = peerConnection.getSenders();
      // console.log('senders', senders)
      const sender = senders.find(sender => sender.track.kind === videoTrack.kind);
      sender.replaceTrack(localStream.getVideoTracks()[0]);
      store.dispatch(setScreenSharingActive(false));
      screenSharingStream.getVideoTracks().forEach(track => track.stop());

      wss.changedCamera( state, username, id, role, teacherUrl, studentsOfGroup );

      getLocalStream();
    }

    const senders = peerConnection.getSenders();
    const sender = senders.find(sender => sender.track.kind === videoTrack.kind);
    sender.replaceTrack(videoTrack);

  } catch (err) {
    console.error('error occured when trying to switch stream', err);
  }
};

export const handleUserHangedUp = () => {
  resetCallDataAfterHangUp();
};

export const hangUp = () => {
  wss.sendUserHangedUp({
    connectedUserSocketId: connectedUserSocketId
  });

  resetCallDataAfterHangUp();
};

export const closeCall = () => {
  wss.sendUserHangedUp({
    connectedUserSocketId: connectedUserSocketId
  });
  peerConnection.close();
  
}

const resetCallDataAfterHangUp = () => {
  peerConnection.close();
  peerConnection = null;
  createPeerConnection();
  resetCallData();

  const localStream = store.getState().call.localStream;
  localStream.getVideoTracks()[0].enabled = true;
  localStream.getAudioTracks()[0].enabled = true;

  if (store.getState().call.screenSharingActive) {
    screenSharingStream.getTracks().forEach(track => {
      track.stop();
    });
  }

  store.dispatch(resetCallDataState());
};

export const resetCallData = () => {
  connectedUserSocketId = null;
  store.dispatch(setCallState(callStates.CALL_AVAILABLE));
};

export const sendMessageUsingDataChannel = (message) => {
  dataChannel.send(message);
};

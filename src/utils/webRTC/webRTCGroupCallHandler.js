import * as wss from '../wssConnection/wssConnection';
import { connectWithWebSocket } from '../wssConnection/wssConnection';
import store from '../../store/store';
import { setGroupCallActive, setCallState, callStates, setGroupCallIncomingStreams, clearGroupCallData, setRemoteStream } from '../../store/actions/callActions';
import React, { useState, useMemo, useEffect } from 'react';

let myPeer;
let myPeerId;
let groupCallRoomId;
let groupCallHost = false;
export let username

export const connectWithMyPeer = (user, role) => {
  console.log('connectWithMyPeer', user)
  wss.IAM(user)
  username = user
  if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
    const {Peer} = require('peerjs');
    myPeer = new Peer(undefined, {
      host: 'realibi.kz',
      port: '3031',
      path: '/peerjs',
    });
    // console.log('myPeer', myPeer)
    // console.log('window', window)
    // console.log('window.navigator', window.navigator)
    myPeer.on('open', (id) => {
    console.log('succesfully connected with peer server');
    myPeerId = id;
  });

  myPeer.on('call', call => {
    call.answer(store.getState().call.localStream);
    call.on('stream', incomingStream => {
      const streams = store.getState().call.groupCallStreams;
      console.log('streams', streams)
      const stream = streams.find(stream => stream.id === incomingStream.id);
      incomingStream.username = username
      incomingStream.role = role
      if (!stream) {
        addVideoStream(incomingStream);
      }
    });
  });
};}


export const createNewGroupCall = () => {
  groupCallHost = true;
  wss.registerGroupCall({
    username: store.getState().dashboard.username,
    peerId: myPeerId
  });

  store.dispatch(setGroupCallActive(true));
  store.dispatch(setCallState(callStates.CALL_IN_PROGRESS));
};

export const joinGroupCall = (hostSocketId, roomId, user) => {
  console.log('eee from conv', hostSocketId, roomId, user)
  console.log('CONNECTED!!!')
  const localStream = store.getState().call.localStream;
  //localStream.username = user;
  groupCallRoomId = roomId;
  wss.userWantsToJoinGroupCall({
    username: user,
    peerId: myPeerId,
    hostSocketId,
    roomId,
    localStreamId: localStream?.id
  });

  store.dispatch(setGroupCallActive(true));
  store.dispatch(setCallState(callStates.CALL_IN_PROGRESS));
};

export const connectToNewUser = (data) => {
  const localStream = store.getState().call.localStream;
  localStream.username = username; // add username property to the localStream object
  if (myPeer) {
    const call = myPeer.call(data.peerId, localStream);

    call.on('stream', (incomingStream) => {
      const streams = store.getState().call.groupCallStreams;
      console.log('streams2', streams)
      const stream = streams.find(stream => stream.id === incomingStream.id);
      incomingStream.username = incomingStream.peerId === myPeerId ? username : incomingStream.username;
      if (!stream) {
        addVideoStream(incomingStream);
      }
    });
  } else {
    console.error('myPeer is not initialized');
  }
};

export const leaveGroupCall = () => {
  if (groupCallHost) {
    wss.groupCallClosedByHost({
      peerId: myPeerId
    });
  } else {
    wss.userLeftGroupCall({ 
      streamId: store.getState().call.localStream.id,
      roomId: groupCallRoomId
    });
  }
  clearGroupData();
};

export const clearGroupData = () => {
  groupCallRoomId = null;
  groupCallHost = null;
  store.dispatch(clearGroupCallData());
  myPeer.destroy();
  connectWithMyPeer();

  const localStream = store.getState().call.localStream;
  localStream.username = username
  localStream.getVideoTracks()[0].enabled = true;
  if (localStream.getAudioTracks()){
    localStream.getAudioTracks()[0].enabled = true;
  }
};

export const removeInactiveStream = (data) => {
  const groupCallStreams = store.getState().call.groupCallStreams.filter(
    stream => stream.id !== data.streamId
  );
  store.dispatch(setGroupCallIncomingStreams(groupCallStreams));
};

export const addVideoStream = (incomingStream) => {
  const groupCallStreams = [
    ...store.getState().call.groupCallStreams,
    incomingStream
  ];

  console.log('eee GCS', groupCallStreams)

  store.dispatch(setGroupCallIncomingStreams(groupCallStreams));
};

export const updateVideoStream = (data) => {
  const groupCallStreams = [
    ...store.getState().call.groupCallStreams,
    data.stream
  ];

  console.log('eee GCS', groupCallStreams)
  store.dispatch(setRemoteStream(data.stream));
  store.dispatch(setGroupCallIncomingStreams(groupCallStreams));
};

// if group call is active return roomId if not return false
export const checkActiveGroupCall = () => {
  if (store.getState().call.groupCallActive) {
    return groupCallRoomId;
  } else {
    return false;
  }
};

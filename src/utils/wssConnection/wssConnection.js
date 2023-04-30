import socketClient from 'socket.io-client';
import store from '../../store/store.js';
import { useRouter } from 'next/router';
import * as dashboardActions from '../../store/actions/dashboardActions';
import * as webRTCHandler from '../webRTC/webRTCHandler';
import * as webRTCGroupCallHandler from '../webRTC/webRTCGroupCallHandler';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { setGroupCallActive, setCallState, callStates, setGroupCallIncomingStreams, clearGroupCallData, setRemoteStream } from '../../store/actions/callActions';

const SERVER = 'wss://realibi.kz:3031';

const broadcastEventTypes = {
  ACTIVE_USERS: 'ACTIVE_USERS',
  GROUP_CALL_ROOMS: 'GROUP_CALL_ROOMS'
};

let socket;

export const connectWithWebSocket = () => {
  socket = socketClient(SERVER);
  // console.log('socket', socket)
  socket.on('connection', () => {
    console.log('succesfully connected with wss server');
    // console.log(socket);
  });

  socket.on('broadcast', (data) => {
    handleBroadcastEvents(data);
  });

  // listeners related with direct call
  socket.on('pre-offer', (data) => {
    webRTCHandler.handlePreOffer(data);
  });

  socket.on('pre-offer-answer', (data) => {
    webRTCHandler.handlePreOfferAnswer(data);
  });

  socket.on('webRTC-offer', (data) => {
    webRTCHandler.handleOffer(data);
  });

  socket.on('webRTC-answer', (data) => {
    webRTCHandler.handleAnswer(data);
  });

  socket.on('webRTC-candidate', (data) => {
    webRTCHandler.handleCandidate(data);
  });

  socket.on('user-hanged-up', () => {
    webRTCHandler.handleUserHangedUp();
  });

  // listeners related with group calls

  socket.on('group-call-join-request', (data) => {
    webRTCGroupCallHandler.connectToNewUser(data);
    console.log('stepY', data)
  });

  socket.on('group-call-user-left', (data) => {
    webRTCGroupCallHandler.removeInactiveStream(data);
  });

  socket.on('camera-state-changed', (data) => {
    console.log('step4', data)
  });

  socket.on('reload-streams', async ({ socketId, state, userName, peerId, room, role, teacherUrl }) => {
  console.log('step5', { socketId: socketId, screenStatus: state, username: userName, streamId: peerId, room: room, role: role, teacherUrl: teacherUrl });
  console.log('step1500', userName, webRTCGroupCallHandler.username)
  if (userName != webRTCGroupCallHandler.username) {
    function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function firstFunction() {
  await delay(3000);
  // ваш код для первой функции
}

async function secondFunction() {
  await delay(6000);
  // ваш код для второй функции
}

if (userName != webRTCGroupCallHandler.username) {
  await webRTCGroupCallHandler.leaveGroupCall();
  await firstFunction();
  await webRTCGroupCallHandler.joinGroupCall(room.socketId, room.roomId);
  await secondFunction();
}
  }
  const streams = store.getState().call.groupCallStreams;

  for (const stream of streams) {
    if (stream.id === peerId) {
      try {
        //await webRTCGroupCallHandler.leaveGroupCall();
        //await webRTCGroupCallHandler.joinGroupCall(room.socketId, room.roomId);
      } catch (error) {
        console.log('Error:', error);
      }
    }
    console.log('eee', stream.id, ' - ', peerId);
  }
});
};

export const IAM = (data) => {
  console.log('stepLOL', data)
  return data
}

export const sendMessage = (type, data) => {
  socket.emit(type, data);
};

export const registerNewUser = (username) => {
  // console.log('userName', username)
  socket.emit('register-new-user', {
    username: username,
    socketId: socket.id
  });
};

// emitting events to server related with direct call

export const sendPreOffer = (data) => {
  socket.emit('pre-offer', data);
};

export const changedCamera = (state, username, id, role, teacherUrl) => {
  console.log('step3', { screenStatus: state, username: username, streamId: id, role: role, teacherUrl: teacherUrl })
  socket.emit('camera-state-changed', { state: state, username: username, id: id, role: role, teacherUrl: teacherUrl });
  
};

export const sendPreOfferAnswer = (data) => {
  socket.emit('pre-offer-answer', data);
};

export const sendWebRTCOffer = (data) => {
  socket.emit('webRTC-offer', data);
};

export const sendWebRTCAnswer = (data) => {
  socket.emit('webRTC-answer', data);
};

export const sendWebRTCCandidate = (data) => {
  socket.emit('webRTC-candidate', data);
};

export const sendUserHangedUp = (data) => {
  socket.emit('user-hanged-up', data);
};

// emitting events related with group calls

export const registerGroupCall = (data) => {
  socket.emit('group-call-register', data);
};

export const userWantsToJoinGroupCall = (data) => {
  console.log('test2', data)
  socket.emit('group-call-join-request', data);
};

export const userLeftGroupCall = (data) => {
  socket.emit('group-call-user-left', data);
};

export const groupCallClosedByHost = (data) => {
  socket.emit('group-call-closed-by-host', data);
};

const handleBroadcastEvents = (data) => {
  switch (data.event) {
    case broadcastEventTypes.ACTIVE_USERS:
      const activeUsers = data.activeUsers.filter(activeUser => activeUser.socketId !== socket.id);
      store.dispatch(dashboardActions.setActiveUsers(activeUsers));
      break;
    case broadcastEventTypes.GROUP_CALL_ROOMS:
      const groupCallRooms = data.groupCallRooms.filter(room => room.socketId !== socket.id);
      const activeGroupCallRoomId = webRTCGroupCallHandler.checkActiveGroupCall();

      if (activeGroupCallRoomId) {
        const room = groupCallRooms.find(room => room.roomId === activeGroupCallRoomId);
        if (!room) {
          webRTCGroupCallHandler.clearGroupData();
        }
      }
      store.dispatch(dashboardActions.setGroupCalls(groupCallRooms));
      break;
    default:
      break;
  }
};

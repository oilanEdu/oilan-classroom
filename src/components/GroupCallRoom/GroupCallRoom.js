import React, { useState, useEffect } from 'react';
import ConversationButtons from '../ConversationButtons/ConversationButtons';
import styles from './GroupCallRoom.module.css';
import GroupCallVideo from './GroupCallVideo';
import RemoteVideoView from './../RemoteVideoView/RemoteVideoView';
import { setLocalMicrophoneEnabled, setLocalCameraEnabled, setLocalStream, setCallState, callStates, setCallingDialogVisible, setCallerUsername, setCallRejected, setRemoteStream, setScreenSharingActive, resetCallDataState, setMessage } from '../../store/actions/callActions';
import { connect } from 'react-redux';

const GroupCallRoom = (props) => {
  console.log('PROPS', props)
  const {
    localStream,
    callState,
    callerUsername,
    callingDialogVisible,
    callRejected,
    hideCallRejectedDialog,
    setDirectCallMessage,
    message
  } = props;


  const { groupCallStreams } = props;

  return (
    <div className='group_call_room_container'>
      <span className='group_call_title'>Group Call</span>
      <div className='group_call_videos_container'>
        {
          groupCallStreams.map(stream => {
            return <>
              <RemoteVideoView role={props.role} key={stream.id} remoteStream={stream} />
              
            </>
          })
        }
      </div>
      <ConversationButtons {...props} />
    </div>
  );
};

function mapStoreStateToProps ({ call }) {
  return {
    ...call
  };
}

function mapDispatchToProps (dispatch) {
  return {
    hideCallRejectedDialog: (callRejectedDetails) => dispatch(setCallRejected(callRejectedDetails)),
    setCameraEnabled: (enabled) => dispatch(setLocalCameraEnabled(enabled)),
    setMicrophoneEnabled: (enabled) => dispatch(setLocalMicrophoneEnabled(enabled)),
    setDirectCallMessage: (received, content) => dispatch(setMessage(received, content))
  };
}

export default connect(mapStoreStateToProps, mapDispatchToProps)(GroupCallRoom);
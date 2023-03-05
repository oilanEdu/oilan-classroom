import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import GroupCallButton from '../GroupCallButton/GroupCallButton';
import DirectCall from './../DirectCall/DirectCall';
import { callStates, setLocalCameraEnabled, setLocalMicrophoneEnabled, setScreenSharingActive } from '../../../src/store/actions/callActions';
import * as webRTCGroupCallHandler from '../../../src/utils/webRTC/webRTCGroupCallHandler';
import GroupCallRoom from '../GroupCallRoom/GroupCallRoom';

const GroupCall = (props) => {
  console.log('GroupCall props', props)

  // eslint-disable-next-line
  const { callState, localStream, groupCallActive, groupCallStreams } = props;
  let x
  useEffect(() => {
    groupCallStreams.map(stream => {
      x = stream.getAudioTracks()[0].enabled 
      console.log('GroupCall groupCallStream', stream)
      console.log('GroupCall groupCallStream.getTracks()', stream.getTracks())
      console.log('GroupCall groupCallStream.getTracks()[0].enabled', stream.getAudioTracks()[0].enabled) 
    }) 
  }, [groupCallStreams]);
  const createRoom = () => {
    webRTCGroupCallHandler.createNewGroupCall();
  };

  const leaveRoom = () => {
    webRTCGroupCallHandler.leaveGroupCall();
  };

  return (
    <>
      <DirectCall role={props.role} lo={groupCallStreams[0]}/>
      {!groupCallActive && localStream && callState !== callStates.CALL_IN_PROGRESS && 
        //<GroupCallButton onClickHandler={createRoom} label='Create room' />
        <></>
      }
      {groupCallActive && <GroupCallRoom role={props.role} username={props.username} goMeet={props.goMeet} setGoMeet={props.setGoMeet} check={props.check} setCheck={props.setCheck} {...props} />}
      {groupCallActive && 
        //<GroupCallButton onClickHandler={leaveRoom} label='Leave room' />
        <></>
      }
    </>
  );
};

const mapStoreStateToProps = ({ call }) => ({
  ...call
});

const mapActionsToProps = (dispatch) => {
  return {
    setCameraEnabled: enabled => dispatch(setLocalCameraEnabled(enabled)),
    setMicrophoneEnabled: enabled => dispatch(setLocalMicrophoneEnabled(enabled)),
    setSharing: active => dispatch(setScreenSharingActive(active))
  };
};

export default connect(mapStoreStateToProps, mapActionsToProps)(GroupCall);

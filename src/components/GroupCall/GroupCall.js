import React from 'react';
import { connect } from 'react-redux';
import GroupCallButton from '../GroupCallButton/GroupCallButton';
import { callStates, setLocalCameraEnabled, setLocalMicrophoneEnabled } from '../../../src/store/actions/callActions';
import * as webRTCGroupCallHandler from '../../../src/utils/webRTC/webRTCGroupCallHandler';
import GroupCallRoom from '../GroupCallRoom/GroupCallRoom';

const GroupCall = (props) => {
  console.log('PROPS IN GC', props)
  // eslint-disable-next-line
  const { callState, localStream, groupCallActive, groupCallStreams } = props;

  const createRoom = () => {
    webRTCGroupCallHandler.createNewGroupCall();
  };

  const leaveRoom = () => {
    webRTCGroupCallHandler.leaveGroupCall();
  };

  return (
    <>
      {!groupCallActive && localStream && callState !== callStates.CALL_IN_PROGRESS &&
        <GroupCallButton onClickHandler={createRoom} label='Create room' />}
      {groupCallActive && <GroupCallRoom role={props.role} {...props} />}
      {groupCallActive && <GroupCallButton onClickHandler={leaveRoom} label='Leave room' />}
    </>
  );
};

const mapStoreStateToProps = ({ call }) => ({
  ...call
});

const mapActionsToProps = (dispatch) => {
  return {
    setCameraEnabled: enabled => dispatch(setLocalCameraEnabled(enabled)),
    setMicrophoneEnabled: enabled => dispatch(setLocalMicrophoneEnabled(enabled))
  };
};

export default connect(mapStoreStateToProps, mapActionsToProps)(GroupCall);
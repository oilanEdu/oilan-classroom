import React from 'react';
import { connect } from 'react-redux';
import BigVideo from '../BigVideo/BigVideo';
import RemoteVideoView from '../RemoteVideoView/RemoteVideoView';
import CallRejectedDialog from '../CallRejectedDialog/CallRejectedDialog';
import IncomingCallDialog from '../IncomingCallDialog/IncomingCallDialog';
import CallingDialog from '../CallingDialog/CallingDialog';
import { callStates, setCallRejected, setLocalCameraEnabled, setLocalMicrophoneEnabled, setMessage } from '../../../src/store/actions/callActions';
import ConversationButtons from '../ConversationButtons/ConversationButtons';
import Messenger from '../Messenger/Messenger';

const DirectCall = (props) => {
  const {
    localStream,
    remoteStream,
    callState,
    callerUsername,
    callingDialogVisible,
    callRejected,
    hideCallRejectedDialog,
    setDirectCallMessage,
    message
  } = props;

  return (
    <>
      {props?.role == 'student' ? <BigVideo localStream={props.lo} /> : <BigVideo localStream={localStream}/>}
      {remoteStream && callState === callStates.CALL_IN_PROGRESS && <RemoteVideoView role={props.role} remoteStream={remoteStream} />}
      {callRejected.rejected && <CallRejectedDialog
        reason={callRejected.reason}
        hideCallRejectedDialog={hideCallRejectedDialog}
                                />}
      {callState === callStates.CALL_REQUESTED && <IncomingCallDialog callerUsername={callerUsername} />}
      {callingDialogVisible && <CallingDialog />}
      {remoteStream && callState === callStates.CALL_IN_PROGRESS && <ConversationButtons {...props} />}
      {remoteStream && callState === callStates.CALL_IN_PROGRESS && <Messenger message={message} setDirectCallMessage={setDirectCallMessage} />}
    </>
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

export default connect(mapStoreStateToProps, mapDispatchToProps)(DirectCall);

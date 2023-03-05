import React from 'react';
import ConversationButton from './ConversationButton';
import GroupCallButton from './../GroupCallButton/GroupCallButton';
import { switchForScreenSharingStream, hangUp } from '../../../src/utils/webRTC/webRTCHandler';
import * as webRTCGroupCallHandler from '../../../src/utils/webRTC/webRTCGroupCallHandler';
import styles from './ConversationButtons.module.css';
import { setScreenSharingActive } from '../../../src/store/actions/callActions';

const ConversationButtons = (props) => {
  const {
    localStream,
    localCameraEnabled,
    localMicrophoneEnabled,
    setCameraEnabled,
    setMicrophoneEnabled,
    screenSharingActive,
    setSharing,
    groupCall,
    setCheck,
    goMeet,
    setGoMeet
  } = props;
  
  const handleMicButtonPressed = () => {
    const micEnabled = localMicrophoneEnabled;
    localStream.getAudioTracks()[0].enabled = !micEnabled;
    setMicrophoneEnabled(!micEnabled);
  };

  const handleCameraButtonPressed = () => {
    const cameraEnabled = localCameraEnabled;
    localStream.getVideoTracks()[0].enabled = !cameraEnabled;
    setCameraEnabled(!cameraEnabled);
  };

  const handleScreenSharingButtonPressed = () => {
    switchForScreenSharingStream();
  };

  const handleHangUpButtonPressed = () => {
    hangUp();
  };

  const leaveRoom = () => {
    webRTCGroupCallHandler.leaveGroupCall();
    setGoMeet(!goMeet)
  };

  return (
    <div className={styles.buttonContainer}>
      <div className={styles.leftRow}>
        <ConversationButton onClickHandler={handleMicButtonPressed}>
          <button
            className={styles.audioButton}
            style={localMicrophoneEnabled?{backgroundColor: '#2D3440'}:{backgroundColor: '#CC525F'}}
          >
            <span
              style={{
                background: "url(https://realibi.kz/file/720488.png) no-repeat",
                backgroundPosition: "center",
                width: "26.6px",
                height: "26.6px",
                paddingRight: "30px",
              }}
            >
            </span>
          </button>
        </ConversationButton>
        <ConversationButton onClickHandler={handleCameraButtonPressed}>
          <button
            className={styles.videoButton}
            style={localCameraEnabled?{backgroundColor: '#2672ED'}:{backgroundColor: '#2D3440'}}
          >
            <span
              style={{
                background: "url(https://realibi.kz/file/972024.png) no-repeat",
                backgroundPosition: "center",
                width: "25.33px",
                height: "16.89px",
                paddingRight: "30px",
              }}
            >
            </span>
          </button>
        </ConversationButton>
        <ConversationButton onClickHandler={handleScreenSharingButtonPressed}>
          <button
            className={styles.shareButton}
            style={screenSharingActive?{backgroundColor: '#2672ED'}:{backgroundColor: '#2D3440'}}
          >
            <span
              style={{
                background: "url(https://realibi.kz/file/690286.png) no-repeat",
                backgroundPosition: "center",
                width: "24.53px",
                height: "20.32px",
                paddingRight: "30px",
              }}
            >
            </span>
          </button>
        </ConversationButton>
      </div>
      <div className={styles.rightRow}>
        <GroupCallButton onClickHandler={leaveRoom} label='Leave room' />
      </div>
    </div>
  );
};

export default ConversationButtons;

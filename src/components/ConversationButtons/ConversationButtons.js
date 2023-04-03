import React from 'react';
import ConversationButton from './ConversationButton';
import GroupCallButton from './../GroupCallButton/GroupCallButton';
import { getLocalStream, switchForScreenSharingStream, hangUp, changedCamera } from '../../../src/utils/webRTC/webRTCHandler';
import * as webRTCGroupCallHandler from '../../../src/utils/webRTC/webRTCGroupCallHandler';
import styles from './ConversationButtons.module.css';
import { setScreenSharingActive } from '../../../src/store/actions/callActions';
import store from '../../../src/store/store.js';


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
    setGoMeet, 
    role,
    groupCallRooms,
    teacher
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
    const sharable = !store.getState().call.screenSharingActive;
    switchForScreenSharingStream(!sharable, localStream.username, localStream.id);
    console.log('step1', {screenStatus: !sharable, username: localStream.username, streamId: localStream.id})
    changedCamera(sharable, localStream.username, localStream.id)
    console.log('PROPS', props)
    
  };

  const handleHangUpButtonPressed = () => {
    hangUp();
  };

  const leaveRoom = () => {
    webRTCGroupCallHandler.leaveGroupCall();
    setGoMeet(!goMeet)
  };

  const reconnect = () => {
    
    groupCallRooms?.forEach(room => {
      console.log('eee room', room)
      const roomy = groupCallRooms.find(room => room.hostName === teacher?.url);
        console.log('eee roomy and teacher', roomy, teacher)
        webRTCGroupCallHandler.joinGroupCall(roomy.socketId, roomy.roomId);

    })  
    //setGoMeet(!goMeet)
  }

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
        {role == 'teacher'?<>
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
        </ConversationButton></>:<></>}
      </div>
      <div className={styles.rightRow}>
        <GroupCallButton onClickHandler={leaveRoom} label='Leave room' />
      </div>
    </div>
  );
};

export default ConversationButtons;

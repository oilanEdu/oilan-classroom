import React, { useState, useEffect, useMemo } from 'react';
import ConversationButton from './ConversationButton';
import GroupCallButton from './../GroupCallButton/GroupCallButton';
import { getLocalStream, switchForScreenSharingStream, hangUp, changedCamera, closeCall } from '../../../src/utils/webRTC/webRTCHandler';
import * as webRTCGroupCallHandler from '../../../src/utils/webRTC/webRTCGroupCallHandler';
import styles from './ConversationButtons.module.css';
import { setScreenSharingActive } from '../../../src/store/actions/callActions';
import store from '../../../src/store/store.js';
import { useRouter } from "next/router";
import axios from "axios";
import globals from "../../../src/globals";


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
    teacher,
    studentsOfGroup,
    studentsInfoByRoom
  } = props;

  useEffect(() => {
    const handleRouteChange = (url) => {
      webRTCGroupCallHandler.leaveGroupCall();
      closeCall();
    };

    router.events.on('routeChangeStart', handleRouteChange);
      return () => {
        router.events.off('routeChangeStart', handleRouteChange);
      };
  }, []);

  const getStudentById = async (studentId) => {
    try {
      const response = await axios.post(`${globals.productionServerDomain}/getStudentById`, {
        student_id: studentId
      });
      console.log('studentio', response.data);
      return response.data[0];
    } catch (error) {
      console.error('studentio', error);
      throw error;
    }
  };

  const personalLink = async () => {
    console.log('studentio', role);
    if (role === 'teacher') {
      const redirectUrl = `cabinet/teacher/${encodeURIComponent(props.teacher?.url)}`;
      await router.push(redirectUrl).then(() => {
        window.location.reload();
      })
    } else {
      console.log('studentio tut')
      const student = await getStudentById(router.query.id);
      console.log('studentio student', student)
      const redirectUrl = `cabinet/student/${student?.nickname}/course/${studentsInfoByRoom?.url}?program=${studentsInfoByRoom?.program_id}`;
      console.log('studentio redirectUrl', redirectUrl)
      await router.push(redirectUrl).then(() => {
        console.log('studentio tut 2')
        window.location.reload();
      })
    }
  };

  const router = useRouter()
  
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
    switchForScreenSharingStream(!sharable, localStream.username, localStream.id, role, teacher?.url, studentsOfGroup);
    console.log('step1', {screenStatus: !sharable, username: localStream.username, streamId: localStream.id, studentsOfGroup: studentsOfGroup})
    // changedCamera(sharable, localStream.username, localStream.id, studentsOfGroup)
    console.log('PROPS', props)
    
  };

  const handleHangUpButtonPressed = () => {
    hangUp();
  };

  const leaveRoom = () => {
    webRTCGroupCallHandler.leaveGroupCall();
    setGoMeet(!goMeet)
    closeCall()
    personalLink()
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

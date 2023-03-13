import React, { useRef, useState, useEffect } from 'react';
import styles from "./RemoteVideoView.module.css";

const RemoteVideoView = props => {
  const { remoteStream, teacher, student, role } = props;
  const remoteVideoRef = useRef();
  const [stream, setStream] = useState(remoteStream);
  
  
  useEffect(() => {
    setStream(remoteStream);
    // console.log('PROPS', props)
    // console.log('remoteStream', remoteStream)
    // console.log('stream', stream)
    // console.log('remoteStream.getTracks()', remoteStream.getTracks())
    // console.log('remoteStream.getAudioTracks()[0].enabled', remoteStream.getAudioTracks()[0].enabled) 
  }, []);

  useEffect(() => {
    if (stream) {
      console.log('Remote video stream changed');
      const videoTrack = stream.getVideoTracks()[0];
      console.log('Video track enabled:', videoTrack.enabled);

      videoTrack.onmute = () => {
        console.log('Remote video track muted');
      };

      videoTrack.onunmute = () => {
        console.log('Remote video track unmuted');
      };
    }
  }, [stream]);

  useEffect(() => {
    // console.log('RVV', teacher, student)
    if (stream) {
      const remoteVideo = remoteVideoRef.current;

      remoteVideo.srcObject = stream;

      remoteVideo.onloadedmetadata = () => {
        remoteVideo.play();
      };
    }
  }, [stream]);

  return (
    <div className={styles.videoContainer}>
      <video className={styles.videoElement} ref={remoteVideoRef} autoPlay srcObject={stream}/>
      <div className={styles.infoRow}>
        {/*<div className={styles.litera}>{stream.id.slice(0, 10)}</div>*/}
        {props.role == 'teacher' ? <div className={styles.litera}>{student?.name}</div> : <div className={styles.litera}>{teacher?.name}</div>}
      </div>
    </div>
  );
};

export default RemoteVideoView;

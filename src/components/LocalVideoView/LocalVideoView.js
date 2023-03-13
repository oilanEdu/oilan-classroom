import React, { useRef, useEffect } from 'react';
import styles from "./LocalVideoView.module.css";

const LocalVideoView = props => {
  const { localStream, teacher, student, role } = props;
  const localVideoRef = useRef();

  useEffect(() => {
    // console.log('LVV', teacher, student)
    if (localStream) {
      // console.log('localStream', localStream)
      const localVideo = localVideoRef.current;
      localVideo.srcObject = localStream;

      localVideo.onloadedmetadata = () => {
        localVideo.play();
      };
    }
  }, [localStream]);

  return (
    <div className={styles.videoContainer}>
      <video className={styles.videoElement} ref={localVideoRef} autoPlay muted />
      <div className={styles.infoRow}>
        {/*<div className={styles.litera}>{localStream?.id.slice(0, 10)}</div>*/}
        {props.role == 'teacher' ? <div className={styles.litera}>{teacher?.name}</div> : <div className={styles.litera}>{student?.name}</div>}
      </div>
    </div>
  );
};

export default LocalVideoView;

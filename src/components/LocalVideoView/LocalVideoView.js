import React, { useRef, useEffect } from 'react';
import styles from "./LocalVideoView.module.css";

const LocalVideoView = props => {
  const { localStream } = props;
  const localVideoRef = useRef();

  useEffect(() => {
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
        <div className={styles.litera}>{localStream?.id.slice(0, 10)}</div>
      </div>
    </div>
  );
};

export default LocalVideoView;

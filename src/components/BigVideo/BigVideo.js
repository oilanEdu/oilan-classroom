import React, { useRef, useEffect } from 'react';
import styles from "./BigVideo.module.css";

const BigVideo = props => {
  const { localStream } = props;
  const localVideoRef = useRef();

  useEffect(() => {
    if (localStream) {
      console.log('localStream', localStream)
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
    </div>
  );
};

export default BigVideo;

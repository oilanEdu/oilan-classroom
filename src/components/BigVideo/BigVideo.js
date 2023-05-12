import React, { useRef, useEffect } from 'react';
import styles from "./BigVideo.module.css";

const BigVideo = props => {
  const { localStream } = props;
  const localVideoRef = useRef();

  useEffect(() => {
    if (localStream) {
      const localVideo = localVideoRef.current;
      localVideo.srcObject = localStream;

      localVideo.onloadedmetadata = () => {
        localVideo.play();
      };
    }
  }, [localStream]);

  const handleFullScreen = () => {
    const localVideo = localVideoRef.current;

    if (localVideo.requestFullscreen) {
      localVideo.requestFullscreen();
    } else if (localVideo.webkitRequestFullscreen) {
      localVideo.webkitRequestFullscreen();
    } else if (localVideo.mozRequestFullScreen) {
      localVideo.mozRequestFullScreen();
    } else if (localVideo.msRequestFullscreen) {
      localVideo.msRequestFullscreen();
    }
  }

  return (
    <div className={styles.videoContainer}>
      <video className={styles.videoElement} ref={localVideoRef} autoPlay muted />
      <button className={styles.fullScreen} onClick={handleFullScreen}>Full Screen</button>
    </div>
  );
};

export default BigVideo;
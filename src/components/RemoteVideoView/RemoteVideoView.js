import React, { useRef, useState, useEffect } from 'react';
import styles from "./RemoteVideoView.module.css";

const RemoteVideoView = props => {
  const { remoteStream } = props;
  const remoteVideoRef = useRef();
  const [stream, setStream] = useState(remoteStream);
  console.log('remoteStream in RemoteVideoView', remoteStream)
  
  useEffect(() => {
    setStream(remoteStream);
    
    console.log('PROPS', remoteStream.getAudioTracks())
  }, [remoteStream]);

  useEffect(() => {
    if (remoteStream) {
      const remoteVideo = remoteVideoRef.current;
      remoteVideo.srcObject = stream;

      remoteVideo.onloadedmetadata = () => {
        remoteVideo.play();
      };
    }
  }, [remoteStream]);

  return (
    <div className={styles.videoContainer}>
      <video className={styles.videoElement} ref={remoteVideoRef} autoPlay srcObject={stream}/>
      <div className={styles.infoRow}>
        <div className={styles.litera}>{stream.id.slice(0, 10)}</div>
      </div>
    </div>
  );
};

export default RemoteVideoView;

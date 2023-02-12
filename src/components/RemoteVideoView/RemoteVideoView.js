import React, { useRef, useState, useEffect } from 'react';

const styles = {
  videoContainer: {
    width: '100%',
    height: '100%'
  },
  videoElement: {
    width: '100%',
    height: '100%'
  }
};

const RemoteVideoView = props => {
  const { remoteStream } = props;
  const remoteVideoRef = useRef();
  const [stream, setStream] = useState(remoteStream);
  console.log('remoteStream in RemoteVideoView', remoteStream)
  
  useEffect(() => {
    setStream(remoteStream);
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
    <div style={styles.videoContainer}>
      RemoteVideoView {props.role}
      <video style={styles.videoElement} ref={remoteVideoRef} autoPlay srcObject={stream}/>
    </div>
  );
};

export default RemoteVideoView;

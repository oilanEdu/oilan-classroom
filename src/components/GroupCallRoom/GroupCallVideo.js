import React, { useRef, useState, useEffect } from 'react';
import store from '../../store/store';
import { setLocalStream, setCallState, callStates, setCallingDialogVisible, setCallerUsername, setCallRejected, setRemoteStream, setScreenSharingActive, resetCallDataState, setMessage } from '../../store/actions/callActions';
import * as wss from '../../utils/wssConnection/wssConnection';

const styles = {
  videoContainer: {
    width: '300px',
    height: '300px'
  },
  videoElement: {
    width: '100%',
    height: '100%'
  }
};

const GroupCallVideo = ({ role, stream, switchForScreenSharingStream }) => {
  const videoRef = useRef();
  const [localStream, setLocalStream] = useState(stream);

  useEffect(() => {
    const remoteGroupCallVideo = videoRef.current;
    remoteGroupCallVideo.srcObject = stream;
    remoteGroupCallVideo.onloadedmetadata = () => {
      remoteGroupCallVideo.play();
    };
  }, [stream]);

  const replaceTrack = (stream) => {
    const videoTracks = videoRef.current.srcObject.getVideoTracks();
    if (videoTracks.length > 0) {
      videoTracks[0].stop();
    }
    setLocalStream(stream);
  };

  return (
    <div style={styles.videoContainer}>
      GroupCallVideo {role}
      <video ref={videoRef} autoPlay style={styles.videoElement} />
      <button id="scShButton" onClick={() => { switchForScreenSharingStream(localStream, replaceTrack) }}>ScSh</button>
    </div>
  );
};

export default GroupCallVideo;
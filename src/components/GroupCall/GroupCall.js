import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import GroupCallButton from '../GroupCallButton/GroupCallButton';
import DirectCall from './../DirectCall/DirectCall';
import { callStates, setLocalCameraEnabled, setLocalMicrophoneEnabled, setScreenSharingActive } from '../../../src/store/actions/callActions';
import * as webRTCGroupCallHandler from '../../../src/utils/webRTC/webRTCGroupCallHandler';
import GroupCallRoom from '../GroupCallRoom/GroupCallRoom';

const GroupCall = (props) => {
  // console.log('GroupCall props', props)

  // eslint-disable-next-line
  const [mainIndex, setMainIndex] = useState()
  const [selectedStream, setSelectedStream] = useState(null);
  const { callState, localStream, groupCallActive, groupCallStreams, groupCallRooms, studentsInfoByRoom } = props;
  let x
  useEffect(() => {
    console.log('xcx2 groupCallStreams', groupCallStreams)
    console.log('xcx2 groupCallRooms', groupCallRooms)
    console.log('xcx2 localStream', localStream)
    console.log('GroupCall.js props', props);
    getLoStream()
    groupCallStreams.map(stream => {
      console.log('xcx2 streamsDetails', stream.getTracks())
    }) 
  }, [groupCallStreams, selectedStream]);

  const handleStreamSelect = (stream) => {
    setSelectedStream(stream);
    console.log('selectedStream', selectedStream);
  };

  const createRoom = () => {
    webRTCGroupCallHandler.createNewGroupCall();
  };

  const leaveRoom = () => {
    webRTCGroupCallHandler.leaveGroupCall();
  };

  const streamToUse = selectedStream ? 
  groupCallStreams.includes(selectedStream) ? 
    selectedStream : groupCallStreams[0] 
  : groupCallStreams[0];

  const getLoStream = () => {
    if (groupCallStreams.length === 1) {
      setMainIndex(groupCallStreams[0].id)
      // Если размер массива равен 1, то возвращаем нулевой элемент
      return groupCallStreams[0];
    } else if (groupCallStreams.length > 1) {
      // Если размер массива больше 1, то возвращаем элемент с индексом 1
      return groupCallStreams[1];
    } else {
      // Если массив пустой, то возвращаем null
      return null;
    }
  }

  return (
    <>
      {/*<DirectCall role={props.role} lo={mainIndex?(groupCallStreams[0]?.id === mainIndex)?groupCallStreams[0]:groupCallStreams[1]:(groupCallStreams.length === 1)?groupCallStreams[0]:groupCallStreams[1]}/>*/}
      <DirectCall role={props.role} lo={streamToUse}/>
      {!groupCallActive && localStream && callState !== callStates.CALL_IN_PROGRESS && 
        //<GroupCallButton onClickHandler={createRoom} label='Create room' />
        <></>
      }
      {groupCallActive && <GroupCallRoom studentsInfoByRoom={studentsInfoByRoom} onStreamSelect={handleStreamSelect} groupCallRooms={groupCallRooms} role={props.role} teacher={props.teacher} student={props.student} username={props.username} goMeet={props.goMeet} setGoMeet={props.setGoMeet} check={props.check} setCheck={props.setCheck} {...props} studentsOfGroup={props.studentsOfGroup} activeUsers={props.activeUsers}/>}
      {groupCallActive && 
        //<GroupCallButton onClickHandler={leaveRoom} label='Leave room' />
        <></>
      }
    </>
  );
};

const mapStoreStateToProps = ({ call }) => ({
  ...call
});

const mapActionsToProps = (dispatch) => {
  return {
    setCameraEnabled: enabled => dispatch(setLocalCameraEnabled(enabled)),
    setMicrophoneEnabled: enabled => dispatch(setLocalMicrophoneEnabled(enabled)),
    setSharing: active => dispatch(setScreenSharingActive(active))
  };
};

export default connect(mapStoreStateToProps, mapActionsToProps)(GroupCall);

import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import globals from "../../src/globals";
import styles from "./lesson.module.css";
import axios from "axios";
import Footer from "../../src/components/Footer/Footer";
import ScreenShare from "../../src/components/ScreenShare/ScreenShare";
import HeaderTeacher from "../../src/components/HeaderTeacher/HeaderTeacher";
import { selectIsConnectedToRoom, useHMSStore, useHMSActions, useScreenShare } from '@100mslive/react-sdk'
import JoinRoom from '../../src/components/joinRoom/joinRoom';
import {
  selectLocalPeer,
  selectPeers,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoEnabled,
  selectIsLocalScreenShared,
  selectCameraStreamByPeerID,
  selectScreenShareByPeerID
} from "@100mslive/hms-video-react";
import LessonContain from "../../src/components/LessonContain/LessonContain";
import TeacherHomeworksLesson from "../../src/components/TeacherHomeworksLesson/TeacherHomeworksLesson";
import HeaderStudent from "../../src/components/HeaderStudent/HeaderStudent";
import LessonExercisesForStudent from "../../src/components/LessonExercisesForStudent/LessonExercisesForStudent";
// import navigator from "navigator"
// import { getDisplayMedia } from "navigator"

const endPoint =
  "https://prod-in2.100ms.live/hmsapi/testdomain.app.100ms.live/";

const getToken = async (user_id, role) => {
  const response = await fetch(`${endPoint}api/token`, {
    method: "POST",
    body: JSON.stringify({
      user_id,
      role: role, //host, teacher, guest, student
      type: "app",
      room_id: "6397fa226d95375c45153bfa"
    })
  });
  const { token } = await response.json();
  return token;
};
const Lesson = (props) => {
  const { startScreenShare, stopScreenShare, screenShareStatus } = useScreenShare();

  const router = useRouter()
  const teacherUrl = router.query.url;
  const room = router.query.room;
  const jitsiServerUrl = 'https://meet.jit.si/';
  const role = router.query.role;
  const [teacher, setTeacher] = useState([]);
  const [student, setStudent] = useState([]);
  const [lesson, setLesson] = useState([]);
  const [rooms, updateRooms] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [numberOfEx, setNumberOfEx] = useState(0);
  const [selectedStudentId, setSelectedStudentId] = useState(0);
  const [answer, setAnswer] = useState([]);
  const [translationMode, setTranslationMode] = useState(false)

  useEffect(() => {
    loadBaseData();
    if (role == 'teacher') {
      loadTeacherData();
    }
    if (role == 'student') {
      loadStudentData();     
    }
  }, []); 

  useEffect(() => {
    getLessonExercises();
  }, [lesson]);


  const loadBaseData = async () => { 
    let data = room;
    let getLessonByRoomKey = await axios.post(`${globals.productionServerDomain}/getLessonByRoomKey/` + data);
    setLesson(getLessonByRoomKey['data'][0]);

    let getStudentByLessonKey = await axios.post(`${globals.productionServerDomain}/getStudentByLessonKey/` + data);
    setStudent(getStudentByLessonKey['data'][0]);
    setSelectedStudentId(student?.student_id);

    let getTeacherByLessonKey = await axios.post(`${globals.productionServerDomain}/getTeacherByLessonKey/` + data);
    setTeacher(getTeacherByLessonKey['data'][0]);
  };

  const loadTeacherData = async () => {
    let data = room;
    let getStudentByLessonKey = await axios.post(`${globals.productionServerDomain}/getStudentByLessonKey/` + data);
    setStudent(getStudentByLessonKey['data'][0]);
    setSelectedStudentId(student?.student_id);
  };

  const loadStudentData = async () => {
    let data = room;
    let getTeacherByLessonKey = await axios.post(`${globals.productionServerDomain}/getTeacherByLessonKey/` + data);
    setTeacher(getTeacherByLessonKey['data'][0]);
  };

  const getLessonExercises = async () => {
    let exer_number = 0
        
    let lessonExercises = await axios.post(`${globals.productionServerDomain}/getExercisesByLessonId/` + lesson?.lesson_id).then(res => {
      res.data.forEach(async exercise => {
        let studentId = student.student_id
        let exerciseId = exercise.id
        let data = {
          studentId,
          exerciseId
        };
      
        let exerciseAnswer = axios({ 
          method: "post",
          url: `${globals.productionServerDomain}/getAnswersByStudExId`,
          data: data,
        })
        .then(function (res) {
          if (res.data[0]) {
            exercise.answer_status = res.data[0].status
          } else { 
            console.log('ответов нет')
          }
        })
        .catch((err) => {
          alert("Произошла ошибка");
        });
          exer_number += 1
          exercise.exer_number = exer_number
          setNumberOfEx(exer_number)
          setIsLoaded(true)
        })
        setExercises(res.data) 
      }
    ) 
  };

  const getAnswer = async (studentId, exerciseId) => {
    const data = {
      studentId,
      exerciseId
    };
    await axios({
      method: "post",
      url: `${globals.productionServerDomain}/getAnswersByStudExId`,
      data: data,
    })
      .then(function (res) {
      setAnswer(res.data[0])
    })
    .catch((err) => {
      alert("Произошла ошибка");
    });
  };

  const updateAnswerStatus = async (id, status) => {
    const data = {
      id,
      status
    }; 
    
    await axios({
      method: "put",
      url: `${globals.productionServerDomain}/updateAnswerStatus`,
      data: data,
    })
    .then(function (res) {
      alert("Отметка о выполнении изменена"); 
    })
    .catch((err) => {
      alert("Произошла ошибка"); 
    });
  };

  const updateAnswerComment = async (studentId, exerciseId, text, date) => {
    const data = {
      studentId,
      exerciseId, 
      text,
      date
    }; 

    await axios({
      method: "post",
      url: `${globals.productionServerDomain}/createTeacherComment`,
      data: data,
    })
    .then(function (res) {
      alert("Комментарий отправлен"); 
    })
    .catch((err) => {
      alert("Произошла ошибка"); 
    });
  }
  
  const localPeer = useHMSStore(selectLocalPeer);
  const peers = useHMSStore(selectPeers);
  console.log('PEERS', peers)
  const hmsActions = useHMSActions();
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const isLocalAudioEnabled = useHMSStore(selectIsLocalAudioEnabled);
  const isLocalVideoEnabled = useHMSStore(selectIsLocalVideoEnabled);
  const isLocalScreenShared = useHMSStore(selectIsLocalScreenShared);
  
  const handleSubmit = async (userName) => {
    const token = await getToken(userName, role);
    hmsActions.join({ authToken: token, userName });
  };

  const toggleAudio = async () => {
    await hmsActions.setLocalAudioEnabled(!isLocalAudioEnabled);
  };

  const toggleVideo = async () => {
    await hmsActions.setLocalVideoEnabled(!isLocalVideoEnabled);
  };

  const toggleShared = async () => {
    await hmsActions.setScreenShareEnabled(!isLocalScreenShared);
    await hmsActions.setLocalVideoEnabled(!isLocalVideoEnabled);
  };

  const TeacherVideoTile = ({ peer, isLocal }) => {
    // const hmsActions = useHMSActions(); 
    const videoRef = useRef(null);
    const screenRef = useRef(null)
    const videoTrack = useHMSStore(selectCameraStreamByPeerID(peer.id));
    const screenTrack = useHMSStore(selectScreenShareByPeerID(peer.id));
    // hmsActions.setScreenShareEnabled(translationMode);
    useEffect(() => {
      (async () => {
        if (videoRef.current && videoTrack) {
          if (videoTrack.enabled) {
            await hmsActions.attachVideo(videoTrack.id, videoRef.current);
          } else {
            await hmsActions.detachVideo(videoTrack.id, videoRef.current);
          }
        } 
          if (screenRef.current && screenTrack) {
            if (screenTrack.enabled) {
              await hmsActions.attachVideo(screenTrack.id, screenRef.current);
            } else {
              await hmsActions.detachVideo(screenTrack.id, screenRef.current);
            }
          }
        
      })();
    }, [videoTrack, screenTrack]);

    return (
      <div style={{display: 'flex', flexDirection: 'column', width: '50%'}}>
        {videoTrack ? (
          <video ref={videoRef} autoPlay playsInline muted={isLocal} />
        ) : null}
        {/*{screenTrack ? (
          <video ref={screenRef} autoPlay playsInline muted={isLocal} />
        ) : null}*/}
        <div className="top-0 w-full absolute flex justify-center">
          <div className={styles.clientName}>{`${peer.roleName}` + ` ${peer.id}`}</div>
        </div>
      </div>
    );
  };

  const StudentVideoTile = ({ peer, isLocal }) => {
    // const hmsActions = useHMSActions(); 
    const videoRef = useRef(null);
    const screenRef = useRef(null)
    const videoTrack = useHMSStore(selectCameraStreamByPeerID(peer.id));
    const screenTrack = useHMSStore(selectScreenShareByPeerID(peer.id));
    // hmsActions.setScreenShareEnabled(translationMode);
    useEffect(() => {
      (async () => {
        if (videoRef.current && videoTrack) {
          if (videoTrack.enabled) {
            await hmsActions.attachVideo(videoTrack.id, videoRef.current);
          } else {
            await hmsActions.detachVideo(videoTrack.id, videoRef.current);
          }
        } 
          if (screenRef.current && screenTrack) {
            if (screenTrack.enabled) {
              await hmsActions.attachVideo(screenTrack.id, screenRef.current);
            } else {
              await hmsActions.detachVideo(screenTrack.id, screenRef.current);
            }
          }
        
      })();
    }, [videoTrack, screenTrack]);

    return (
      <div style={screenTrack?{display: 'flex', flexDirection: 'column', width: '85%'}:{display: 'flex', flexDirection: 'column', width: '15%'}}>
        {videoTrack && !screenTrack ? (
          <video ref={videoRef} autoPlay playsInline muted={isLocal} />
        ) : null}
        {screenTrack ? (
          <video ref={screenRef} autoPlay playsInline muted={isLocal} />
        ) : null}
        <div className="top-0 w-full absolute flex justify-center">
          <div className={styles.clientName}>
            {/*{`${peer.name}`}*/}
            {peer.roleName == 'student'?'Вы':`${peer.name}`}
          </div>
        </div>
      </div>
    );
  };

  return ( 
    <>
      <div style={{backgroundColor: "#f1faff", width: "100vw"}}>
        {role === "student" 
          ? <HeaderStudent name={student.name} surname={student.surname} /> 
          : <HeaderTeacher white={true} teacher={teacher} />
        }
        <div className={styles.cantainer}>
          {role == 'teacher' ? (
          <div className="App">
            { isConnected 
              ? ( <> 
                <div className={styles.translationBlock}>
                  {<>
                    {/*{localPeer && <TeacherVideoTile peer={localPeer} isLocal={true} />}*/}
                    {peers &&
                      peers
                        .filter((peer) => !peer.isLocal)
                        .map((peer) => {
                          return <><TeacherVideoTile isLocal={false} peer={peer} /></>;
                        })
                    } 
                  </>}
                </div>
                <div className="fixed bottom-0 h-10 bg-gray-400 w-screen flex items-center justify-center">
                  <button
                    className="text-xs uppercase tracking-wider bg-white py-1 px-2 rounded-lg shadow-lg text-indigo-500 mr-2"
                    onClick={toggleAudio}
                  >
                    {isLocalAudioEnabled ? "Mute" : "Unmute"}
                  </button>
                  <button
                    className="text-xs uppercase tracking-wider bg-white py-1 px-2 rounded-lg shadow-lg text-indigo-500"
                    onClick={toggleVideo}
                  >
                    {isLocalVideoEnabled ? "Hide" : "Unhide"}
                  </button>
                  <button
                    className="text-xs uppercase tracking-wider bg-white py-1 px-2 rounded-lg shadow-lg text-indigo-500"
                    onClick={toggleShared}
                  >
                    {isLocalScreenShared ? "Unshare" : "Share"}
                  </button>
                  
                </div>
              </>) 
              : <>
                <img src="https://realibi.kz/file/756332.png" style={{width: "100%"}} />
                <JoinRoom handleSubmit={handleSubmit} 
                  userName={(role == "teacher")
                    ? teacher.name
                    : student.name 
                  } 
                />
              </>
            }
          </div>
          ) : (
          <div className="App">
            { isConnected 
              ? ( <> 
                <div className={styles.translationBlock}>
                  {<>
                    {localPeer && <StudentVideoTile peer={localPeer} isLocal={true} />}
                    {peers &&
                      peers
                        .filter((peer) => !peer.isLocal)
                        .map((peer) => {
                          return peer.roleName == 'teacher' && <><StudentVideoTile isLocal={false} peer={peer} /></>;
                        })
                    } 
                  </>}
                </div>
                <div className="fixed bottom-0 h-10 bg-gray-400 w-screen flex items-center justify-center">
                  <button
                    className="text-xs uppercase tracking-wider bg-white py-1 px-2 rounded-lg shadow-lg text-indigo-500 mr-2"
                    onClick={toggleAudio}
                  >
                    {isLocalAudioEnabled ? "Mute" : "Unmute"}
                  </button>
                  <button
                    className="text-xs uppercase tracking-wider bg-white py-1 px-2 rounded-lg shadow-lg text-indigo-500"
                    onClick={toggleVideo}
                  >
                    {isLocalVideoEnabled ? "Hide" : "Unhide"}
                  </button>
                  
                  
                </div>
              </>) 
              : <>
                <img src="https://realibi.kz/file/756332.png" style={{width: "100%"}} />
                <JoinRoom handleSubmit={handleSubmit} 
                  userName={(role == "teacher")
                    ? teacher.name
                    : student.name
                  } 
                />
              </>
            }
          </div>
          )}
          <LessonContain
            role={role}
            user={role === "student" ? teacher : student}
            lesson={lesson}
          />
          {(role == "teacher")
            ? <TeacherHomeworksLesson 
              lesson={lesson}
              getAnswer={getAnswer}
              updateAnswerStatus={updateAnswerStatus} 
              updateAnswerComment={updateAnswerComment}
            />
            : <LessonExercisesForStudent exercises={exercises} student={student.id} padding={"40px 0"} brickBorder={"3px solid #f1faff"}/>
          }
        </div>            
        <Footer />
      </div>
    </>
  );
};

Lesson.getInitialProps = async (ctx) => {
  console.log('lol',ctx)
  if (ctx.query.url !== undefined) {
    return {
      url: ctx.query.url,
    }
  } else {
    return {};
  };
};

export default Lesson;
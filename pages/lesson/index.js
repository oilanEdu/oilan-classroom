import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { registerNewUser, connectWithWebSocket, getLocalUsername } from '../../src/utils/wssConnection/wssConnection';
import { setUsername } from '../../src/store/actions/dashboardActions';
import styles from './lesson.module.css';
import logo from '../../src/resources/logo.png';
import UsernameInput from '../../src/components/UsernameInput/UsernameInput';
import SubmitButton from '../../src/components/SubmitButton/SubmitButton';
import store from '../../src/store/store.js';
import { callStates } from '../../src/store/actions/callActions';
import * as webRTCHandler from '../../src/utils/webRTC/webRTCHandler';
import * as webRTCGroupHandler from '../../src/utils/webRTC/webRTCGroupCallHandler';
import * as webRTCGroupCallHandler from '../../src/utils/webRTC/webRTCGroupCallHandler';
import DashboardInformation from '../../src/components/Dashboardinformation/Dashboardinformation';
import DirectCall from '../../src/components/DirectCall/DirectCall';
import GroupCallRoomsList from '../../src/components/GroupCallRoomsList/GroupCallRoomsList';
import ActiveUsersList from '../../src/components/ActiveUsersList/ActiveUsersList';
import GroupCall from '../../src/components/GroupCall/GroupCall';
import globals from "../../src/globals";
import axios from "axios";
import HeaderStudent from "../../src/components/NewHeaderStudent/NewHeaderStudent";
import HeaderTeacher from "../../src/components/new_HeaderTeacher/new_HeaderTeacher";
import Footer from "../../src/components/Footer/Footer";
import NewHeaderStudent from '../../src/components/NewHeaderStudent/NewHeaderStudent';

const Index = () => {
	const [check, setCheck] = useState('empty')
	const router = useRouter()
	const [student, setStudent] = useState('')
	const [teacher, setTeacher] = useState('')
	const [studentsOfGroup, setStudentsOfGroup] = useState([])
	const [selectedStudentId, setSelectedStudentId] = useState(0);
	const [room, setRoom] = useState(null)
	const [role, setRole] = useState(null)
	const [needRoom, setNeedRoom] = useState(true)
	const [goMeet, setGoMeet] = useState(false)
	const [actualRoom, setActualRoom] = useState('')
  const [isRoom, setIsRoom] = useState(false)
	const [studentsInfoByRoom, setStudentsInfoByRoom] = useState()

	const getStudentInfoByRoom = async () => {
		if (router.query.room) {
			let room = router.query.room
			let getStudentsInfoByRoom = await axios.post(`${globals.productionServerDomain}/getStudentsInfoByRoom/` + room).then(res => {
				setStudentsInfoByRoom(res['data'][0])
				console.log('getStudentsInfoByRoom', res['data'][0])
			})
			.catch((err) => {
				err
			}
			)
		}
	}
	useEffect(() => {
		getStudentInfoByRoom()
	}, [router.query.room])

	useEffect(() => {
		// console.log('localStorage', localStorage)
		console.log('actualRoom', actualRoom)
	   	setRoom(router.query.room)
	   	setRole(router.query.role)
	   	// console.log('check', check)
	}, [router.query, actualRoom]);

	const groupStudents = async () => {
		if (router.query.groupId != "undefined" && router.query.role == 'teacher') {
			let test = (+router.query.groupId)
			const dataStudents = {
			  id: teacher?.teacher_id,
			  sort: ""
			}
			let teacherGroups = await axios.post(`${globals.productionServerDomain}/getStudentsGroupsByTeacherId/`, dataStudents)
			let currentGroupLocal = teacherGroups['data'].find(el => el.id === (+router.query.groupId))
			let getStudentsByGroupId = await axios.post(`${globals.productionServerDomain}/getStudentsByGroupId/` + (+router.query.groupId))
			let filteredStudents = teacherGroups['data'].filter(el => getStudentsByGroupId['data'].some(el2 => el.student_id === el2.student_id && el.course_id === el2.course_id && el.program_id === el2.program_id && el.title === currentGroupLocal.title)) 
			setStudentsOfGroup(filteredStudents)
		} else {
			setStudentsOfGroup([student])
		}
	}
	useEffect(() => {
		groupStudents()
		// debugger
		if (teacher && student) {
			getLocalUsername(router.query.role == 'teacher' ? teacher.url : student.nickname)
		}
		// debugger
	}, [router, teacher])

	// console.log('router', room) 
	// console.log('role', role)

	useEffect(() => {
      (async () => {
      	if (!teacher || !student) {
		    let data = room;
		    // console.log(room);
		    let getStudentByLessonKey = await axios.post(`${globals.productionServerDomain}/getStudentByLessonKey/` + data);
		    setStudent(getStudentByLessonKey['data'][0]);
		    setSelectedStudentId(student?.student_id);
		    let getTeacherByLessonKey = await axios.post(`${globals.productionServerDomain}/getTeacherByLessonKey/` + data);
		    setTeacher(getTeacherByLessonKey['data'][0]);
        }
      })();
    }, [teacher, student]);

	function LoginPage() {
	  const [username, setUsernameState] = useState('');
	  const dispatch = useDispatch();
	  const router = useRouter();
	  const handleSubmitButtonPressed = () => {
	  	// console.log('status', check)
	  	connectWithWebSocket()
	  	if (!room || !student || username || !role || !teacher){
			// debugger
	  		registerNewUser(username);
	    	dispatch(setUsername(username));
	  	} else {
			// debugger
	  		registerNewUser((role == 'teacher')?teacher?.url:student?.nickname);
	    	dispatch(setUsername((role == 'teacher')?teacher?.url:student?.nickname));
	  	}
	  };

    useEffect(() => {
	  if (!room || !student || username || !role || !teacher){

	  } else {
		handleSubmitButtonPressed()
		setCheck('classroom')
	  }
    }, [room || student || username || role || teacher])

	  return (
		''
	  );
	}

	const joinRoom = (groupCallRooms) => {
		groupCallRooms?.forEach(roomy => {
			if (roomy.hostName == teacher?.url){
				setNeedRoom(false)
				if (role == 'student'){
					const roomy = groupCallRooms.find(roomy => roomy.hostName === teacher?.url);
					webRTCGroupCallHandler.joinGroupCall(roomy.socketId, roomy.roomId, role === 'student' ? teacher?.url : student?.nickname);
					setActualRoom(roomy)
				}
			}
		})	
		setGoMeet(true)
	}

	const createRoom = (groupCallRooms) => {
		const roomExists = groupCallRooms.some(roomy => roomy.hostName === teacher?.url);
    setIsRoom(roomExists)
  		if (roomExists) {
  			console.log('roomExists', roomExists)
    		setNeedRoom(false)
  		} else {
    		if (needRoom) {
    			console.log('needRoom', needRoom)
      			webRTCGroupCallHandler.createNewGroupCall();
      			setNeedRoom(false);
    		} 
  		}
  		setGoMeet(true)
	}
	function Dashboard2(props) {
		const username = useSelector(state => state.dashboard.username);
		const callState = useSelector(state => state.call.callState);
		const groupCallRooms = useSelector(state => state.dashboard.groupCallRooms);
		const activeUsers = useSelector(state => state.dashboard.activeUsers);
		let roomExists
		const leaveClick = () => {
			window.location.reload()
		} 
		useEffect(() => {
			webRTCHandler.getLocalStream();
			webRTCGroupHandler.connectWithMyPeer(username, role);
			roomExists = groupCallRooms.some(roomy => roomy.hostName === teacher?.url);
			setIsRoom(roomExists)
      console.log('groupCallRooms', groupCallRooms)
		}, [groupCallRooms, roomExists, webRTCHandler]);

		return (
			<>
				{goMeet?
					<>
						{role === "student" 
        				  ? 
        				  <NewHeaderStudent name={student?.name} surname={student?.surname} nickname={student?.nickname} courseUrl={studentsInfoByRoom?.url} programId={studentsInfoByRoom?.program_id}/>
        				  : <HeaderTeacher white={true} teacher={teacher} />
        				}
						<div className={styles.all}>
      					<div style={{backgroundColor: "#white", width: "100%"}}>
						<div className={styles.cantainer}>
							<div className={styles.dashboard_left_section}>
								
								<div className={styles.translationBlock}>
									{/*<DirectCall role={role}/>*/}
									<GroupCall studentsInfoByRoom={studentsInfoByRoom} role={role} teacher={teacher} student={student} groupCallRooms={groupCallRooms} activeUsers={activeUsers} username={username} check={check} setCheck={setCheck} goMeet={goMeet} setGoMeet={setGoMeet} studentsOfGroup={studentsOfGroup}/>
									{callState !== callStates.CALL_IN_PROGRESS && (
										//<DashboardInformation username={username} />
										<></>
									)}
								</div>
								{/*<div className={styles['dashboard_rooms_container']}>
									<GroupCallRoomsList />
								</div>*/}
							</div>
							{/*<div className={styles['dashboard_right_section']}>
								<ActiveUsersList />
							</div>
							<button onClick={() => {leaveClick()}}>Leave</button>*/}
						</div>
						</div>
						</div>
						<Footer />
					</>:
					// <>
					// 	<img src="https://realibi.kz/file/756332.png" style={{width: "80%", marginLeft: '10%'}} />
					// 	<div className={styles.joinButtonBlock}>
					// 		<button 
					// 			className={styles.joinButton}
					// 			onClick={() => {
					// 				if (!roomExists){
					// 					createRoom(groupCallRooms)
					// 				} 
					// 				if (roomExists) {
					// 					joinRoom(groupCallRooms)
					// 					setGoMeet(true)
					// 				}
					// 		}}>
					// 			Перейти к занятию
					// 		</button>
					// 	</div>
					// </>

              <div className={styles.all}>
      <div style={{backgroundColor: "#white", width: "100%"}}>
        {role === "student" 
          ? 
          <NewHeaderStudent name={student?.name} surname={student?.surname} nickname={student?.nickname} courseUrl={studentsInfoByRoom?.url} programId={studentsInfoByRoom?.program_id}/>
          : <HeaderTeacher white={true} teacher={teacher} />
        }
        <div className={styles.cantainer}>
          <div className={styles.allReady}>
          {/* <p>Всё готово и настроено</p>
          <button>Присоедениться к уроку</button> */}
          <h1 style={{color: "white", marginBottom: "40px"}}>{(isRoom || role === "teacher")? "Всё готово и настроено" : "Ожидание преподавателя"}</h1>
          <form
                style={{textAlign: "end"}}
                onSubmit={(e) => {
                  // e.preventDefault();
                  // getToken()
                  // // createRoom()
                  // // handleSubmit(userName);
                }}
              >
                {(isRoom || role === "teacher") && <button 
                  style={{
                    background: "#ffffff",
                    borderRadius: "5px",
                    border: "none",
                    marginBottom: "15%",
                    color: "black",
                    fontSize: "24px",
                    padding: "20px 40px"
                  }}
                  // className="px-4 py-2 bg-blue-700 rounded-lg text-white"
                  onClick={() => {
									if (role == 'teacher') {
										createRoom(groupCallRooms)
									} else {
										joinRoom(groupCallRooms)
										setGoMeet(true)
									}
							}}
                >
                  <span
                    style={{
                      // background: "url(https://realibi.kz/file/892662.png) no-repeat",
                      // backgroundPosition: "right",
                      // backgroundSize: "18px",
                      // paddingRight: "30px",
                    }}
                  >
                    Присоедениться к уроку
                  </span>
                </button>}
              </form>
          </div>
          </div>
          </div>
		  <Footer />
          </div>
				}
			</>
					
		);
	}

return (
    <Provider store={store}>
      {check==='empty'?<LoginPage />:<></>}
      {check==='classroom'?<Dashboard2 />:<></>}
    </Provider>
  );
}


export default Index


// import { useRouter } from "next/router";
// import React, { useEffect, useState, useRef } from "react";
// import globals from "../../src/globals";
// import styles from "./lesson.module.css";
// import axios from "axios";
// import Footer from "../../src/components/Footer/Footer";
// import ScreenShare from "../../src/components/ScreenShare/ScreenShare";
// import HeaderTeacher from "../../src/components/new_HeaderTeacher/new_HeaderTeacher";
// import Header from "../../src/components/Header/Header";
// import { selectIsConnectedToRoom, useHMSStore, useHMSActions, useScreenShare } from '@100mslive/react-sdk'
// import JoinRoom from '../../src/components/joinRoom/joinRoom';
// import {
//   selectLocalPeer,
//   selectPeers,
//   selectIsLocalAudioEnabled,
//   selectIsLocalVideoEnabled,
//   selectIsLocalScreenShared,
//   selectCameraStreamByPeerID,
//   selectScreenShareByPeerID,
//   selectAudioTrackByPeerID 
// } from "@100mslive/hms-video-react";
// import LessonContain from "../../src/components/LessonContain/LessonContain";
// import TeacherHomeworksLesson from "../../src/components/TeacherHomeworksLesson/TeacherHomeworksLesson";
// import HeaderStudent from "../../src/components/NewHeaderStudent/NewHeaderStudent";
// import LessonExercisesForStudent from "../../src/components/LessonExercisesForStudent/LessonExercisesForStudent";
// import { Provider, useSelector, useDispatch } from 'react-redux';
// import { registerNewUser, connectWithWebSocket } from '../../src/utils/wssConnection/wssConnection';
// import { setUsername } from '../../src/store/actions/dashboardActions';
// import logo from '../../src/resources/logo.png';
// import UsernameInput from '../../src/components/UsernameInput/UsernameInput';
// import SubmitButton from '../../src/components/SubmitButton/SubmitButton';
// import store from '../../src/store/store.js';
// import { callStates } from '../../src/store/actions/callActions';
// import * as webRTCHandler from '../../src/utils/webRTC/webRTCHandler';
// import * as webRTCGroupHandler from '../../src/utils/webRTC/webRTCGroupCallHandler';
// import * as webRTCGroupCallHandler from '../../src/utils/webRTC/webRTCGroupCallHandler';
// import DashboardInformation from '../../src/components/Dashboardinformation/Dashboardinformation';
// import DirectCall from '../../src/components/DirectCall/DirectCall';
// import GroupCallRoomsList from '../../src/components/GroupCallRoomsList/GroupCallRoomsList';
// import ActiveUsersList from '../../src/components/ActiveUsersList/ActiveUsersList';
// import GroupCall from '../../src/components/GroupCall/GroupCall';

// const endPoint =
//   "https://prod-in2.100ms.live/hmsapi/testdomain.app.100ms.live/";

// const getToken = async (user_id, role, teacher, idOfNewRoom) => {
//   // let room_key = '6397fa226d95375c45153bfa'
//   // if (teacher == 13) {
//   //   room_key = '63da37d9cd8175701aac0217'
//   // }
//   // if (teacher == 6) {
//   //   room_key = '63da37e5cd8175701aac0218'
//   // }
//   // if (teacher == 4) {
//   //   room_key = '63da37f0da7e7ca812840b55'
//   // }
//   // if (teacher == 1) {
//   //   room_key = '63da37fbda7e7ca812840b56'
//   // }
//   //

//   //
//   let response
//   try {
//      response = await fetch(`${endPoint}api/token`, {
//       method: "POST",
//       body: JSON.stringify({
//         user_id,
//         role: role, //host, teacher, guest, student
//         type: "app",
//         room_id: idOfNewRoom
//       })
//     }); 
//   } catch (error) {
//     console.log(error, "token error");
//   }
//   const { token } = await response.json();
//   return token;
// };
// const Lesson = (props) => {
//   const { startScreenShare, stopScreenShare, screenShareStatus } = useScreenShare();

//   const router = useRouter()
//   const [token, setToken] = useState('')
//   const [idOfNewRoom, setIdOfNewRoom] = useState()
//   const teacherUrl = router.query.url;
//   const studentId = router.query.id;
//   const room = router.query.room;
//   const jitsiServerUrl = 'https://meet.jit.si/';
//   const role = router.query.role;
//   const [teacher, setTeacher] = useState([]);
//   const [student, setStudent] = useState([]);
//   const [lesson, setLesson] = useState([]);
//   const [rooms, updateRooms] = useState([]);
//   const [exercises, setExercises] = useState([]);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [numberOfEx, setNumberOfEx] = useState(0);
//   const [selectedStudentId, setSelectedStudentId] = useState(0);
//   const [answer, setAnswer] = useState([]);
//   const [translationMode, setTranslationMode] = useState(false)
//   const [showMessageCantHearYou, setShowMessageCantHearYou] = useState(true)
//   useEffect(() => {
//     const timerId = setTimeout(() => {
//       setShowMessageCantHearYou(false)
//     }, 600000);
  
//     return () => {
//       clearTimeout(timerId);
//     };
//   }, []);
  
//   // innerWidth
//   const [width, setWidth] = useState();
//   const [height, setHeight] = useState();
//   const [percentOfUnderTile, setPercentOfUnderTile] = useState("16.5%")
//   useEffect(() => {
//     console.log(percentOfUnderTile, "percentOfUnderTile");
//   }, [percentOfUnderTile])

//   // useEffect(() => {
//   //   function handleResize() {
//   //     setWidth(window.innerWidth);
//   //     setHeight(window.innerHeight);
//   //   }
//   //   window.addEventListener('resize', handleResize);
//   //   return () => window.removeEventListener('resize', handleResize);
//   // }, []);

//   useEffect(() => {
//     console.log(window.innerWidth, "width2");
//     if (window.innerWidth <= 480) {
//       setPercentOfUnderTile("50%")
//     }
//     if (window.innerWidth <= 768 && window.innerWidth > 480) {
//       setPercentOfUnderTile("30%")
//     }
//     if (window.innerWidth <= 1000 && window.innerWidth > 768) {
//       setPercentOfUnderTile("20%")
//     }

//   }, [])
//   // innerWidth

//   console.log(student);

//   useEffect(() => {
//     console.log('VW', window.innerWidth)
//     loadBaseData();
//     if (role == 'teacher') {
//       loadTeacherData();
//     }
//     if (role == 'student') {
//       loadStudentData();     
//     }
//   }, []); 
//   useEffect(() => {
//     console.log(room, "room");
//   }, [room])

//   useEffect(() => {
//     getLessonExercises();
//   }, [lesson]);

//   const loadBaseData = async () => { 
//     let data = room;

//     console.log(data);
//     const studentData = {
//       studentId: studentId
//     }
//     let getLessonByRoomKey = await axios.post(`${globals.productionServerDomain}/getLessonByRoomKey/` + data);
//     console.log(getLessonByRoomKey);
//     setLesson(getLessonByRoomKey['data'][0]);

//     if (role == 'teacher') {
//       let getStudentByLessonKey = await axios.post(`${globals.productionServerDomain}/getStudentByLessonKey/` + data);
//       setStudent(getStudentByLessonKey['data'][0]);
//     } else {
//       let getStudentByIdForLesson = await axios.post(`${globals.productionServerDomain}/getStudentByIdForLesson/`, studentData);
//       setStudent(getStudentByIdForLesson['data'][0]);
//     }
    
//     console.log(studentId);
    
//     setSelectedStudentId(student?.student_id);

//     let getTeacherByLessonKey = await axios.post(`${globals.productionServerDomain}/getTeacherByLessonKey/` + data);
//     console.log(data);
//     setTeacher(getTeacherByLessonKey['data'][0]);
//   };

//   const loadTeacherData = async () => {
//     let data = room;
//     console.log(room);
//     let getStudentByLessonKey = await axios.post(`${globals.productionServerDomain}/getStudentByLessonKey/` + data);
//     setStudent(getStudentByLessonKey['data'][0]);
//     setSelectedStudentId(student?.student_id);
//   };

//   const loadStudentData = async () => {
//     let data = room;
//     console.log(room);
//     // if (peers.length === 0) {
//       let getTeacherByLessonKey = await axios.post(`${globals.productionServerDomain}/getTeacherByLessonKey/` + data);
//       setTeacher(getTeacherByLessonKey['data'][0]);
//     // } else {
//     //   let getStudentByIdForLesson = await axios.post(`${globals.productionServerDomain}/getStudentByIdForLesson/`, studentData);
//     //   setStudent(getStudentByIdForLesson['data'][0]);
//     // }
    
//   };

//   const getLessonExercises = async () => {
//     let exer_number = 0

//     console.log(lesson);
        
//     let lessonExercises = await axios.post(`${globals.productionServerDomain}/getExercisesByLessonId/` + lesson?.lesson_id).then(res => {
//       res.data.forEach(async exercise => {
//         // let studentId = student.student_id
//         let exerciseId = exercise.id
//         let data = {
//           studentId,
//           exerciseId
//         };
      
//         let exerciseAnswer = axios({ 
//           method: "post",
//           url: `${globals.productionServerDomain}/getAnswersByStudExId`,
//           data: data,
//         })
//         .then(function (res) {
//           if (res.data[0]) {
//             exercise.answer_status = res.data[0].status
//           } else { 
//             console.log('ответов нет')
//           }
//         })
//         .catch((err) => {
//           alert("Произошла ошибка");
//         });
//           exer_number += 1
//           exercise.exer_number = exer_number
//           setNumberOfEx(exer_number)
//           setIsLoaded(true)
//         })
//         setExercises(res.data) 
//       }
//     ) 
//   };

//   const getAnswer = async (studentId, exerciseId) => {
//     const data = {
//       studentId,
//       exerciseId
//     };
//     await axios({
//       method: "post",
//       url: `${globals.productionServerDomain}/getAnswersByStudExId`,
//       data: data,
//     })
//       .then(function (res) {
//       setAnswer(res.data[0])
//     })
//     .catch((err) => {
//       alert("Произошла ошибка");
//     });
//   };

//   const updateAnswerStatus = async (id, status) => {
//     const data = {
//       id,
//       status
//     }; 
    
//     await axios({
//       method: "put",
//       url: `${globals.productionServerDomain}/updateAnswerStatus`,
//       data: data,
//     })
//     .then(function (res) {
//       alert("Отметка о выполнении изменена"); 
//     })
//     .catch((err) => {
//       alert("Произошла ошибка"); 
//     });
//   };

//   const updateAnswerComment = async (studentId, exerciseId, text, date) => {
//     const data = {
//       studentId,
//       exerciseId, 
//       text,
//       date
//     }; 

//     await axios({
//       method: "post",
//       url: `${globals.productionServerDomain}/createTeacherComment`,
//       data: data,
//     })
//     .then(function (res) {
//       alert("Комментарий отправлен"); 
//     })
//     .catch((err) => {
//       alert("Произошла ошибка"); 
//     });
//   }
  
//   const localPeer = useHMSStore(selectLocalPeer);
//   const peers = useHMSStore(selectPeers);
//   console.log('PEERS', peers)
//   const hmsActions = useHMSActions();
//   const isConnected = useHMSStore(selectIsConnectedToRoom);
//   const isLocalAudioEnabled = useHMSStore(selectIsLocalAudioEnabled);
//   const isLocalVideoEnabled = useHMSStore(selectIsLocalVideoEnabled);
//   const isLocalScreenShared = useHMSStore(selectIsLocalScreenShared);

//   const handleSubmit = async (userName) => {
//     const token = await getToken(userName, role, teacher.teacher_id, idOfNewRoom);
//     hmsActions.join({ authToken: token, userName });
//   };

//   const toggleAudio = async () => {
//     await hmsActions.setLocalAudioEnabled(!isLocalAudioEnabled);
//   };

//   const toggleVideo = async () => {
//     await hmsActions.setLocalVideoEnabled(!isLocalVideoEnabled);
//   };

//   const toggleShared = async () => {
//     await hmsActions.setScreenShareEnabled(!isLocalScreenShared);
//     // await hmsActions.setLocalVideoEnabled(!isLocalVideoEnabled);
//   };

//   const leaveRoom = async () => {
//     try {
//       // Останавливаем демонстрацию экрана, если она была запущена
//       if (isLocalScreenShared) {
//         await hmsActions.setScreenShareEnabled(false);
//       }

//       // Отключаем локальное видео, если оно было включено
//       if (isLocalVideoEnabled) {
//         await hmsActions.setLocalVideoEnabled(false);
//       }

//       // Отключаем локальный аудио, если он был включен
//       if (isLocalAudioEnabled) {
//         await hmsActions.setLocalAudioEnabled(false);
//       }

//       // Выходим из комнаты
//       await hmsActions.leave();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const LJ = async () => {
//     try {
//       // Останавливаем демонстрацию экрана, если она была запущена
//       if (isLocalScreenShared) {
//         await hmsActions.setScreenShareEnabled(false);
//       }

//       // Отключаем локальное видео, если оно было включено
//       if (isLocalVideoEnabled) {
//         await hmsActions.setLocalVideoEnabled(false);
//       }

//       // Отключаем локальный аудио, если он был включен
//       if (isLocalAudioEnabled) {
//         await hmsActions.setLocalAudioEnabled(false);
//       }

//       // Выходим из комнаты
//       await hmsActions.leave();
//     } catch (error) {
//       console.error(error);
//     }
//     const token = await getToken(userName, role, teacher.teacher_id, idOfNewRoom);
//     const userName = (role == "teacher")
//                     ? teacher?.name
//                     : student?.name 
                  
//     hmsActions.join({ authToken: token, userName });

//   };

//   const TeacherVideoTile = ({ peer, isLocal }) => {
//     // const hmsActions = useHMSActions(); 
//     const videoRef = useRef(null);
//     const screenRef = useRef(null)
//     const videoTrack = useHMSStore(selectCameraStreamByPeerID(peer.id));
//     const screenTrack = useHMSStore(selectScreenShareByPeerID(peer.id));
//     // hmsActions.setScreenShareEnabled(translationMode);
//     useEffect(() => {
//       (async () => {
//         if (videoRef.current && videoTrack) {
//           if (videoTrack.enabled) {
//             await hmsActions.attachVideo(videoTrack.id, videoRef.current);
//           } else {
//             await hmsActions.detachVideo(videoTrack.id, videoRef.current);
//           }
//         } 
//           if (screenRef.current && screenTrack) {
//             if (screenTrack.enabled) {
//               await hmsActions.attachVideo(screenTrack.id, screenRef.current);
//             } else {
//               await hmsActions.detachVideo(screenTrack.id, screenRef.current);
//             }
//           }
        
//       })();
//     }, [videoTrack, screenTrack]);

//     return (
//       <div className={styles.innerBlock}>
//         {videoTrack ? (
//           <video className={styles.bigSquare} style={isLocalScreenShared || !isLocalVideoEnabled ? {display: 'none'}:{display: 'flex'}} ref={videoRef} autoPlay playsInline muted={isLocal} />
//         ) : null}
//         {screenTrack ? (
//           <video className={styles.bigSquare} ref={screenRef} autoPlay playsInline muted={isLocal} />
//         ) : null}
//         {!isLocalVideoEnabled && !isLocalScreenShared ? (
//           <div className={styles.zaglushkahaha}></div>
//           ) : null}
//         {/*<div className="top-0 w-full absolute flex justify-center">
//           <div className={styles.clientName}>{`${peer.roleName}` + ` ${peer.id}`}</div>
//         </div>*/}
//       </div>
//     );
//   };

//   const TeacherUnderline = ({ peer, isLocal }) => {
//     // const hmsActions = useHMSActions(); 
//     const videoRef = useRef(null);
//     const screenRef = useRef(null)
//     const videoTrack = useHMSStore(selectCameraStreamByPeerID(peer.id));
//     const audioTrack = useHMSStore(selectAudioTrackByPeerID(peer.id));
//     // const firstAudioTrack = audioTracks[0];
//     const screenTrack = useHMSStore(selectScreenShareByPeerID(peer.id));
//     // hmsActions.setScreenShareEnabled(translationMode);
//     console.log('CLIENT AUDIO', audioTrack)
//     useEffect(() => {
//       (async () => {
//         if (videoRef.current && videoTrack) {
//           if (videoTrack.enabled) {
//             await hmsActions.attachVideo(videoTrack.id, videoRef.current);
//           } else {
//             await hmsActions.detachVideo(videoTrack.id, videoRef.current);
//           }
//         }       
//       })();
//     }, [videoTrack]);

//     return (
//       <div style={{display: 'flex', flexDirection: 'column', width: "122px", marginRight: '12px'}}>
//         {videoTrack?.enabled ? (
//           <video style={{position: 'relative', display: 'flex', flexDirection: 'column', width: '100%', borderRadius: '6px'}} className={styles.minVidArea} ref={videoRef} autoPlay playsInline muted={isLocal} ></video>
//         ) : <div className={styles.zaglushkahahaMini}></div>}
//         <div style={{transform: 'translate(0px, -30px)', bottom: '6px'}}>
//           {peer.roleName == 'teacher'?
//             (<div className={styles.clientName}>
//               <div className={styles.hatIco}>
//                 <span
//                   style={{
//                     background: "url(https://realibi.kz/file/7922.png) no-repeat",
//                     backgroundPosition: "center",
//                     width: "13px",
//                     height: "11.78px",
//                     paddingRight: "30px",
//                   }}
//                 >
//                 </span>
//               </div>
//               <div className={styles.teacherLitera}>
//                 {peer.name}
//               </div>
//             </div>):
//             (<div className={styles.clientName}>
//               <div className={styles.studentMiniRow}>
//               {audioTrack?.enabled? null : (
                
//                   <div className={styles.micIco}>
//                     <span
//                       style={{
//                         background: "url(https://realibi.kz/file/384854.png) no-repeat",
//                         backgroundPosition: "center",
//                         width: "8.89px",
//                         height: "8.89px",
//                         paddingRight: "30px",
//                       }}
//                     >
//                     </span>
//                   </div>)} 
//                   {peer.roleName == 'teacher'?'Вы':`${peer.roleName}` + ` ${peer.id.slice(0, 5)}`}
//                 </div>
//             </div>)
//           }
          

//         </div>
//       </div>
//     );
//   };

//   const StudentVideoTile = ({ peer, isLocal }) => {
//     // const hmsActions = useHMSActions(); 
//     const videoRef = useRef(null);
//     const screenRef = useRef(null)
//     const videoTrack = useHMSStore(selectCameraStreamByPeerID(peer.id));
//     const screenTrack = useHMSStore(selectScreenShareByPeerID(peer.id));
//     console.log('SCREENTRACK', screenTrack)
//     // hmsActions.setScreenShareEnabled(translationMode);
//     useEffect(() => {
//       (async () => {
//         if (videoRef.current && videoTrack) {
//           if (videoTrack.enabled) {
//             await hmsActions.attachVideo(videoTrack.id, videoRef.current);
//           } else {
//             await hmsActions.detachVideo(videoTrack.id, videoRef.current);
//           }
//         } 
//           if (screenRef.current && screenTrack) {
//             if (screenTrack.enabled) {
//               await hmsActions.attachVideo(screenTrack.id, screenRef.current);
//             } else {
//               await hmsActions.detachVideo(screenTrack.id, screenRef.current);
//             }
//           }
        
//       })();
//     }, [videoTrack, screenTrack]);

//     return (
//       <div className={styles.innerBlock}>
//         {videoTrack && !screenTrack ? (
//           <video className={styles.bigSquare} style={isLocalScreenShared || !isLocalVideoEnabled ? {display: 'none'}:{display: 'flex'}} ref={videoRef} autoPlay playsInline muted={isLocal} />
//         ) : null}
//         {screenTrack ? (
//           <video className={styles.bigSquare} ref={screenRef} autoPlay playsInline muted={isLocal} />
//         ) : null}
//         {!isLocalVideoEnabled && isLocalScreenShared ? (
//           <div className={styles.zaglushkahaha}></div>
//           ) : null}
//         {/*<div className="top-0 w-full absolute flex justify-center">
//           <div className={styles.clientName}>{`${peer.roleName}` + ` ${peer.id}`}</div>
//         </div>*/}
//       </div>
//     );
//   };

//   const StudentUnderline = ({ peer, isLocal }) => {
//     // const hmsActions = useHMSActions(); 
//     const videoRef = useRef(null);
//     const screenRef = useRef(null)
//     const videoTrack = useHMSStore(selectCameraStreamByPeerID(peer.id));
//     const audioTrack = useHMSStore(selectAudioTrackByPeerID(peer.id));
//     // const firstAudioTrack = audioTracks[0];
//     const screenTrack = useHMSStore(selectScreenShareByPeerID(peer.id));
//     // hmsActions.setScreenShareEnabled(translationMode);
//     console.log('CLIENT AUDIO', audioTrack)
//     useEffect(() => {
//       (async () => {
//         if (videoRef.current && videoTrack) {
//           if (videoTrack.enabled) {
//             await hmsActions.attachVideo(videoTrack.id, videoRef.current);
//           } else {
//             await hmsActions.detachVideo(videoTrack.id, videoRef.current);
//           }
//         }       
//       })();
//     }, [videoTrack]);

//     return (
//       <div style={{display: 'flex', flexDirection: 'column', width: "122px", marginRight: '12px'}}>
//         {videoTrack?.enabled ? (
//           <video style={{position: 'relative', display: 'flex', flexDirection: 'column', width: '100%', aspectRatio: '4/3', background: 'black', borderRadius: '6px'}} className={styles.minVidArea} ref={videoRef} autoPlay playsInline muted={isLocal} ></video>
//         ) : <div className={styles.zaglushkahahaMini}></div>}
//         <div style={{transform: 'translate(0px, -30px)', bottom: '6px'}}>
//           {peer.roleName == 'teacher'?
//             (<div className={styles.clientName}>
//               <div className={styles.hatIco}>
//                 <span
//                   style={{
//                     background: "url(https://realibi.kz/file/7922.png) no-repeat",
//                     backgroundPosition: "center",
//                     width: "13px",
//                     height: "11.78px",
//                     paddingRight: "30px",
//                   }}
//                 >
//                 </span>
//               </div>
//               <div className={styles.teacherLitera}>
//                 {peer.name}
//               </div>
//             </div>):
//             (<div className={styles.clientName}>
//               <div className={styles.studentMiniRow}>
//               {audioTrack?.enabled? null : (
//                   <div className={styles.micIco}>
//                     <span
//                       style={{
//                         background: "url(https://realibi.kz/file/384854.png) no-repeat",
//                         backgroundPosition: "center",
//                         width: "8.89px",
//                         height: "8.89px",
//                         paddingRight: "30px",
//                       }}
//                     >
//                     </span>
//                   </div>)} 
//                   {peer.isLocal?'Вы':`${peer.roleName}` + ` ${peer.id.slice(0, 5)}`}
//                 </div>
//             </div>)
//           }
//         </div>
//       </div>
//     );
//   };

//   console.log(teacher);
//   console.log(student);

//   //if (typeof localStorage !== "undefined") {


//   ///////////////////////////////////////////////////////////////////////


//   const [check, setCheck] = useState('empty')
// 	const [needRoom, setNeedRoom] = useState(true)
// 	const [goMeet, setGoMeet] = useState(false)
// 	const [actualRoom, setActualRoom] = useState('')

//   // useEffect(() => {
// 	// 	// console.log('localStorage', localStorage)
// 	// 	console.log('actualRoom', actualRoom)
// 	//    	setRoom(router.query.room)
// 	//    	setRole(router.query.role)
// 	//    	// console.log('check', check)
// 	// }, [router.query, actualRoom]);

// 	// console.log('router', room) 
// 	// console.log('role', role)

// 	useEffect(() => {
//       (async () => {
//       	if (!teacher || !student) {
// 		    let data = room;
// 		    // console.log(room);
// 		    let getStudentByLessonKey = await axios.post(`${globals.productionServerDomain}/getStudentByLessonKey/` + data);
// 		    setStudent(getStudentByLessonKey['data'][0]);
// 		    setSelectedStudentId(student?.student_id);
// 		    let getTeacherByLessonKey = await axios.post(`${globals.productionServerDomain}/getTeacherByLessonKey/` + data);
// 		    setTeacher(getTeacherByLessonKey['data'][0]);
//         }
//       })();
//     }, [teacher, student]);

// 	function LoginPage() {
// 	  const [username, setUsernameState] = useState('');
// 	  const dispatch = useDispatch();
// 	  const router = useRouter();
// 	  const handleSubmitButtonPressed = () => {
//       debugger
// 	  	// console.log('status', check)
// 	  	connectWithWebSocket()
// 	  	if (!room || !student || username || !role || !teacher){
// 	  		registerNewUser(username);
// 	    	dispatch(setUsername(username));
// 	  	} else {
// 	  		registerNewUser((role == 'teacher')?teacher?.url:student?.nickname);
// 	    	dispatch(setUsername((role == 'teacher')?teacher?.url:student?.nickname));
// 	  	}
// 	  };

// 	  return (
// 	    // <div className={styles['login-page_container']}>
// 	    //   <div className={styles['login-page_login_box']}>
	        
// 	    //     {(!room || !student || username || !role || !teacher)?
// 		  //       <>
// 		  //       	<div className={styles['login-page_title_container']}>
// 		  //       		<p>Добро пожаловать на тестовую страницу трансляции</p>
// 		  //       		<UsernameInput
// 			//           		username={username}
// 			//           		setUsername={setUsernameState}
// 			//         	/>
// 			//         </div>
// 			//         <button onClick={() => {
// 			//         	setCheck('test')
// 			//         	handleSubmitButtonPressed()}}
// 			//         >START</button>
// 			//     </>:
// 			//     <>
// 			// 		<div className={styles['login-page_title_container']}>
// 		  //         		<p>room: {room}</p>
// 		  //         		<p>role: {role}</p>
// 		  //         		<p>you: {(role == 'teacher')?teacher?.name + ' ' + teacher?.surname:student?.name + ' ' + student?.surname}</p>
// 		  //         		<p>your {(role == 'teacher')?'student: ' + student?.name + ' ' + student?.surname:'teacher: ' + teacher?.name + ' ' + teacher?.surname}</p>
// 		  //       	</div>
// 		  //       	<button onClick={() => {
// 			//         	setCheck('classroom')
// 			//         	handleSubmitButtonPressed()}}
// 			//         >START</button>
// 		  //       </>
// 	    //     }
	        
// 	    //   </div>
// 	    // </div>
//       <form
//       style={{textAlign: "end"}}
//       onSubmit={(e) => {


//         // e.preventDefault();
//         // getToken()


//         // // createRoom()
//         // // handleSubmit(userName);
//       }}
//     >
//       <button 
//         style={{
//           background: "#ffffff",
//           borderRadius: "5px",
//           border: "none",
//           marginBottom: "15%",
//           color: "black",
//           fontSize: "24px",
//           padding: "20px 40px"
//         }}
//         onClick={() => {
//                   	setCheck('classroom')
//                   	handleSubmitButtonPressed()}}
//         // className="px-4 py-2 bg-blue-700 rounded-lg text-white"
//       >
//         <span
//           style={{
//             // background: "url(https://realibi.kz/file/892662.png) no-repeat",
//             // backgroundPosition: "right",
//             // backgroundSize: "18px",
//             // paddingRight: "30px",
//           }}
//         >
//           Присоедениться к уроку
//         </span>
//       </button>
//     </form>
// 	  );
// 	}

// 	function Dashboard() {
// 		const username = useSelector(state => state.dashboard.username);
// 		const callState = useSelector(state => state.call.callState);
// 		const leaveClick = () => {
// 			window.location.reload()
// 			setCheck('empty')
// 		}
// 		useEffect(() => {
// 			webRTCHandler.getLocalStream();
// 			webRTCGroupHandler.connectWithMyPeer();
// 		}, []);
		
// 		return (
// 			<div className={styles['dashboard_container']}>
// 				<div className={styles['dashboard_left_section']}>
// 					<div className={styles['dashboard_content_container']}>
// 						<DirectCall />
// 						<GroupCall />
// 						{callState !== callStates.CALL_IN_PROGRESS && (
// 							<DashboardInformation username={username} />
// 						)}
// 					</div>
// 					<div className={styles['dashboard_rooms_container']}>
// 						<GroupCallRoomsList />
// 					</div>
// 				</div>
// 				<div className={styles['dashboard_right_section']}>
// 					<ActiveUsersList />
// 				</div>
// 				<button onClick={() => {leaveClick()}}>Leave</button>
// 			</div>
// 		);
// 	}

// 	const joinRoom = (groupCallRooms) => {
// 		groupCallRooms?.forEach(roomy => {
// 			// console.log('roomy', roomy)
// 			if (roomy.hostName == student?.nickname || roomy.hostName == teacher?.url){
// 				setNeedRoom(false)
// 				if (role == 'student'){
// 					const roomy = groupCallRooms.find(roomy => roomy.hostName === teacher?.url);
// 					webRTCGroupCallHandler.joinGroupCall(roomy.socketId, roomy.roomId, role === 'student' ? teacher?.url : student?.nickname);
// 					setActualRoom(roomy)
// 				}
// 				if (role == 'teacher'){
// 					const roomy = groupCallRooms.find(roomy => roomy.hostName === student?.nickname);
// 					webRTCGroupCallHandler.joinGroupCall(roomy.socketId, roomy.roomId, role === 'student' ? teacher?.url : student?.nickname);
// 					setActualRoom(roomy)
// 				}
// 			}
// 		})	
// 		setGoMeet(true)
// 	}

// 	const createRoom = (groupCallRooms) => {
// 		const roomExists = groupCallRooms.some(roomy => roomy.hostName === (role === 'student' ? teacher?.url : student?.nickname));
//   		if (roomExists) {
//   			console.log('roomExists', roomExists)
//     		setNeedRoom(false)
//   		} else {
//     		if (needRoom) {
//     			console.log('needRoom', needRoom)
//       			webRTCGroupCallHandler.createNewGroupCall();
//       			setNeedRoom(false);
//     		} 
//   		}
//   		setGoMeet(true)
// 	}
// 	function Dashboard2(props) {
// 		const username = useSelector(state => state.dashboard.username);
// 		const callState = useSelector(state => state.call.callState);
// 		const groupCallRooms = useSelector(state => state.dashboard.groupCallRooms);
// 		const activeUsers = useSelector(state => state.dashboard.activeUsers);
// 		let roomExists
// 		const leaveClick = () => {
// 			window.location.reload()
// 		} 
// 		useEffect(() => {
// 			webRTCHandler.getLocalStream();
// 			webRTCGroupHandler.connectWithMyPeer(username);
// 			roomExists = groupCallRooms.some(roomy => roomy.hostName === (role === 'student' ? teacher?.url : student?.nickname));
// 			console.log('groupCallRooms', groupCallRooms)
// 		}, [groupCallRooms, roomExists, webRTCHandler]);

// 		return (
// 			<>
// 				{goMeet?
// 					<>
// 						<div className={styles.dashboard_container}>
// 							<div className={styles.dashboard_left_section}>
// 								<div className={styles.dashboard_content_container}>
// 									{/*<DirectCall role={role}/>*/}
// 									<GroupCall role={role} teacher={teacher} student={student} groupCallRooms={groupCallRooms} activeUsers={activeUsers} username={username} check={check} setCheck={setCheck} goMeet={goMeet} setGoMeet={setGoMeet}/>
// 									{callState !== callStates.CALL_IN_PROGRESS && (
// 										//<DashboardInformation username={username} />
// 										<></>
// 									)}
// 								</div>
// 								{/*<div className={styles['dashboard_rooms_container']}>
// 									<GroupCallRoomsList />
// 								</div>*/}
// 							</div>
// 							{/*<div className={styles['dashboard_right_section']}>
// 								<ActiveUsersList />
// 							</div>
// 							<button onClick={() => {leaveClick()}}>Leave</button>*/}
// 						</div>
// 					</>:
// 					<>
// 						<img src="https://realibi.kz/file/756332.png" style={{width: "80%", marginLeft: '10%'}} />
// 						<div className={styles.joinButtonBlock}>
// 							<button 
// 								className={styles.joinButton}
// 								onClick={() => {
// 									if (!roomExists){
// 										createRoom(groupCallRooms)
// 									} 
// 									if (roomExists) {
// 										joinRoom(groupCallRooms)
// 										setGoMeet(true)
// 									}
// 							}}>
// 								Перейти к занятию
// 							</button>
// 						</div>
// 					</>
// 				}
// 			</>
					
// 		);
// 	}



//   ///////////////////////////////////////////////////////////////////////
//     return (
//     //localStorage && teacher.url == localStorage.login || student?.nickname == localStorage.login?
//     <div className={styles.all}>
//       <div style={{backgroundColor: "#white", width: "100%"}}>
//         {role === "student" 
//           ? 
//           <HeaderStudent name={student?.name} surname={student?.surname} nickname={student?.nickname} courseUrl={student?.url} />
//           : <HeaderTeacher white={true} teacher={teacher} />
//         }
//         <div className={styles.cantainer}>
//           {role == 'teacher' ? (
//           <div className="App">
//             { isConnected 
//               ? ( <> 
//                 <div className={styles.translationBlock}>
//                   {<>
//                     {localPeer && <TeacherVideoTile peer={localPeer} isLocal={true} />}
//                     <div className={styles.underTileRow}>
//                       <div className={styles.miniaturesLine}>
//                         {peers &&
//                           peers
//                             .filter((peer) => peer)
//                             .slice(0, 6)
//                             .map((peer) => {
//                               return <TeacherUnderline isLocal={false} peer={peer} />;
//                             })
//                         } 
//                       </div>
//                     </div>
//                   </>}
//                   <div className={styles.translationButtonsRow}>
//                     <div className={styles.leftButtons}>
//                       <div
//                         className={styles.peersCount}
//                       >
//                         <span
//                           style={{
//                             background: "url(https://realibi.kz/file/645686.png) no-repeat",
//                             backgroundPosition: "center",
//                             width: "25.6px",
//                             height: "21.33px",
//                             paddingRight: "30px",
//                             marginRight: "14px"
//                           }}
//                         >
//                         </span>
//                         {peers?.length}
//                       </div>
//                       <button
//                         className={styles.audioButton}
//                         onClick={toggleAudio}
//                         style={isLocalAudioEnabled?{backgroundColor: '#2D3440'}:{backgroundColor: '#CC525F'}}
//                       >
//                         <span
//                           style={{
//                             background: "url(https://realibi.kz/file/720488.png) no-repeat",
//                             backgroundPosition: "center",
//                             width: "26.6px",
//                             height: "26.6px",
//                             paddingRight: "30px",
//                           }}
//                         >
//                         </span>
//                       </button>
//                       <button
//                         className={styles.videoButton}
//                         onClick={toggleVideo}
//                         style={isLocalVideoEnabled?{backgroundColor: '#2672ED'}:{backgroundColor: '#2D3440'}}
//                       >
//                         <span
//                           style={{
//                             background: "url(https://realibi.kz/file/972024.png) no-repeat",
//                             backgroundPosition: "center",
//                             width: "25.33px",
//                             height: "16.89px",
//                             paddingRight: "30px",
//                           }}
//                         >
//                         </span>
//                       </button>
//                       <button
//                         className={styles.shareButton}
//                         onClick={toggleShared}
//                         style={isLocalScreenShared?{backgroundColor: '#2672ED'}:{backgroundColor: '#2D3440'}}
//                       >
//                         <span
//                           style={{
//                             background: "url(https://realibi.kz/file/690286.png) no-repeat",
//                             backgroundPosition: "center",
//                             width: "24.53px",
//                             height: "20.32px",
//                             paddingRight: "30px",
//                           }}
//                         >
//                         </span>
//                       </button>
//                     </div>
//                     <div className={styles.rightButton}>
//                     <div className={styles.LJ_button_wrapper}>
//                         {showMessageCantHearYou ?
//                           <p style={{position: showMessageCantHearYou ? "absolute" : "none"}} className={styles.cantHearYou}>Вас не слышно?</p> 
//                           : ''}
//                         {showMessageCantHearYou ?
//                           <img style={{position: showMessageCantHearYou ? "absolute" : "none"}} className={styles.cantHearYouArrow} src="https://realibi.kz/file/906453.png"></img> 
//                           : ''}
//                         <button 
//                           className={styles.LJ}
//                           onClick={() => {
//                               LJ()
//                               setShowMessageCantHearYou(false)
//                             }}
//                         >
//                           <img src="https://realibi.kz/file/193097.png"/>
//                         </button>
//                       </div>
//                       <button
//                         className={styles.leaveRoomButton}
//                         onClick={() => {
//                             setToken('')
//                             setIdOfNewRoom(undefined)
//                             leaveRoom()
//                           }}
//                       >
//                         <span
//                           style={{
//                             background: "url(https://realibi.kz/file/359001.png) no-repeat",
//                             backgroundPosition: "center",
//                             width: "22.67px",
//                             height: "22.67px",
//                             paddingRight: "30px",
//                             marginRight: "12px"
//                           }}
//                         >
//                         </span>
//                         {/* {window.innerWidth < 480 ? "" : "Покинуть"} */}
//                         {/* Покинуть */}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </>) 
//               : <>
//                 {/* <img src="https://realibi.kz/file/756332.png" style={{width: "100%"}} /> */}
//                 {/* <div className={styles.allReady}>
//                           <p>Всё готово и настроено</p>
//                           <button>Присоедениться к уроку</button>
//                 </div> */}
//                 <JoinRoom handleSubmit={handleSubmit}
//                   idOfNewRoom={idOfNewRoom}
//                   setIdOfNewRoom={setIdOfNewRoom}
//                   token={token} 
//                   setToken={setToken}
//                   userName={(role == "teacher")
//                     ? teacher?.name
//                     : student?.name 
//                   } 
//                   roomName={room}

//                   LoginPage={LoginPage}
//                 />
//               </>
//             }
//           </div>
//           ) : (
//           <div className="App">
//             { isConnected 
//               ? ( <> 
//                 <div className={styles.translationBlock}>
//                   {<>
//                     {peers &&
//                           peers
//                             .filter((peer) => peer.roleName === 'teacher')
//                             .slice(0, 6)
//                             .map((peer) => {
//                               return <StudentVideoTile isLocal={false} peer={peer} />;
//                             })
//                         } 
                    
//                     <div className={styles.underTileRow}>
//                       {/*<div className={styles.studentsCountRow}>Участники {peers?.length}</div>*/}
//                       <div className={styles.miniaturesLine}>
//                         {peers &&
//                           peers
//                             .filter((peer) => peer)
//                             .slice(0, 6)
//                             .map((peer) => {
//                               return <StudentUnderline isLocal={false} peer={peer} />;
//                             })
//                         } 
//                       </div>
//                     </div>
//                   </>}
//                   <div className={styles.translationButtonsRow}>
//                     <div className={styles.leftButtons}>
//                       <div
//                         className={styles.peersCount}
//                       >
//                         <span
//                           style={{
//                             background: "url(https://realibi.kz/file/645686.png) no-repeat",
//                             backgroundPosition: "center",
//                             width: "25.6px",
//                             height: "21.33px",
//                             paddingRight: "30px",
//                             marginRight: "14px"
//                           }}
//                         >
//                         </span>
//                         {peers?.length}
//                       </div>
//                       <button
//                         className={styles.audioButton}
//                         onClick={toggleAudio}
//                         style={isLocalAudioEnabled?{backgroundColor: '#2D3440'}:{backgroundColor: '#CC525F'}}
//                       >
//                         <span
//                           style={{
//                             background: "url(https://realibi.kz/file/720488.png) no-repeat",
//                             backgroundPosition: "center",
//                             width: "26.6px",
//                             height: "26.6px",
//                             paddingRight: "30px",
//                           }}
//                         >
//                         </span>
//                       </button>
//                       <button
//                         className={styles.videoButton}
//                         onClick={toggleVideo}
//                         style={isLocalVideoEnabled?{backgroundColor: '#2672ED'}:{backgroundColor: '#2D3440'}}
//                       >
//                         <span
//                           style={{
//                             background: "url(https://realibi.kz/file/972024.png) no-repeat",
//                             backgroundPosition: "center",
//                             width: "25.33px",
//                             height: "16.89px",
//                             paddingRight: "30px",
//                           }}
//                         >
//                         </span>
//                       </button>
//                     </div>
//                     <div className={styles.rightButton}>
//                       <div className={styles.LJ_button_wrapper}>
//                       {showMessageCantHearYou ?
//                           <p style={{position: showMessageCantHearYou ? "absolute" : "none"}} className={styles.cantHearYou}>Вас не слышно?</p> 
//                           : ''}
//                         {showMessageCantHearYou ?
//                           <img style={{position: showMessageCantHearYou ? "absolute" : "none"}} className={styles.cantHearYouArrow} src="https://realibi.kz/file/906453.png"></img> 
//                           : ''}
//                         <button 
//                           className={styles.LJ}
//                           onClick={() => {
//                               LJ()
//                               setShowMessageCantHearYou(false)
//                             }}
//                         >
//                           <img src="https://realibi.kz/file/193097.png"/>
//                         </button>
//                       </div>

//                       <button
//                         className={styles.leaveRoomButton}
//                         onClick={() => {
//                             setIdOfNewRoom(undefined)
//                             setToken('')
//                             leaveRoom()
//                           }}
//                       >
//                         <span
//                           style={{
//                             background: "url(https://realibi.kz/file/359001.png) no-repeat",
//                             backgroundPosition: "center",
//                             width: "22.67px",
//                             height: "22.67px",
//                             paddingRight: "30px",
//                             marginRight: "12px"
//                           }}
//                         >
//                         </span>
//                         {/* Покинуть */}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </>) 
//               : <>
//                 {/* <img src="https://realibi.kz/file/756332.png" style={{width: "100%"}} /> */}
//                 <JoinRoom handleSubmit={handleSubmit} 
//                   idOfNewRoom={idOfNewRoom}
//                   setIdOfNewRoom={setIdOfNewRoom}
//                   token={token} 
//                   setToken={setToken}
//                   userName={(role == "teacher")
//                     ? teacher?.name
//                     : student?.name
//                   } 
//                   roomName={room}

//                   LoginPage={LoginPage}

//                 />
//               </>
//             }
//           </div>
//           )}
//           <LessonContain
//             role={role}
//             user={role === "student" ? teacher : student}
//             lesson={lesson}
//             peers={peers}
//           />
//           {/* {(role == "teacher")
//             ? peers.lenght > 0 
//             ? <TeacherHomeworksLesson 
//               lesson={lesson}
//               getAnswer={getAnswer}
//               updateAnswerStatus={updateAnswerStatus} 
//               updateAnswerComment={updateAnswerComment}
//             /> 
//             : ""
//             : <LessonExercisesForStudent exercises={exercises} student={student?.id} padding={"40px 0"} brickBorder={"3px solid #f1faff"}/>
//           } */}
//         </div>            
//         <Footer />
//       </div>
//     </div>)
//     //:<></>
//     //)} else {return <></>}
// };

// Lesson.getInitialProps = async (ctx) => {
//   console.log('lol',ctx)
//   if (ctx.query.url !== undefined) {
//     return {
//       url: ctx.query.url,
//     }
//   } else {
//     return {};
//   };
// };

// export default Lesson;
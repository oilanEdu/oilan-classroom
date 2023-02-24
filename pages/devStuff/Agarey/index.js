import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { registerNewUser, connectWithWebSocket } from '../../../src/utils/wssConnection/wssConnection';
import { setUsername } from '../../../src/store/actions/dashboardActions';
import styles from './agarey.module.css';
import logo from '../../../src/resources/logo.png';
import UsernameInput from '../../../src/components/UsernameInput/UsernameInput';
import SubmitButton from '../../../src/components/SubmitButton/SubmitButton';
import store from '../../../src/store/store.js';
import { callStates } from '../../../src/store/actions/callActions';
import * as webRTCHandler from '../../../src/utils/webRTC/webRTCHandler';
import * as webRTCGroupHandler from '../../../src/utils/webRTC/webRTCGroupCallHandler';
import * as webRTCGroupCallHandler from '../../../src/utils/webRTC/webRTCGroupCallHandler';
import DashboardInformation from '../../../src/components/Dashboardinformation/Dashboardinformation';
import DirectCall from '../../../src/components/DirectCall/DirectCall';
import GroupCallRoomsList from '../../../src/components/GroupCallRoomsList/GroupCallRoomsList';
import ActiveUsersList from '../../../src/components/ActiveUsersList/ActiveUsersList';
import GroupCall from '../../../src/components/GroupCall/GroupCall';
import globals from "../../../src/globals";
import axios from "axios";

const Index = () => {
	const [check, setCheck] = useState('empty')
	const router = useRouter()
	const [student, setStudent] = useState('')
	const [teacher, setTeacher] = useState('')
	const [selectedStudentId, setSelectedStudentId] = useState(0);
	const [room, setRoom] = useState(null)
	const [role, setRole] = useState(null)
	const [needRoom, setNeedRoom] = useState(true)
	const [goMeet, setGoMeet] = useState(false)

	useEffect(() => {
		console.log('localStorage', localStorage)
	   	setRoom(router.query.room)
	   	setRole(router.query.role)
	   	console.log('check', check)
	}, [router.query]);

	console.log('router', room) 
	console.log('role', role)

	useEffect(() => {
      (async () => {
      	if (!teacher || !student) {
		    let data = room;
		    console.log(room);
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
	  	console.log('status', check)
	  	connectWithWebSocket()
	  	if (!room || !student || username || !role || !teacher){
	  		registerNewUser(username);
	    	dispatch(setUsername(username));
	  	} else {
	  		registerNewUser((role == 'teacher')?teacher?.name:student?.name);
	  		(role == 'teacher')?registerNewUser('2'):null
	    	dispatch(setUsername((role == 'teacher')?teacher?.name:student?.name));
	  	}
	  };

	  return (
	    <div className={styles['login-page_container']}>
	      <div className={styles['login-page_login_box']}>
	        
	        {(!room || !student || username || !role || !teacher)?
		        <>
		        	<div className={styles['login-page_title_container']}>
		        		<p>Добро пожаловать на тестовую страницу трансляции</p>
		        		<UsernameInput
			          		username={username}
			          		setUsername={setUsernameState}
			        	/>
			        </div>
			        <button onClick={() => {
			        	setCheck('test')
			        	handleSubmitButtonPressed()}}
			        >START</button>
			    </>:
			    <>
					<div className={styles['login-page_title_container']}>
		          		<p>room: {room}</p>
		          		<p>role: {role}</p>
		          		<p>you: {(role == 'teacher')?teacher?.name + ' ' + teacher?.surname:student?.name + ' ' + student?.surname}</p>
		          		<p>your {(role == 'teacher')?'student: ' + student?.name + ' ' + student?.surname:'teacher: ' + teacher?.name + ' ' + teacher?.surname}</p>
		        	</div>
		        	<button onClick={() => {
			        	setCheck('classroom')
			        	handleSubmitButtonPressed()}}
			        >START</button>
		        </>
	        }
	        
	      </div>
	    </div>
	  );
	}

	function Dashboard() {
		const username = useSelector(state => state.dashboard.username);
		const callState = useSelector(state => state.call.callState);
		const leaveClick = () => {
			window.location.reload()
			setCheck('empty')
		}
		useEffect(() => {
			webRTCHandler.getLocalStream();
			webRTCGroupHandler.connectWithMyPeer();
		}, []);
		
		return (
			<div className={styles['dashboard_container']}>
				<div className={styles['dashboard_left_section']}>
					<div className={styles['dashboard_content_container']}>
						<DirectCall />
						<GroupCall />
						{callState !== callStates.CALL_IN_PROGRESS && (
							<DashboardInformation username={username} />
						)}
					</div>
					<div className={styles['dashboard_rooms_container']}>
						<GroupCallRoomsList />
					</div>
				</div>
				<div className={styles['dashboard_right_section']}>
					<ActiveUsersList />
				</div>
				<button onClick={() => {leaveClick()}}>Leave</button>
			</div>
		);
	}

	const joinRoom = (groupCallRooms) => {
		groupCallRooms?.forEach(roomy => {
			if (roomy.hostName == student?.name || roomy.hostName == teacher?.name){
				setNeedRoom(false)
				if (role == 'student'){
					const roomy = groupCallRooms.find(roomy => roomy.hostName === teacher?.name);
					webRTCGroupCallHandler.joinGroupCall(roomy.socketId, roomy.roomId);
				}
				if (role == 'teacher'){
					const roomy = groupCallRooms.find(roomy => roomy.hostName === student?.name);
					webRTCGroupCallHandler.joinGroupCall(roomy.socketId, roomy.roomId);
				}
			}
		})	
		setGoMeet(true)
	}

	const createRoom = (groupCallRooms) => {
		const roomExists = groupCallRooms.some(roomy => roomy.hostName === (role === 'student' ? teacher?.name : student?.name));
  		if (roomExists) {
    		setNeedRoom(false)
  		} else {
    		if (needRoom) {
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
		let roomExists
		const leaveClick = () => {
			window.location.reload() 
		} 
		useEffect(() => {
			console.log('PROPSMAION', props)
			webRTCHandler.getLocalStream();
			webRTCGroupHandler.connectWithMyPeer();
			roomExists = groupCallRooms.some(roomy => roomy.hostName === (role === 'student' ? teacher?.name : student?.name));
			console.log('groupCallRooms', groupCallRooms)
		}, [groupCallRooms, roomExists]); 

		return (
			<>
				{goMeet?
					<>
						<div className={styles.dashboard_container}>
							<div className={styles.dashboard_left_section}>
								<div className={styles.dashboard_content_container}>
									<DirectCall role={role} />
									<GroupCall role={role} username={username} check={check} setCheck={setCheck} goMeet={goMeet} setGoMeet={setGoMeet}/>
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
					</>:
					<>
						<img src="https://realibi.kz/file/756332.png" style={{width: "80%", marginLeft: '10%'}} />
						<div className={styles.joinButtonBlock}>
							<button 
								className={styles.joinButton}
								onClick={() => {
									if (!roomExists){
										createRoom(groupCallRooms)
									} 
									if (roomExists) {
										joinRoom(groupCallRooms)
										setGoMeet(true)
									}
							}}>
								Перейти к занятию
							</button>
						</div>
					</>
				}
			</>
					
		);
	}

return (
    <Provider store={store}>
      {check==='test'?<Dashboard />:<></>}
      {check==='empty'?<LoginPage />:<></>}
      {check==='classroom'?<Dashboard2 />:<></>}
    </Provider>
  );
}


export default Index
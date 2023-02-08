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
import DashboardInformation from '../../../src/components/Dashboardinformation/Dashboardinformation';
import DirectCall from '../../../src/components/DirectCall/DirectCall';
import GroupCallRoomsList from '../../../src/components/GroupCallRoomsList/GroupCallRoomsList';
import ActiveUsersList from '../../../src/components/ActiveUsersList/ActiveUsersList';
import GroupCall from '../../../src/components/GroupCall/GroupCall';


const Index = () => {
	const [check, setCheck] = useState(false)
	function LoginPage() {
	  const [username, setUsernameState] = useState('');
	  const dispatch = useDispatch();
	  const router = useRouter();
	  const handleSubmitButtonPressed = () => {
	  	connectWithWebSocket()
	    registerNewUser(username);
	    dispatch(setUsername(username));
	    setCheck(true)
	    // router.push('/devStuff/Agarey/Dashboard');
	  };

	  return (
	    <div className={styles['login-page_container']}>
	      <div className={styles['login-page_login_box']}>
	        <div className={styles['login-page_logo_container']}>
	          <img
	            className={styles['login-page_logo_image']}
	            src={logo}
	            alt='VideoTalker'
	          />
	        </div>
	        <div className={styles['login-page_title_container']}>
	          <h2>VIDEO CHAT</h2>
	        </div>
	        <UsernameInput
	          username={username}
	          setUsername={setUsernameState}
	        />
	        <SubmitButton handleSubmitButtonPressed={handleSubmitButtonPressed} />
	      </div>
	    </div>
	  );
	}

	function Dashboard() {
		const username = useSelector(state => state.dashboard.username);
		const callState = useSelector(state => state.call.callState);

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
			</div>
		);
	}

return (
    <Provider store={store}>
      {check?<Dashboard />:<LoginPage />}
    </Provider>
  );
}


export default Index
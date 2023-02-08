import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { registerNewUser, connectWithWebSocket } from '../../../src/utils/wssConnection/wssConnection';
import { setUsername } from '../../../src/store/actions/dashboardActions';
import styles from './agarey.module.css';
import logo from '../../../src/resources/logo.png';
import UsernameInput from '../../../src/components/UsernameInput/UsernameInput';
import SubmitButton from '../../../src/components/SubmitButton/SubmitButton';
import store from '../../../src/store/store.js';

function LoginPage() {
  const [username, setUsernameState] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  const handleSubmitButtonPressed = () => {
  	connectWithWebSocket()
    registerNewUser(username);
    dispatch(setUsername(username));
    router.push('/devStuff/Agarey/Dashboard');
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

export default function Index() {
  return (
    <Provider store={store}>
      <LoginPage />
    </Provider>
  );
}
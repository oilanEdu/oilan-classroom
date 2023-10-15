import React, { useState, useEffect } from 'react';
import SignupForm from '../../src/components/SignupForm/SignupForm';
import RegisterForm from '../../src/components/RegisterForm/RegisterForm';
import Header from '../../src/components/Header/Header';
import Footer from '../../src/components/Footer/Footer';
import styles from './styles.module.css'
import { useRouter } from 'next/router';

const LoginForm = () => {
  const [isSignup, setIsSignup] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const login = localStorage.getItem('login');
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    if (!login || !role || !token) {
      router.push('/auth');
    } else if (role === 'admin') {
      router.push('/cabinet/admin');
    } else {
      router.push(`/cabinet/${role}/${login}`);
    }
  }, []);

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.selectYourWay}>
          <div className={styles.buttons}>
            <button
              className={`${styles.button} ${!isSignup ? styles.active : ''} ${styles.leftButton}`}
              onClick={() => setIsSignup(false)}
            >
              Регистрация
            </button>
            <button
              className={`${styles.button} ${isSignup ? styles.active : ''} ${styles.rightButton}`}
              onClick={() => setIsSignup(true)}
            >
              Вход
            </button>
          </div>
          {isSignup ? <SignupForm /> : <RegisterForm />}
        </div>
      </div>
      {/* Footer /> */}
    </>
  );
};

export default LoginForm;
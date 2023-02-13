import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import globals from "../../globals";
import styles from './SignupForm.module.css'

const SignupForm = () => {
  const [role, setRole] = useState('teacher');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios({
      method: 'post',
      url: `${globals.productionServerDomain}/auth`,
      data: { role, login, password },
      headers: {
        'Authorization': `Bearer ${globals.localStorageKeys.authToken}`
      }
    })
      .then((res) => {
        console.log(res);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('login', res.data.login);
        localStorage.setItem('role', res.data.role);
        console.log(localStorage)
        if (role == 'admin'){
          router.push(`/cabinet/admin`);
        } else {
          router.push(`/cabinet/${res.data.role}/${res.data.login}`);
        }
        
      })
      .catch((err) => {
        if (err.response.status === 401) {
          setErrorMessage("Неверный логин или пароль");
        }
        console.error(err);
      });
  };

  return (
    <div className={styles.welcome_section}>
      <h2 className={styles.welcome_header}>Рады, что вы вернулись</h2>
      <h3 className={styles.enter_data_header}>Введите данные для входа</h3>
      <div className={styles.role_radio_section}>
        <div className={styles.role_radio}>
          <input
            type="radio"
            id="student_radio"
            checked={role === "student"}
            onChange={() => setRole("student")}
            style={{marginRight: '5px'}}
            disabled
          />
          <label htmlFor="student_radio" style={{color: 'gray'}}>Я студент</label>
        </div>
        <div className={styles.role_radio}>
          <input
            type="radio"
            id="teacher_radio"
            checked={role === "teacher"}
            onChange={() => setRole("teacher")}
            style={{marginRight: '5px'}}
          />
          <label htmlFor="teacher_radio">Я учитель</label>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.form_input}>
          <input
            type="text"
            placeholder="Логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
        </div>
        <div className={styles.form_input}>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <p className={styles.error_message}>{errorMessage}</p>
        <div className={styles.form_submit_button}>
          <button className={styles.submit_button} type="submit">Войти в личный кабинет</button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
import React, { useState } from 'react';
import axios from 'axios';
import globals from "../../globals";
import { useRouter } from 'next/router';
import styles from './RegisterForm.module.css'

const RegisterForm = () => {
  const router = useRouter();
  const [role, setRole] = useState('teacher');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (role && name && surname && phone && email && login && password){
      try {
        const data = { role, name, surname, phone, email, login, password };

        const response = await axios.post(`${globals.productionServerDomain}/register`, data);
        console.log('proshlo', response)
        alert('Вы успешно зарегистрированы на платформе Oilan-classroom! Сообщение с регистрационными данными отправлено Вам на электронную почту. Переходите на форму регистрации и начинайте пользоваться нашими услугами!')
        router.push(`/cabinet/${res.data.role}/${res.data.login}`);
        // Обработайте ответ и перенаправьте пользователя на нужную страницу.
      } catch (error) {
        if (error.response.status === 400) {
            setErrorMessage(error.response.data.message);
          }
        console.log('ne proshlo', error)
      }
    } else {
      setErrorMessage("Введены не все данные");
    }
  };

  return (
    <div className={styles.welcome_section}>
      <h2 className={styles.welcome_header}>Рады начать сотрудничать с Вами!</h2>
      <h3 className={styles.enter_data_header}>Введите данные для регистрации</h3>
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
            placeholder="Имя"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className={styles.form_input}>
          <input
            type="text"
            placeholder="Фамилия"
            value={surname}
            onChange={(event) => setSurname(event.target.value)}
          />
        </div>
        <div className={styles.form_input}>
          <input
            type="text"
            placeholder="Телефон"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </div>
        <div className={styles.form_input}>
          <input
            type="email"
            placeholder="Почта"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className={styles.form_input}>
          <input
            type="login"
            placeholder="Логин"
            value={login}
            onChange={(event) => setLogin(event.target.value)}
          />
        </div>
        <div className={styles.form_input}>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <p className={styles.error_message}>{errorMessage}</p>
        <div className={styles.form_submit_button}>
          <button className={styles.submit_button} type="submit">Зарегистрироваться как {role == 'student'?'студент':role == 'teacher'?'преподаватель':'...'}</button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
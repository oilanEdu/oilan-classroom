import React, { useState, useEffect } from 'react';
import axios from 'axios';
import globals from "../../globals";
import { useRouter } from 'next/router';
import styles from './RegisterForm.module.css';
import CaptchaComponent from "../Captcha/Captcha";

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
  const [successMessage, setSuccessMessage] = useState('');

  const [captchaText, setCaptchaText] = useState("");
  const [captchaCheck, setCaptchaCheck] = useState(false);
  const [insertCaptchaText, setInsertCaptchaText] = useState('Введите текст с картинки')
  const [showCaptcha, setShowCaptcha] = useState(false)

  const [randomizedCaptchaId, setRandomizedCaptchaId] = useState()
  const [randomizedCaptchaData, setRandomizedCaptchaData] = useState()

  const [proccessOfCaptcha, setProccessOfCaptcha] = useState(0)
  const [proccessOfCaptchaUrl, setProccessOfCaptchaUrl] = useState('https://realibi.kz/file/633881.png')
  const handlerOfProccessOfCaptcha = (value) => {
    if (value === 0) {
      setProccessOfCaptchaUrl('https://realibi.kz/file/633881.png');
    } else
    if (value === 1) {
      setProccessOfCaptchaUrl('https://realibi.kz/file/499291.png');
    } else{
    setProccessOfCaptchaUrl('https://realibi.kz/file/98680.png');}
  }
  useEffect(()=> {
    loadCaptcha()
    
    console.log("proccessOfCaptchaUrl", proccessOfCaptchaUrl)
  }, [])
  useEffect(() => {
    loadCaptchaWithId()
  }, [randomizedCaptchaId])
  
  const loadCaptchaWithId = async () => {
    let data = randomizedCaptchaId
    let captcha2 = await axios.post(`${globals.productionServerDomain}/getCaptchaWithId/` + data)
    console.log("captcha2", captcha2['data'])
    setRandomizedCaptchaData(captcha2['data'])
  }
const loadCaptcha = async () => {
    let captcha = await axios.get(`${globals.productionServerDomain}/getCaptcha/`);
    let getAllCaptchaId = await axios.get(`${globals.productionServerDomain}/getAllCaptchaId`)
    console.log("getAllCaptchaId", getAllCaptchaId['data'])
    let getAllCaptchaIdRandom = Math.floor(Math.random() * getAllCaptchaId['data'].length)
    console.log("getAllCaptchaIdRandom", getAllCaptchaIdRandom)
    
    setRandomizedCaptchaId(getAllCaptchaIdRandom)
    // console.log('CAPTCHA', captcha)
    const captchaFin = captcha['data'][0]
    // console.log('CAPTCHA2', captchaFin)
  }

  const anotherImage = async () => {
    let getAllCaptchaId = await axios.get(`${globals.productionServerDomain}/getAllCaptchaId`)
    console.log("getAllCaptchaId", getAllCaptchaId['data'])
    let getAllCaptchaIdRandom = Math.floor(Math.random() * getAllCaptchaId['data'].length)
    setRandomizedCaptchaId(getAllCaptchaIdRandom)
  }

  const handleSubmit = async (event) => {
    // event.preventDefault();
    let captcha = await axios.get(`${globals.productionServerDomain}/getCaptcha/`);
    const captchaFin = captcha['data'][0]
    loadCaptcha()
    console.log('CAPTCHI',captchaFin.text,captchaText)
    if (randomizedCaptchaData[0]?.text == captchaText) {
      handlerOfProccessOfCaptcha(3)
      setProccessOfCaptcha(3)
      
      setShowCaptcha(false);
      setCaptchaText("");
      // setCheck(false);
      loadCaptcha();
      setCaptchaCheck(false);
      setProccessOfCaptcha(0);
      setProccessOfCaptchaUrl("https://realibi.kz/file/633881.png");

      if (role && name && surname && phone && email && login && password){
        // try {
          const data = { role, name, surname, phone, email, login, password };

          await axios.post(`${globals.productionServerDomain}/register`, data).then((res) => {
            console.log('proshlo', res);
            // setErrorMessage('Вы успешно зарегистрированы на платформе Oilan-classroom! Сообщение с регистрационными данными отправлено Вам на электронную почту. Переходите на форму регистрации и начинайте пользоваться нашими услугами!');
            alert('Вы успешно зарегистрированы на платформе Oilan-classroom! Сообщение с регистрационными данными отправлено Вам на электронную почту. Переходите на форму регистрации и начинайте пользоваться нашими услугами!')
            router.push(`/cabinet/${res.data.role}/${res.data.login}`);
          }).catch((error) => {
            if (error.response.status === 400) {
              setErrorMessage(error.response.data.message);
            }
            console.log('ne proshlo', error)
          });
          
          setErrorMessage('Вы успешно зарегистрированы на платформе Oilan-classroom! Сообщение с регистрационными данными отправлено Вам на электронную почту. Переходите на форму регистрации и начинайте пользоваться нашими услугами!');
            alert('Вы успешно зарегистрированы на платформе Oilan-classroom! Сообщение с регистрационными данными отправлено Вам на электронную почту. Переходите на форму регистрации и начинайте пользоваться нашими услугами!')
            router.push(`/cabinet/${role}/${login}`);
          // Обработайте ответ и перенаправьте пользователя на нужную страницу.
        // } catch (error) {
          
        // }
      } else {
        setErrorMessage("Введены не все данные");
      }
    } else {
      setInsertCaptchaText('Неверный ввод текста с картинки!')
      setProccessOfCaptcha(1)
      handlerOfProccessOfCaptcha(1)
      console.log("proccessOfCaptchaUrl", proccessOfCaptchaUrl);
    }
  };

  const buttonActivateCapt = () => {
    if (role && name && surname && phone && email && login && password) {
      setShowCaptcha(true)
      setErrorMessage("");
    } else {
      setErrorMessage("Введены не все данные");
    }
  }

  console.log(errorMessage);
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
        <CaptchaComponent
          insertCaptchaText={insertCaptchaText}
          setCaptchaText={setCaptchaText}
          sendApplication={handleSubmit}
          setRole={setRole}
          setName={setName}
          setSurname={setSurname}
          setPhone={setPhone}
          setEmail={setEmail}
          setLogin={setLogin}
          setPassword={setPassword}
          setErrorMessage={setErrorMessage}
          showCaptcha={showCaptcha}
          captchaImage={randomizedCaptchaData?.[0]?.link}
          anotherImage={anotherImage}
          proccessOfCaptchaUrl={proccessOfCaptchaUrl}
          proccessOfCaptcha={proccessOfCaptcha}
        />
        <p className={styles.error_message}>{errorMessage}</p>
        
      </form><div className={styles.form_submit_button}>
          <button className={styles.submit_button} onClick={() => {buttonActivateCapt()}}>Зарегистрироваться как {role == 'student'?'студент':role == 'teacher'?'преподаватель':'...'}</button>
        </div>
    </div>
  );
};

export default RegisterForm;
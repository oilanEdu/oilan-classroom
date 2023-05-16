import React, { useState, useEffect } from 'react';
import axios from 'axios';
import globals from "../../globals";
import { useRouter } from 'next/router';
import styles from './RegisterForm.module.css';
import CaptchaComponent from "../Captcha/Captcha";
import { Link } from 'react-router-dom';
import { useClipboard } from 'use-clipboard-copy';
const generator = require('generate-password');

const RegisterForm = () => {
  const router = useRouter();
  const clipboard = useClipboard();
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

  const [showPassData, setShowPassData] = useState(false);
  const [generatePass, setGeneratePass] = useState("");
  const [showGenetarePass, setShowGeneratePass] = useState(false);

  const generatePassHandler = (e) => {
    e.preventDefault()
    setShowGeneratePass(true);
    setGeneratePass(generator.generate({
      length: 12,
	    numbers: true,
      symbols: true,
    }))
  }
 
  const checkPassword = (password) => {
    // const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/;
    // if(!regex.test(password)) {
    //   return false;
    // }

    if(password.length < 8) {
      return false;
    }

    return true;
  }

  const checkPhone = (phone) => {
    const regex = /^\+?([0-9]{1,3})\)?[- ]?([0-9]{3})[- ]?([0-9]{3})[- ]?([0-9]{2})[- ]?([0-9]{2})$/;
    if(!regex.test(phone)) {
      return false;
    } else {
      return true;
    }  
  }

  const checkEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!regex.test(email)) {
      return false;
    } else {
      return true;
    }  
  }
  
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

  const loginHandler = async (role, login, password) => {
    await axios({
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

    const isPhoneValid = checkPhone(phone);
    const isEmailValid = checkEmail(email);

    if (role && name && surname && phone && email && login && password){
      if (checkPassword(password)) {
        if (!isPhoneValid) {
          setErrorMessage("Некорректный номер телефона");
        } else if (!isEmailValid) {
          setErrorMessage("Некорректный адрес электронной почты");
        } else {
          const data = { 
            role, 
            name, 
            surname, 
            phone, 
            email, 
            login, 
            password 
          };
          await axios.post(`${globals.productionServerDomain}/register`, data).then((res) => {
            console.log('proshlo', res);
            alert('Вы успешно зарегистрированы на платформе Oilan-classroom! Сообщение с регистрационными данными отправлено Вам на электронную почту. Переходите на форму регистрации и начинайте пользоваться нашими услугами!')
            loginHandler(role, login, password)
          }).catch((error) => {
            if (error.response.status === 400) {
              setErrorMessage(error.response.data.message);
            }
            console.log('ne proshlo', error)
          });
        }
      } else {
        setErrorMessage("Ваш пароль небезопасен");
      }

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
      <h2 className={styles.welcome_header}>Рады сотрудничать с Вами!</h2>
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
      <form onSubmit={handleSubmit} className={styles.form_container}>
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
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className={styles.form_input}>
          <input
            type="login"
            placeholder="Логин на латинице"
            value={login}
            onChange={(event) => setLogin(event.target.value)}
          />
        </div>
        <div className={styles.form_input}>
          <div className={styles.pass_data} style={{display: showPassData ? "block" : "none"}}>
            <p className={styles.pass_data_head}>Для защиты ваших данных придумайте безопасный пароль. </p>
            <p className={styles.pass_data_head}>Он должен содержать:</p>
            <p className={styles.pass_data_text}>8 и более символов</p>
            <p className={styles.pass_data_text}>латинские буквы</p>
            <p className={styles.pass_data_text}>цифры</p>
            <p className={styles.pass_data_text}>знаки пунктуации (!”$%/:’@[]^_)</p>
            <button 
              onClick={(e) => generatePassHandler(e)}
              className={styles.generate_pass}
            >
              Сгенерировать пароль
            </button>
            <div className={styles.generate_pass_text} style={{display: showGenetarePass ? "block" : "none"}}>
            {generatePass}
              <input className={styles.url_input} ref={clipboard.target} value={generatePass} readOnly />
              <span 
                className={styles.generate_pass_copy} 
                onClick={clipboard.copy}
              ></span>
            </div>
            <div className={styles.pass_data_left}></div>
          </div>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <span onClick={() => setShowPassData(!showPassData)} className={styles.password_cr}></span>
        </div>
        <div className={styles.form_input}>
          <button 
            onClick={(e) => generatePassHandler(e)}
            className={styles.generate_pass}
          >
            Сгенерировать пароль
          </button>
          <div className={styles.generate_pass_text} style={{display: showGenetarePass ? "block" : "none"}}>
            {generatePass}
            <input className={styles.url_input} ref={clipboard.target} value={generatePass} readOnly />
            <span 
              className={styles.generate_pass_copy} 
              onClick={clipboard.copy}
            ></span>
          </div>
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
        <p 
          style={{display: errorMessage === "" ? "none" : "inline-block"}}  
          className={styles.error_message}
        >
          {errorMessage}
        </p>
        
      </form>
      <div className={styles.form_submit_button}>
        <button 
          className={styles.submit_button} 
          onClick={() => {buttonActivateCapt()}}
        >
          Зарегистрироваться как {role == 'student'?'студент':role == 'teacher'?'преподаватель':'...'}
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
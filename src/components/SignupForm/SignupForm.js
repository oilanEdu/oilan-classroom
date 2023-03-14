import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import globals from "../../globals";
import styles from './SignupForm.module.css'
import { useClipboard } from 'use-clipboard-copy';
const generator = require('generate-password');

const SignupForm = () => {
  const clipboard = useClipboard();
  const [role, setRole] = useState('teacher');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showRestore, setShowRestore] = useState(false);
  const [codeFormShow, setCodeFormShow] = useState(false);
  const [errorMessageRestore, setErrorMessageRestore] = useState('');
  const [errorMessageCode, setErrorMessageCode] = useState("");  
  const [errorMessageNewPass, setErrorMessageNewPass] = useState("");  
  const [newPassFormShow, setNewPassFormShow] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [generatePass, setGeneratePass] = useState("");
  const [showGenetarePass, setShowGeneratePass] = useState(false);
  const [showPassData, setShowPassData] = useState(false);
  const router = useRouter();

  const [relogin, setRelogin] = useState("");
  const [email, setEmail] = useState("");
  const [codeUser, setCodeUser] = useState("");
  const [code, setCode] = useState(generator.generate({
    length: 6,
    numbers: true,
  }));

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
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/;
    if(!regex.test(password)) {
      return false;
    }

    if(password.length < 8) {
      return false;
    }

    return true;
  }

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

  const showRestoreHandle = () => {
    setShowRestore(!showRestore);
  };

  const restoreHandler = (e) => {
    e.preventDefault();
    axios({
      method: 'post',
      url: `${globals.productionServerDomain}/restorePassword`,
      data: { role, relogin, email, code },
    })
      .then((res) => {
        showRestoreHandle();
        setCodeFormShow(!codeFormShow);
      })
      .catch((err) => {
        setErrorMessageRestore(err.response.data);
        console.error(err);
      });
  }

  const examCode = () => {
    if (code === codeUser) {
      setCodeFormShow(false);
      setNewPassFormShow(true)
    } else {
      setErrorMessageCode("Не правильный код, попробуйте заново")
    }
  }

  const updatePassword = async () => {
    if (checkPassword(newPass)) {
      const data = { 
        nick: relogin, 
        newPassword: newPass 
      };

      await axios.put(`${globals.productionServerDomain}/updatePassword`, data).then((res) => {
        console.log(res);
        alert('Пароль успешно изменен');
        window.location.reload()
      }).catch((error) => {
        console.log('ne proshlo', error)
      });
    } else {
      setErrorMessageNewPass("Ваш пароль небезопасен")
    }
  }

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
      <form>
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
        <div className={styles.form_input}>
          <div className={styles.forget_pass} onClick={showRestoreHandle}>Не помню пароль</div>
        </div>
        
        <p className={styles.error_message}>{errorMessage}</p>
        <div className={styles.form_submit_button}>
          <button onClick={handleSubmit} className={styles.submit_button} type="submit">Войти в личный кабинет</button>
        </div>
      </form>
      <div 
        className={styles.restore_container} 
        style={{display: showRestore ? "block" : "none"}}
      >
        <p className={styles.restore_header}>
          Для восстановления пароля введите данные, указанные при регистрации.
        </p>
        <div className={styles.restore_form}>
          <input 
            onChange={(e) => setRelogin(e.target.value)} 
            placeholder="Логин" 
            className={styles.restore_input}
          />
          <input
            onChange={(e) => setEmail(e.target.value)}  
            placeholder="Email" 
            className={styles.restore_input} 
          />
          <div className={styles.restore_button} onClick={restoreHandler}></div>
        </div>
        <span 
          style={{display: errorMessageRestore === "" ? "none" : "inline-block"}}  
          className={styles.error_message_restore}
        >
          {errorMessageRestore}
        </span>
      </div>
      <div 
        className={styles.restore_container} 
        style={{display: codeFormShow ? "block" : "none"}}
      >
        <p className={styles.restore_header}>
          На указанный email отправлен код, введите его в окно ниже
        </p>
        <div className={styles.restore_form}>
          <input
            onChange={(e) => setCodeUser(e.target.value)}  
            placeholder="Код из письма" 
            value={codeUser}
            className={styles.restore_input} 
          />
          <div className={styles.restore_button} onClick={examCode}></div>
        </div>
        <span 
          style={{display: errorMessageCode === "" ? "none" : "inline-block"}}  
          className={styles.error_message_restore}
        >
          {errorMessageCode}
        </span>
      </div>
      <div 
        className={styles.new_pass_container} 
        style={{display: newPassFormShow ? "block" : "none"}}
      >
        <p className={styles.restore_header}>Введите новый пароль</p>
        <div className={styles.new_pass_form}>
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
            onChange={(e) => setNewPass(e.target.value)}  
            placeholder="Новый пароль" 
            value={newPass}
            className={styles.new_pass_input} 
          />
          {/* <div className={styles.restore_button} onClick={examCode}></div> */}
          <span onClick={() => setShowPassData(!showPassData)} className={styles.password_cr}></span>
        </div>
        <div 
          onClick={(e) => generatePassHandler(e)}
          className={styles.generate_pass}
        >
          Сгенерировать пароль
        </div>
        <div 
          className={styles.generate_pass_text} 
          style={{display: showGenetarePass ? "block" : "none"}}
        >
          {generatePass}
          <input 
            className={styles.url_input} 
            ref={clipboard.target} 
            value={generatePass} 
            readOnly 
          />
          <span 
            className={styles.generate_pass_copy} 
            onClick={clipboard.copy}
          ></span>
        </div>
        <span 
          style={{display: errorMessageNewPass === "" ? "none" : "inline-block"}}  
          className={styles.error_message_restore}
        >
          {errorMessageNewPass}
        </span>
        <div onClick={updatePassword} className={styles.new_pass_btn} >Сохранить</div>
      </div>
    </div>
  );
};

export default SignupForm;
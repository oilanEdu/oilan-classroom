import { useState, useEffect } from "react";
import styles from "./ApplicationBlock.module.css";
import globals from "../../globals";
import axios from "axios";
import Backdrop from "../Backdrop/Backdrop";
import SuccessfullyModal from "../SuccessfullyModal/SuccessfullyModal";
import { Image } from "react-bootstrap";

const ApplicationBlock = () => {
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [insertCaptchaText, setInsertCaptchaText] = useState('Введите текст с картинки')
  const [captchaText, setCaptchaText] = useState("");

  const [check, setCheck] = useState(false);
 
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [showSend, setShowSend] = useState(false);

  const handleShowSend = () => setShowSend(true);

  const firstStepValidation = () =>  {
    if (fullname.length < 3) {
      alert("Заполните все поля!");
      return false;
    } else if (phone.length < 16) {
      alert("Заполните все поля!");
      return false;
    } else {
      // setShowSend(true);
      return true;
    }
  };

  // const sendApplication = () => {
  //   const ticketData = {
  //     fullname: fullname,
  //     email: email,
  //     phone: phone,
  //     course_id: 1
  //   };

  //   axios({
  //     method: "post",
  //     url: `${globals.productionServerDomain}/createTicket`,
  //     data: ticketData,
  //     headers: {
  //       Authorization: `Bearer ${globals.localStorageKeys.authToken}`,
  //     },
  //   }).then((res) => {
  //   })
  //   .catch(() => {
  //     alert("Что-то пошло не так!");
  //   }); 
  // };

  const loadCaptcha = async () => {
    let captcha = await axios.get(`${globals.productionServerDomain}/getCaptcha/`);
    // console.log('CAPTCHA', captcha)
    const captchaFin = captcha['data'][0]
    // console.log('CAPTCHA2', captchaFin)
  }
  const sendApplication = async() => {
    let captcha = await axios.get(`${globals.productionServerDomain}/getCaptcha/`);
    const captchaFin = captcha['data'][0]
    loadCaptcha()
    console.log('CAPTCHI',captchaFin.text,captchaText)
    if (captchaFin.text == captchaText) {
      console.log('CAPTCHI',captchaFin.text,captchaText)
      const ticketData = {
        fullname: fullname,
        phone: phone,
        course_id: 1,
        connection: "Звонок"
      }

      axios({
        method: "post",
        url: `${globals.productionServerDomain}/createTicket`,
        data: ticketData,
        headers: {
          Authorization: `Bearer ${globals.localStorageKeys.authToken}`,
        },
      }).then((res) => {
      })
      .catch(() => {
        alert("Что-то пошло не так!");
      }); 
      handleShowSend()
    } else {setInsertCaptchaText('Неверный ввод текста с картинки!')}
  };

  const onClickNext = () => {
    setShowSend(false);
    setFullname("");
    setEmail("");
    setPhone("");
    setCheck(false);
  };

  return <div className={styles.container}>
    <SuccessfullyModal show={showSend} onClickNext={onClickNext} handleShow={handleShowSend} />
    <Backdrop show={showSend} />
    <h1>Запишитесь на курс сейчас</h1>
    <span className={styles.subtitle}>
      И мы свяжемся с вами для записи на пробный урок
    </span>
    <form className={styles.form_container}>
      <label className={styles.input_container}>
        Ваше Имя
        <input 
          placeholder="Ваше Имя"
          name="fullname"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />
      </label>
      <label className={styles.input_container}>
        Ваш E-mail
        <input 
          placeholder="Ваш E-mail" 
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className={styles.input_container}>
        Ваш Телефон
        <input 
          placeholder="Ваш Телефон" 
          name="phone"
          value={phone}
          onKeyDown={(e) => {
            if (e.keyCode === 8) {
              setPhone(phone.slice(0, -1));
            }
          }}
          onChange={(e) => {
            globals.checkPhoneMask(e.target.value, setPhone)
          }}
        />
      </label>
      <div style={showCaptcha?{display:'block'}:{display:'none'}}>
          <div>{insertCaptchaText}</div>
          <Image 
            src={'https://realibi.kz/file/205955.png'}
            style={{width:'100%'}}
          />
          <input
            onChange={(e) => setCaptchaText(e.target.value)}
          />
          <button
            onClick={(e) => {
              e.preventDefault()
              sendApplication();
              e.preventDefault()
              setFullname("");
              // setConnection("");
              setPhone("");
              setCheck(false)
              e.preventDefault()
            }}
          >
            Отправить
          </button>
        </div>
      <button 
        className={styles.button_animate}
        onClick={(e) => {
          e.preventDefault();
          if (check === false) {
            alert(
              "Прочтите публичную оферту и дайте свое согласие!"
            );
          } else {
            if (firstStepValidation()) {
              // sendApplication();
              setShowCaptcha(true)
            } else {
              alert("Заполните пожалуйста все поля.")
            }
          }
        }}
      >
        Записаться на курс
      </button>
      <span 
        className={check ? styles.check_on : styles.check_off}
        onClick={() => setCheck(!check)}
      >
        Я принимаю условия публичной оферты
      </span>
    </form>
  </div>
};

export default ApplicationBlock; 
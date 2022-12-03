import { useState, useEffect } from "react";
import styles from "./ApplicationModal.module.css";
import globals from "../../globals";
import axios from "axios";
import Backdrop from "../Backdrop/Backdrop";
import { Image } from "react-bootstrap";
import CaptchaComponent from "../Captcha/Captcha";
import Link from "next/link";

const ApplicationModal = ({showSend, handleShowSend, onClose, course, teacherByCourse}) => {
  const [check, setCheck] = useState(false);
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [connection, setConnection] = useState("");
  const [captchaText, setCaptchaText] = useState("");
  const [captchaCheck, setCaptchaCheck] = useState(false);
  const [insertCaptchaText, setInsertCaptchaText] = useState('Введите текст с картинки')
  const [showCaptcha, setShowCaptcha] = useState(false)

  const [randomizedCaptchaId, setRandomizedCaptchaId] = useState()
  const [randomizedCaptchaData, setRandomizedCaptchaData] = useState()

  const [proccessOfCaptcha, setProccessOfCaptcha] = useState(0)
  const [proccessOfCaptchaUrl, setProccessOfCaptchaUrl] = useState('https://realibi.kz/file/633881.png')

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

  const firstStepValidation = () =>  {
    if (fullname.length < 3) {
      alert("Заполните все поля!");
      return false;
    } else if (phone.length < 16) {
      alert("Заполните все поля!");
      return false;
    } else {
      return true;
    }
  };

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

  const sendApplication = async() => {
    let captcha = await axios.get(`${globals.productionServerDomain}/getCaptcha/`);
    const captchaFin = captcha['data'][0]
    loadCaptcha()
    console.log('CAPTCHI',captchaFin.text,captchaText)
    if (randomizedCaptchaData[0]?.text == captchaText) {
      handlerOfProccessOfCaptcha(3)
      setProccessOfCaptcha(3)
      console.log("proccessOfCaptchaUrl", proccessOfCaptchaUrl)
      console.log('CAPTCHI',randomizedCaptchaData.text,captchaText)
      const ticketData = {
        fullname: fullname,
        phone: phone,
        course_id: course?.id,
        connection: connection === 0 ? "Звонок" : "Whatsapp",
        courseName: course?.title,
        teacherName: teacherByCourse?.name + ' ' + teacherByCourse?.surname
      }
      setFullname("");
      setConnection("");
      setPhone("");
      setCheck(false)

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
    } else {setInsertCaptchaText('Неверный ввод текста с картинки!')
      setProccessOfCaptcha(1)
      handlerOfProccessOfCaptcha(1)
      console.log("proccessOfCaptchaUrl", proccessOfCaptchaUrl);
    }
  };




  //желтый красный зеленый
  const handlerOfProccessOfCaptcha = (value) => {
    if (value === 0) {
      setProccessOfCaptchaUrl('https://realibi.kz/file/633881.png');
    } else
    if (value === 1) {
      setProccessOfCaptchaUrl('https://realibi.kz/file/499291.png');
    } else{
    setProccessOfCaptchaUrl('https://realibi.kz/file/98680.png');}
  }

  return <>
    <div style={{
      transform: `translate(${showSend ? "-50%, -50%" : "-50%, -100%"})`,
      top: showSend ? "50%" : "0%",
      opacity: showSend ? 1 : 0
    }}
      className={styles.modal}
    >
      <span className={styles.close_modal} onClick={onClose}></span>
      <div className={styles.modal_info}>
        <h3>Оставь заявку для записи на курс “Математика простыми словами” </h3>
        <h3>Оставь заявку для записи на курс “{course?.title}” </h3>
      </div>
      <form className={styles.form_container}>
        <input 
          className={styles.input}
          placeholder="Ваше Имя"
          name="fullname"
          value={fullname}
          onChange={(e) => {
            if (phone.length > 10 && fullname.length > 3 && connection !== "") {
              setShowCaptcha(true)
            }
            setFullname(e.target.value)
          }}
        />
        <input 
          className={styles.input}
          placeholder="Ваш Телефон" 
          name="phone"
          value={phone}
          onKeyDown={(e) => {
            if (e.keyCode === 8) {
              setPhone(phone.slice(0, -1));
            }
          }}
          onChange={(e) => {
            if (phone.length > 10 && fullname.length > 3 && connection !== "") {
              setShowCaptcha(true)
            }
            globals.checkPhoneMask(e.target.value, setPhone)
          }}
        />
        <select 
          className={styles.selectBlock} 
          value={connection} 
          onChange={e => {
            if (phone.length > 10 && fullname.length > 3) {
              setShowCaptcha(true)
            }
            setConnection(e.target.value)
          }}
        >
          <option value="3">Способ связи</option>
          <option value="0">Звонок</option>
          <option value="1">Whatsapp</option>
        </select>
        <CaptchaComponent
        insertCaptchaText={insertCaptchaText}
        setCaptchaText={setCaptchaText}
        sendApplication={sendApplication}
        setFullname={setFullname}
        setConnection={setConnection}
        setPhone={setPhone}
        setCheck={setCheck}
        showCaptcha={showCaptcha}
        captchaImage={randomizedCaptchaData?.[0]?.link}
        anotherImage={anotherImage}
        proccessOfCaptchaUrl={proccessOfCaptchaUrl}
        proccessOfCaptcha={proccessOfCaptcha}
        />
        <button 
          className={styles.button}
          onClick={(e) => {
            e.preventDefault();
            if (check === false) {
              alert(
                "Прочтите публичную оферту и дайте свое согласие!"
              );
            } else {
              if (firstStepValidation ()) {
                // setShowCaptcha(true)
              } else {
                alert("Заполните пожалуйста все поля.")
              }
            }
          }}
        >
          Оставить заявку
        </button>
        <span 
          // className={check ? styles.check_on : styles.check_off}
          // onClick={() => setCheck(!check)}
        >
          Нажимая на кнопку "Оставить заявку", Вы принимаете <Link href="/offer"><a>условия публичной оферты</a></Link>
        </span>
      </form>
    </div>
    <Backdrop show={showSend} />
  </>
};

export default ApplicationModal;
import { useState, useEffect, useRef } from "react";
import styles from "./ApplicationModal.module.css";
import globals from "../../globals";
import axios from "axios";
import Backdrop from "../Backdrop/Backdrop";
import { Image } from "react-bootstrap";
import CaptchaComponent from "../Captcha/Captcha";
import Link from "next/link";
import DateTimePicker from "../DateTimePicker/DateTimePicker";

const ApplicationModal = ({showSend, handleShowSend, onClose, course, teacherByCourse, teacherId}) => {
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

  const [outputDate, setOutputDate] = useState("")
  
  const date = new Date()
  const thisDay = date.getDate()
  const tomorrowDay = date.getDate() + 1
  const thisMonth = date.getMonth()
  const thisYear = date.getFullYear()
  
  const [dates, setDates] = useState('')
  const [datesLoaded, setDatesLoaded] = useState(false)
  const [timeIsSelected, setTimeIsSelected] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date(thisYear, thisMonth, tomorrowDay, 10, 10, 10))
  const [selectedTime, setSelectedTime] = useState(null)
  const [busyHours, setBusyHours] = useState(['08:00']);
  const [selectedBlock, setSelectedBlock] = useState('08:00')

  useEffect(()=> {
    loadCaptcha()
    loadDates() 
    if (!dates){ 
      loadDates()
    }
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
  const loadDates = async () => { 
    let id = teacherId
    let getCoursesId = await axios.post(`${globals.productionServerDomain}/getCoursesByTeacherId/` + id)
    let coursesId = []
    getCoursesId['data'].map(el => {
      coursesId.push(el.id)
    })
    // let id = props?.course?.id
    let dates = await axios.post(`${globals.productionServerDomain}/getDatesForApplication/` + coursesId)
    // console.log("DATES!", dates['data'])
    const data = {
      coursesId, 
      teacherId 
    };
    // let dates = await axios.post(`${globals.productionServerDomain}/getDatesForApplicationSecond/` + data)

    let array1 = axios({ 
      method: "post",
      url: `${globals.productionServerDomain}/getDatesForApplicationSecond`,
      data: data,
    })
    .then(function (res) {
      if (res.data[0]) {
        setDates(res['data'])
      } else {
        console.log("No dates");
      }
    })
    .catch((err) => {
      alert("Произошла ошибка");
    });
    setDates(dates['data'])  
    setDatesLoaded(true)
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
        teacherName: teacherByCourse?.name + ' ' + teacherByCourse?.surname,
        outputDate: outputDate
      }
      setFullname("");
      setConnection("");
      setPhone("");
      setShowCaptcha(false);
      setCaptchaText("");
      setCheck(false);
      loadCaptcha();
      setProccessOfCaptcha(0);
      setProccessOfCaptchaUrl("https://realibi.kz/file/633881.png");

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
    } else {
      setInsertCaptchaText('Неверный ввод текста с картинки!')
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

    //проверка все ли условия выполнены перед отправкой заявки
    useEffect(() => {
      if (phone.length > 10 && fullname.length > 3 && connection !== "" && timeIsSelected === true) {
        setShowCaptcha(true)
      }
    }, [phone, fullname, connection, timeIsSelected,])

    // const fixedElRef = useRef(null)

    // useEffect(() => {
    //   const fixedEl = fixedElRef.current
    //   if (!fixedEl) return
  
    //   const rect = fixedEl.getBoundingClientRect()
    //   const distanceFromWindowTop = rect.top
    //   const distanceFromWindowLeft = rect.left
    //   debugger
    //   let top = fixedEl.offsetTop
    //   let left = fixedEl.offsetLeft
  
    //   if (distanceFromWindowTop !== 0) {
    //     top = -distanceFromWindowTop
    //     fixedEl.style.top = `${top}px`
    //   }
  
    //   if (distanceFromWindowLeft !== 0) {
    //     left = -distanceFromWindowLeft
    //     fixedEl.style.left = `${left}px`
    //   }
    // }, [])

  return <>
    <div style={{
      transform: `translate(${showSend ? "-50%, -50%" : "-50%, -100%"})`,
      top: showSend ? "50%" : "0%",
      opacity: showSend ? 1 : 0
    }}
      className={styles.modal}
      // ref={fixedElRef}
    >
      <span className={styles.close_modal} onClick={onClose}></span>
      <div className={styles.modal_info}>
        <h3>Оставь заявку для записи на курс “{course?.title}” </h3>
      </div>
      <form className={styles.form_container}>
        <input 
          className={styles.input}
          placeholder="Ваше Имя"
          name="fullname"
          value={fullname}
          onChange={(e) => {
            // if (phone.length > 10 && fullname.length > 3 && connection !== "" && timeIsSelected === true) {
            //   setShowCaptcha(true)
            // }
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
            // if (phone.length > 10 && fullname.length > 3 && connection !== "" && timeIsSelected === true) {
            //   setShowCaptcha(true)
            // }
            globals.checkPhoneMask(e.target.value, setPhone)
            console.log(e.target.value, "phoneNumber");
          }}
        />
        <select 
          className={styles.selectBlock} 
          value={connection} 
          onChange={e => {
            // if (phone.length > 10 && fullname.length > 3 && connection !== "" && timeIsSelected === true) {
            //   setShowCaptcha(true)
            // }
            setConnection(e.target.value)
          }}
        >
          <option value="3">Способ связи</option>
          <option value="0">Звонок</option>
          <option value="1">Whatsapp</option>
        </select>
        {datesLoaded === true ? 
        <DateTimePicker 
          disabledDates={dates} 
          outputDate={outputDate} 
          setOutputDate={setOutputDate}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          busyHours={busyHours} 
          setBusyHours={setBusyHours}
          selectedBlock={selectedBlock}
          setSelectedBlock={setSelectedBlock}
          setTimeIsSelected={setTimeIsSelected}
        /> : ''}
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
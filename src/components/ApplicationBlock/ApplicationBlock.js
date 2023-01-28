import { useState, useEffect } from "react";
import styles from "./ApplicationBlock.module.css";
import globals from "../../globals";
import axios from "axios";
import Backdrop from "../Backdrop/Backdrop";
import SuccessfullyModal from "../SuccessfullyModal/SuccessfullyModal";
import { Image } from "react-bootstrap";
import CaptchaComponent from "../Captcha/Captcha";
import Link from "next/link";
import DateTimePicker from "../DateTimePicker/DateTimePicker";

const ApplicationBlock = (props) => { 
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [insertCaptchaText, setInsertCaptchaText] = useState('Введите текст с картинки')
  const [captchaText, setCaptchaText] = useState("");
  const [connection, setConnection] = useState("");
  const [outputDate, setOutputDate] = useState("")
  const [check, setCheck] = useState(false);
   
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [showSend, setShowSend] = useState(false);

  const [randomizedCaptchaId, setRandomizedCaptchaId] = useState()
  const [randomizedCaptchaData, setRandomizedCaptchaData] = useState()

  const [proccessOfCaptcha, setProccessOfCaptcha] = useState(0)
  const [proccessOfCaptchaUrl, setProccessOfCaptchaUrl] = useState('https://realibi.kz/file/633881.png')
 
  const date = new Date()
  const thisDay = date.getDate()
  const tomorrowDay = date.getDate() + 1
  const thisMonth = date.getMonth()
  const thisYear = date.getFullYear()
  const tomorrowDate = new Date(thisYear, thisMonth, tomorrowDay)

  const [dates, setDates] = useState('')
  const [datesLoaded, setDatesLoaded] = useState(false)
  const [timeIsSelected, setTimeIsSelected] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date(thisYear, thisMonth, tomorrowDay, 10, 10, 10))
  const [selectedTime, setSelectedTime] = useState(null)
  const [busyHours, setBusyHours] = useState(['08:00']);
  const [selectedBlock, setSelectedBlock] = useState('08:00')

  useEffect(()=> {
    loadCaptcha() 
    // loadDates() 
    // if (!dates){ 
    //   loadDates()
    // }
    console.log('OUT IN MAIN', props)
  }, []) 

  useEffect(() => {
    if (props.course.id) {
      loadDates() 
    }
  }, [props.course.id])

  useEffect(() => {
    loadCaptchaWithId()
  }, [randomizedCaptchaId])  
 
  const loadDates = async () => { 
    let teacherId = props.teacherId
    let getCoursesId = await axios.post(`${globals.productionServerDomain}/getCoursesByTeacherId/` + teacherId)
    let coursesId = []
    getCoursesId['data'].map(el => {
      coursesId.push(el.id)
    })
    // let id = props?.course?.id
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
    // console.log("DATES!", dates['data'])
    // setDates(dates['data'])  
    setDatesLoaded(true)
  } 

  const loadCaptchaWithId = async () => {
    let data = randomizedCaptchaId
    let captcha2 = await axios.post(`${globals.productionServerDomain}/getCaptchaWithId/` + data)
    console.log("captcha2", captcha2['data'])
    setRandomizedCaptchaData(captcha2['data'])
  }

  const handleShowSend = () => setShowSend(true);
 
  const firstStepValidation = () =>  {
    if (fullname !== "") {
      alert("Заполните все поля!");
      return false;
    } else if (phone.length < 10) {
      alert("Заполните все поля!");
      return false;
    } else {
      // setShowSend(true); 
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
      setFullname("");
      setConnection("");
      setPhone("");
      setCheck(false);
      setShowCaptcha(false);
      setCaptchaText("");
      setCheck(false); 
      loadCaptcha();
      setProccessOfCaptcha(0);
      setProccessOfCaptchaUrl("https://realibi.kz/file/633881.png");
      
      console.log('CAPTCHI',randomizedCaptchaData.text,captchaText)
      const ticketData = {
        fullname: fullname,
        phone: phone,
        course_id: props?.course?.id,
        connection: "Звонок",
        courseName: props?.course?.title,
        teacherName: props?.teacherByCourse?.name + '' + props?.teacherByCourse?.surname,
        outputDate: outputDate
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
    } else {setInsertCaptchaText('Неверный ввод текста с картинки!')
            setProccessOfCaptcha(1)
            handlerOfProccessOfCaptcha(1)}
  }

  const onClickNext = () => {
    setShowSend(false);
    setFullname("");
    setEmail("");
    setPhone(""); 
    setCheck(false);
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
    if (phone.length > 10 && fullname != "" && email.length > 3 && timeIsSelected == true) {
      setShowCaptcha(true)
    }
  }, [phone, fullname, email, timeIsSelected])

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
          onChange={(e) => {
            // if (phone.length > 10 && fullname.length > 3 && email.length > 6 && timeIsSelected == true) {
            //   setShowCaptcha(true)
            // }
            setFullname(e.target.value)
          }} 
        /> 
      </label>
      <label className={styles.input_container}>
        Ваш E-mail
        <input 
          placeholder="Ваш E-mail" 
          name="email"
          value={email}
          onChange={(e) => {
            // if (phone.length > 10 && fullname.length > 3 && email.length > 6 && timeIsSelected == true) {
            //   setShowCaptcha(true)
            // }
            setEmail(e.target.value)
          }}
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
            // if (phone.length > 10 && fullname.length > 3 && email.length > 6 && timeIsSelected == true) {
            //   setShowCaptcha(true)
            // }
            globals.checkPhoneMask(e.target.value, setPhone);
          }}
        /> 
      </label>
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
        className={styles.button_animate} 
        onClick={(e) => {
          e.preventDefault();
            if (firstStepValidation()) {
              // sendApplication();
              // setShowCaptcha(true)
            } else {
              alert("Заполните пожалуйста все поля.")
            }
        }}
      > 
        Попробовать бесплатно
      </button>
      <span 
        // className={check ? styles.check_on : styles.check_off}
        // onClick={() => setCheck(!check)}
        style={{maxWidth: "375px"}}
      >
        Нажимая на кнопку "Попробовать бесплатно", Вы принимаете <Link href="/offer"><a>условия публичной оферты</a></Link>
      </span>
    </form>
  </div>
};

export default ApplicationBlock; 
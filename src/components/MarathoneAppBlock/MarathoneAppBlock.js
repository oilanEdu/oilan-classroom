import styles from "./MarathoneAppBlock.module.css";
import { useState, useEffect } from "react";
import globals from "../../globals";
import axios from "axios";
import Backdrop from "../Backdrop/Backdrop";
import SuccessfullyModal from "../SuccessfullyModal/SuccessfullyModal";
import CaptchaComponent from "../Captcha/Captcha";
import Link from "next/link";
import { Image } from "react-bootstrap";

const MarathoneAppBlock = ({ marathone }) => {
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [insertCaptchaText, setInsertCaptchaText] = useState('Введите текст с картинки')
  const [captchaText, setCaptchaText] = useState("");
  const [connection, setConnection] = useState("Способ связи");
  const [selectConnectShow, setSelectConnectShow] = useState(false);
  const [check, setCheck] = useState(false);
 
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [showSend, setShowSend] = useState(false);

  const [randomizedCaptchaId, setRandomizedCaptchaId] = useState()
  const [randomizedCaptchaData, setRandomizedCaptchaData] = useState()

  const [proccessOfCaptcha, setProccessOfCaptcha] = useState(0)
  const [proccessOfCaptchaUrl, setProccessOfCaptchaUrl] = useState('https://realibi.kz/file/633881.png')

  useEffect(()=> {
    loadCaptcha()
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

  const handleShowSend = () => setShowSend(true);

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
    let getAllCaptchaIdRandom = Math.floor(Math.random() * getAllCaptchaId['data'].length)
    setRandomizedCaptchaId(getAllCaptchaIdRandom)
    const captchaFin = captcha['data'][0]
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
      setConnection("Способ связи");
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
        connection: connection,
        marathone_id: marathone?.id,
        marathone_name: marathone?.marathone
      }

      axios({
        method: "post",
        url: `${globals.productionServerDomain}/createMarathoneTicket`,
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
    }
  };

  const onClickNext = () => {
    setShowSend(false);
    setFullname("");
    setPhone("");
    setCheck(false);
  };

  const handlerOfProccessOfCaptcha = (value) => {
    if (value === 0) {
      setProccessOfCaptchaUrl('https://realibi.kz/file/633881.png');
    } else if (value === 1) {
      setProccessOfCaptchaUrl('https://realibi.kz/file/499291.png');
    } else{
      setProccessOfCaptchaUrl('https://realibi.kz/file/98680.png');
    }
  }

  return <div className={styles.container}>
    <SuccessfullyModal show={showSend} onClickNext={onClickNext} handleShow={handleShowSend} />
    <Backdrop show={showSend} />
    <div className={styles.fullFormContent}>
      <div className={styles.leftFormContent}>
        <h3>Прими участие в интерактивном марафоне!</h3>
        <form className={styles.form_container}>
          <input 
            className={styles.input_container}
            placeholder="Ваше Имя"
            name="fullname"
            value={fullname}
            onChange={(e) => {
              if (phone.length > 10 && fullname.length > 3) {
                setShowCaptcha(true)
              }
              setFullname(e.target.value)
            }}
          />
          <input 
            className={styles.input_container}
            placeholder="Ваш Телефон" 
            name="phone"
            value={phone}
            onKeyDown={(e) => {
              if (e.keyCode === 8) {
                setPhone(phone.slice(0, -1));
              }
            }}
            onChange={(e) => {
              if (phone.length > 10 && fullname.length > 3) {
                setShowCaptcha(true)
              }
              globals.checkPhoneMask(e.target.value, setPhone);
            }}
          />
          <div style={{position: "relative"}}>
            <div 
              onClick={() => setSelectConnectShow(!selectConnectShow)}
              className={selectConnectShow ? styles.connection_block_show : styles.connection_block_hide}
            >
              {connection}
            </div>
            <div 
              style={{display: selectConnectShow ? "block" : "none"}}
              className={styles.connection_block_options}
            >
              <div
                onClick={() => {
                  setConnection("Звонок");
                  setSelectConnectShow(!selectConnectShow);
                }}
              >
                Звонок
              </div>
              <div 
                onClick={() => {
                  setConnection("Whatsapp");
                  setSelectConnectShow(!selectConnectShow);
                }}
              >
                Whatsapp
              </div>
            </div>
          </div>
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
          <div className={styles.button_container}>
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

                  } else {
                    alert("Заполните пожалуйста все поля.")
                  }
                }
              }}
            >
              Оставить заявку
            </button>
            <span>
              Нажимая на кнопку "Оставить заявку", Вы принимаете <Link href="/offer"><a>условия публичной оферты</a></Link>
            </span>
          </div>
        </form>
      </div>
      <div className={styles.rightFormContent}>
        <div className={styles.ny_block}>
          <h3 className={styles.app_ny_block_title}>Новогодний марафон</h3>
          <p className={styles.app_ny_block_subtitle}>Близится новый год, и все подводят итоги. Вы успеете включить еще одну победу, научившись говорить на казахском в марафоне от Oilan io.</p>
        </div>
        
      </div>
    </div>
  </div>
};

export default MarathoneAppBlock;
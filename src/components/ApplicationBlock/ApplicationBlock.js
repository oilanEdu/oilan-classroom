import { useState } from "react";
import styles from "./ApplicationBlock.module.css";
import globals from "../../globals";
import axios from "axios";
import Backdrop from "../Backdrop/Backdrop";
import SuccessfullyModal from "../SuccessfullyModal/SuccessfullyModal";

const ApplicationBlock = () => {
  const [check, setCheck] = useState(false);
 
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [showSend, setShowSend] = useState(false);

  const handleShowSend = () => setShowSend(false);

  const firstStepValidation = () =>  {
    if (fullname.length < 3) {
      alert("Заполните все поля!");
      return false;
    } else if (phone.length < 16) {
      alert("Заполните все поля!");
      return false;
    } else {
      setShowSend(true);
      return true;
    }
  };

  const sendApplication = () => {
    const ticketData = {
      fullname: fullname,
      email: email,
      phone: phone,
      course_id: 1
    };

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
              sendApplication();
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
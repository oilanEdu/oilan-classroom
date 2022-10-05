import { useState } from "react";
import styles from "./ApplicationModal.module.css";
import globals from "../../globals";
import axios from "axios";
import Backdrop from "../Backdrop/Backdrop";

const ApplicationModal = ({showSend, handleShowSend}) => {
  const [check, setCheck] = useState(false);
 
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [connection, setConnection] = useState("");

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

  const sendApplication = () => {
    const ticketData = {
      fullname: fullname,
      phone: phone,
      course_id: 1,
      connection: connection === 0 ? "Звонок" : "Whatsapp"
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
  };

  return <>
    <div style={{
      transform: `translate(${showSend ? "-50%, -50%" : "-50%, -100%"})`,
      top: showSend ? "50%" : "0%",
      opacity: showSend ? 1 : 0
    }}
      className={styles.modal}
    >
      <span className={styles.close_modal} onClick={handleShowSend}></span>
      <div className={styles.modal_info}>
        <h3>Оставь заявку для записи на курс “Математика простыми словами” </h3>
      </div>
      <form className={styles.form_container}>
        <input 
          className={styles.input}
          placeholder="Ваше Имя"
          name="fullname"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
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
            globals.checkPhoneMask(e.target.value, setPhone)
          }}
        />
        <select 
          className={styles.selectBlock} 
          value={connection} 
          onChange={e => setConnection(e.target.value)}
        >
          <option value="3">Способ связи</option>
          <option value="0">Звонок</option>
          <option value="1">Whatsapp</option>
        </select>
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
                handleShowSend()
                setFullname("");
                setConnection("");
                setPhone("");
                setCheck(false)
              } else {
                alert("Заполните пожалуйста все поля.")
              }
            }
          }}
        >
          Оставить заявку
        </button>
        <span 
          className={check ? styles.check_on : styles.check_off}
          onClick={() => setCheck(!check)}
        >
          Я принимаю условия публичной оферты
        </span>
      </form>
    </div>
    <Backdrop show={showSend} />
  </>
};

export default ApplicationModal;
import styles from "./AboutMarathone.module.css";
import ApplicationMarathoneModal from "../ApplicationMarathoneModal/ApplicationMarathoneModal";
import SuccessfullyModal from "../SuccessfullyModal/SuccessfullyModal";
import { useState } from "react";

const AboutMarathone = ({marathone}) => {
  console.log(marathone);
  const [showSend, setShowSend] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleShowSend = () => {
    setShowSend(false);
    setShowSuccess(true);
  };

  const closeHandler = () => {
    setShowSend(false);
  };

  const handleShowSuccess = () => setShowSuccess(false);
  return<>
    <div className={styles.about_marathone}>
      <SuccessfullyModal show={showSuccess} onClickNext={handleShowSuccess}/>
      <ApplicationMarathoneModal showSend={showSend} handleShowSend={handleShowSend} onClose={closeHandler}/>
      <div className={styles.info_block}>
        <span>Онлайн-марафон</span>
        <h1>{marathone?.marathone}</h1>
        <p>{marathone?.direction}</p>
        <button onClick={() => setShowSend(true)}>Записаться на марафон</button>
      </div>
      <div className={styles.santa_block}>
        <div className={styles.santa_bg}></div>
        <div className={styles.gradient_bg}></div>
        <div className={styles.santa_block_text}>
          <p className={styles.santa_block_text_title}>Бесплатный 3-х дневный</p>
          <p className={styles.santa_block_text_bold}>Новогодний марафон</p>
          <p className={styles.santa_block_text_subtitle}>Старт уже 26 декабря!</p> 
          <p className={styles.santa_block_text_subtitle}>Оставь заявку и прими участие.</p>
        </div>
      </div>
    </div>
    <div className={styles.who_suits}>
      <div className={styles.who_suits_img}>
        <img src="https://realibi.kz/file/144445.png" />
      </div>
      <div className={styles.who_suits_text}>
        <h1>Кому подойдет марафон</h1>
        <p>{marathone?.who_suits}</p>
      </div>
    </div>
  </>
};

export default AboutMarathone;
import { useState } from "react";
import styles from "./ApplicationBlock.module.css";

const ApplicationBlock = () => {
  const [check, setCheck] = useState(false);

  return <div className={styles.container}>
    <h1>Запишитесь на курс сейчас</h1>
    <span className={styles.subtitle}>
      И мы свяжемся с вами для записи на пробный урок
    </span>
    <form className={styles.form_container}>
      <label className={styles.input_container}>
        Ваше Имя
        <input placeholder="Ваше Имя" />
      </label>
      <label className={styles.input_container}>
        Ваш E-mail
        <input placeholder="Ваш E-mail" />
      </label>
      <label className={styles.input_container}>
        Ваш Телефон
        <input placeholder="Ваш Телефон" />
      </label>
      <button className={styles.button}>
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
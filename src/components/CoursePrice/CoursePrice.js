import styles from "./CoursePrice.module.css";
import classnames from "classnames";
import ApplicationModal from "../ApplicationModal/ApplicationModal";
import { useState } from "react";
import SuccessfullyModal from "../SuccessfullyModal/SuccessfullyModal";

const CoursePrice = () => {

  const [showSend, setShowSend] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleShowSend = () => {
    setShowSend(false);
    setShowSuccess(true);
  };
  
  const handleShowSuccess = () => setShowSuccess(false);

  const closeHandler = () => {
    setShowSend(false);
  };

  return <div className={styles.container}>
    <SuccessfullyModal show={showSuccess} onClickNext={handleShowSuccess}/>
    <ApplicationModal showSend={showSend} handleShowSend={handleShowSend} onClose={closeHandler} />
    <h2>Стоимость обучения на курсе</h2>

    <div className={styles.price_content}>
      <span 
        className={styles.buy}
        onClick={() => setShowSend(true)}
      ></span>
      <span className={styles.possibility}>* Мы предоставляем возможность оплаты курса еженедельно</span>
      <div className={styles.price_info}>
        <div className={classnames(styles.price_info_item, styles.full)}>
          <span>64 000 ₸</span>
          <p>За полный курс</p>
        </div>
        <div className={classnames(styles.price_info_item, styles.start)}>
          <span>дата начала</span>
          <p>24.10.2022</p>
        </div>
        <div className={classnames(styles.price_info_item, styles.part)}>
          <span>16 000 ₸</span>
          <p>*При оплате частями.</p> 
          <p>Оплата совершается раз в неделю</p> 
        </div>
        <div className={classnames(styles.price_info_item, styles.finish)}>
          <span>Дата окончания</span>
          <p>24.11.2022</p>
        </div>
      </div>
    </div>
    
  </div>
};

export default CoursePrice;
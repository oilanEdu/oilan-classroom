import styles from "./CoursePrice.module.css";

const CoursePrice = () => {
  return <div className={styles.container}>
    <h2>Стоимость обучения на курсе</h2>

    <div className={styles.price_content}>
      <span className={styles.buy}></span>
      <span className={styles.possibility}>* Мы предоставляем возможность оплаты курса еженедельно</span>
      <div className={styles.price_info}>
        <div className={styles.price_info_item}>
          <span>40 000 ₸</span>
          <p>За полный курс</p>
        </div>
        <div className={styles.price_info_item}>
          <span>дата начала курса</span>
          <p>01.10.2022</p>
        </div>
        <div className={styles.price_info_item}>
          <span>12 000 ₸*</span>
          <p>*При оплате частями.</p> 
          <p>Оплата совершается раз в неделю</p> 
        </div>
        <div className={styles.price_info_item}>
          <span>Дата окончания</span>
          <p>02.11.2022</p>
        </div>
      </div>
    </div>
    
  </div>
};

export default CoursePrice;
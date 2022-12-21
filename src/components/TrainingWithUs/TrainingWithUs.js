import styles from "./TrainingWithUs.module.css";

const TrainingWithUs = () => {
  return <div className={styles.container}>
    <h3>Обучение у нас</h3>
    <div className={styles.blocks}>
      <div className={styles.first_block}>
        <div className={styles.first_block_content}>
          <p className={styles.block_title}>🔥 Только на нашем марафоне </p>
          <p className={styles.block_text}>Новый год - это пора сюрпризов, поэтому активных участников ждут исключительные подарки.</p>
        </div>
        
        <div className={styles.first_block_img}></div>
      </div>
      <div className={styles.second_block}>
        <p className={styles.block_title}>😄 Бонус </p>
        <p className={styles.block_text}>Эффективные авторские учебные пособия</p>
      </div>
      <div className={styles.third_block}>
        <p className={styles.block_title}>😎 Интерактивность</p>
        <p className={styles.block_text}>-Чат WhatsApp для увлекательных заданий </p>
        <p className={styles.block_text}>-А по вечерам короткие онлайн встречи в разговорном клубе</p>
      </div>
    </div>
    
  </div>
};

export default TrainingWithUs;
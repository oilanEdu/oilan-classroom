import styles from "./WhatToExpect.module.css";

const WhatToExpect = () => {
  return <div className={styles.container}>
    <div className={styles.content}>
      <span className={styles.title}>Что тебя ждет на марафоне 20 по 22 декабря?</span>

      <div className={styles.days_container}>
        <div className={styles.day_present}>
          <span className={styles.day_present_title}>1 день</span>
          <p className={styles.day_present_text}>Научитесь строить диалоги во время приобретения подарков</p>
          <img className={styles.day_present_img} src="https://realibi.kz/file/635446.png" />
          <img className={styles.day_present_icon} src="https://realibi.kz/file/872431.png" />
        </div>
        <div className={styles.day_present}>
          <span className={styles.day_present_title}>2 день</span>
          <p className={styles.day_present_text}>Сможете легко добраться до места вечеринки</p>
          <img className={styles.day_present_img} src="https://realibi.kz/file/104348.png" />
          <img className={styles.day_present_icon} src="https://realibi.kz/file/95843.png" />
        </div>
        <div className={styles.day_heart}>
          <span className={styles.day_present_title}>3 день</span>
          <p className={styles.day_present_text}>Порадуете всех яркими поздравлениями с праздником</p>
          <img className={styles.day_present_img} src="https://realibi.kz/file/573889.png" />
          <img className={styles.day_present_icon} src="https://realibi.kz/file/953588.png" />
        </div>
      </div>
      <span className={styles.promise}>Вы сможете выучить более 100* слов на казахском языке</span>
    </div>
    <div className={styles.bg_line}></div>
  </div>
};

export default WhatToExpect;
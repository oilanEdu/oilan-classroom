import styles from "./ModalSuccess.module.css";

const ModalSuccess = ({show, onClickNext, headText, text, link}) => {
  return <>
    <div style={{
      transform: `translate(${show ? "-50%, -50%" : "-50%, -100%"})`,
      top: show ? "50%" : "0%",
      opacity: show ? 1 : 0
    }}
      className={styles.modal}
    >
      <span className={styles.close_modal} onClick={onClickNext}></span>
      <div className={styles.modal_info}>
        <h3>{headText}</h3>
        <p>{text}</p>
        <div className={styles.modal_link}>{link}</div>
      </div>
      <button 
        className={styles.modal_button} 
        onClick={onClickNext}
      >
        Продолжить
      </button>
    </div>
  </>
};

export default ModalSuccess;
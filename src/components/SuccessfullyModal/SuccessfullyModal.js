import styles from "./SuccessfullyModal.module.css";

const SuccessfullyModal = ({show, onClickNext}) => {
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
        <h3>Ваша заявка успешно отправлена! </h3>
        <p>Мы Свяжемся с вами в течении 24 часов.</p>
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

export default SuccessfullyModal;
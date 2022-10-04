import styles from './Backdrop.module.css'

const Backdrop = ({ show, click }) => {
  return show ? <div
    onClick={click}
    className={styles.backdrop}
  /> : null;
};

export default Backdrop;
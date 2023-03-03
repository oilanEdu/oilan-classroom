import { useClipboard } from 'use-clipboard-copy';
import styles from "./CopyLink.module.css";

export default function CopyLink({ url, succesMessage }) {
  const clipboard = useClipboard();
  return (
    <div className={styles.container} style={{display: succesMessage === "" ? "none" : "block"}}>
      <input className={styles.url_input} ref={clipboard.target} value={url} readOnly />
      <button className={styles.button} onClick={clipboard.copy}></button>
    </div>
  );
}
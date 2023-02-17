import { useClipboard } from 'use-clipboard-copy';
import styles from "./CopyLink.module.css";

export default function CopyLink({ url }) {
  const clipboard = useClipboard();
  return (
    <div className={styles.container}>
      <input className={styles.url_input} ref={clipboard.target} value={url} readOnly />
      <div className={styles.url} onClick={clipboard.copy}>{url}</div>
      <button className={styles.button} onClick={clipboard.copy}>📋</button>
    </div>
  );
}
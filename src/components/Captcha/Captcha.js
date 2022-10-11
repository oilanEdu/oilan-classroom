import { useState, useEffect } from "react";
import styles from "./Capthca.module.css";
import globals from "../../globals";
import axios from "axios";
import Backdrop from "../Backdrop/Backdrop";
import { Image } from "react-bootstrap";

const CaptchaComponent = (props) => {

  return <>
        <div className={styles.captchaWrapper} style={props.showCaptcha?{display:'block'}:{display:'none'}}>
          <div className={styles.captchaText}>{props.insertCaptchaText}</div>
          <div className={styles.captchaImageSection}>
            <Image 
              src={props.captchaImage}
              style={{width:'100%'}}
              className={styles.captchaImage}
            />
            <div className={styles.anotherImageButton} onClick={(e) => {e.preventDefault()
            props.anotherImage()}}></div>
          </div>
          <div className={styles.captchaInputsSection}>
            <input
              placeholder="Текст"
              className={styles.captchaInput}
              onChange={(e) => props.setCaptchaText(e.target.value)}
            />
            <button
              className={styles.captchaButton}
              onClick={(e) => {
                e.preventDefault()
                props.sendApplication();
                e.preventDefault()
                props.setFullname("");
                props.setConnection("");
                props.setPhone("");
                props.setCheck(false)
                e.preventDefault()
              }}
            >
              Отправить
            </button>
          </div>
        </div>
  </>
};

export default CaptchaComponent;
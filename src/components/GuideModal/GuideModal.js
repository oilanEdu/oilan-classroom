import React, { useState, useEffect } from "react";
import globals from "../../globals";
import axios from "axios";
import styles from "./GuideModal.module.css";
import { Image } from "react-bootstrap";

const GuideModal = (props) => {

  return <>
        <div className={styles.guideWrapper} 
        style={props.showGuide?{display:'flex'}:{display:'none'}}
        >
          <div className={styles.closeBtnRow}>
            <span
              className={styles.closeBtn}
              onClick={() => {
                props.setShowGuide(false)
              }}
            >
              X
            </span>
          </div>
          <div className={styles.instructionBlock}>
            <h1>Заголовок</h1> 
            Место для вашей инструкции!)
          </div>
          <iframe
            className={styles.guideVideo}

            src={props.video}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
  </>
};

export default GuideModal;
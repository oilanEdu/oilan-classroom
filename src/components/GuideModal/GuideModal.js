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
            <center><h1>Основы работы с платформой</h1></center>
            <p>Основными компонентами образовательного процесса являются <b>курс</b>, <b>программа</b> и <b>урок</b>.</p>
            <p>Первое, что Вам необходимо сделать - это создать образовательный курс по преподаваемому Вами предмету (<i>например, курс по китайскому языку, программированию, бизнес-тренинг</i>).</p>
            <p>В рамках Вашего курса вы можете создать <b>неограниченное</b> количество программ (<i>для разных уровней, групповые и индивидуальные</i>)</p>
            <p>К каждой из программ вы можете добавить уроки как на этапе создания программы, так и позже.</p>
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
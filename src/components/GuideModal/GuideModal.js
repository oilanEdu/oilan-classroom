import React, { useState, useEffect } from "react";
import globals from "../../globals";
import axios from "axios";
import styles from "./GuideModal.module.css";
import { Image } from "react-bootstrap";

const GuideModal = (props) => {
  const guide = props.guide
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
            <center><h2>{guide?.title}</h2></center>
            <div className={styles.content} dangerouslySetInnerHTML={{ __html: guide?.content }} />
          </div>
          <iframe
            className={styles.guideVideo}

            src={guide?.video_link}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <div>Не загружается видео? Перейдите по прямой <a href={guide?.video_link}>ссылке </a> на видеофайл</div>
        </div>
  </>
};

export default GuideModal;
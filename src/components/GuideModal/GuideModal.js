import React, { useState, useEffect, useRef } from "react";
import globals from "../../globals";
import axios from "axios";
import styles from "./GuideModal.module.css";
import { Image } from "react-bootstrap";
import ClickAwayListener from "@mui/base/ClickAwayListener";

const GuideModal = (props) => {

  const {
    guide,
    showGuide,
    setShowGuide
  } = props

  const modalRef = useRef(null);

  const handleClickAway = () => {
    setShowGuide(false);
    console.log('guideProps', props)
  };

  return <>
        <ClickAwayListener onClickAway={handleClickAway}>
          <div
            className={styles.guideWrapper}
            style={showGuide ? { display: "flex" } : { display: "none" }}
            ref={modalRef}
          >
            <div className={styles.closeBtnRow}>
              <span
                className={styles.closeBtn}
                onClick={() => {
                  setShowGuide(false)
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
            <center><div>Не загружается видео? Перейдите по прямой <a href={guide?.video_link}>ссылке </a> на видеофайл</div></center>
          </div>
        </ClickAwayListener>
  </>
};

export default GuideModal;
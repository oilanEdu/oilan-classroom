import Link from "next/link";
import { useState } from "react";
import styles from "./ProgramItem.module.css";
import { Image } from "react-bootstrap";
import axios from "axios";
import globals from "../../../src/globals";
import ClickAwayListener from '@mui/base/ClickAwayListener';

const ProgramItem = ({program, url, index}) => {

  const deleteHandler = async (id) => {
    const data = {
      id
    }; 

    await axios({
      method: "delete",
      url: `${globals.productionServerDomain}/deleteProgram`,
      data: data,
    })
      .then(function (res) {
        alert("Программа успешно удалена");
      })
      .catch((err) => {
        alert("Произошла ошибка"); 
      });
    location.reload();
  }
  const [showSetting, setShowSetting] = useState(false)
  const handleClickAway = () => {
    setShowSetting(false);
  };

  return <ClickAwayListener onClickAway={handleClickAway}>
  <div className={styles.program}>
  <span className={styles.pNumber}>№ {index + 1}</span>
  <span className={styles.pCourse}>{program?.course_title}</span>
  <span className={styles.pProgram}>
    <Image
      src="https://realibi.kz/file/846025.png"
      style={{ marginRight: "8px" }}
    />
    {program?.title}
  </span>
  <span className={styles.pLessCount}>
    {program?.lessons_count} занятий
  </span>
  <span className={styles.pDates}>
    <p>{program?.studentqty}</p>
  </span>
  <span className={styles.pEdit}>
    <div 
      className={styles.setting}
      onClick={() => setShowSetting(!showSetting)}
    >
      <p className={showSetting ? styles.settingTitleShow : styles.settingTitleHide}>
        Настройки
        </p>
      <div 
        className={styles.editSet}
        style={{display: showSetting ? "block" : "none"}}
      >
        <Link
          href={`${encodeURIComponent(
            url
          )}/editProgram/?programId=${encodeURIComponent(
            program?.id
          )}`}
          target="_blank"
        >
          Редактировать
        </Link>
      </div>
    
      {/* <Image
        src="https://realibi.kz/file/109637.png"
        style={{ marginLeft: "8px" }}
      /> */}
      <div 
        className={styles.deleteSet}
        style={{display: showSetting ? "block" : "none"}}
        onClick={() => deleteHandler(program?.id)}
      >
        Удалить
      </div>
    </div>
    
  </span>
</div>
</ClickAwayListener>
};

export default ProgramItem;
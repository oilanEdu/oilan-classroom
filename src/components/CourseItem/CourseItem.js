import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./CourseItem.module.css";
import { Image } from "react-bootstrap";
import axios from "axios";
import globals from "../../globals";
import ClickAwayListener from '@mui/base/ClickAwayListener';

const CourseItem = ({course, url, index, onCheck, checked}) => {
  useEffect(() => {
    console.log('CourseItem', course)
  }, [course]);
  const deleteHandler = async (id) => {
    const data = {
      id
    }; 

    await axios({
      method: "delete",
      url: `${globals.productionServerDomain}/deleteCourse`,
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
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className={styles.program}>
        <span className={styles.pNumber}><input type="checkbox" checked={checked} onChange={onCheck} />№ {index + 1}</span>
        <span className={styles.pCourse}>{course?.title}</span>
        <span className={styles.pProgram}>
          {course?.program_count}
        </span>
        <span className={styles.pLessCount}>
          {+course?.passed_students}
        </span>
        <span className={styles.pDates}>
          {+course?.all_students - +course?.passed_students}
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
                )}/editCourse/?courseId=${encodeURIComponent(
                  course?.id
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
              onClick={() => deleteHandler(course.id)}
            >
              Удалить
            </div>
          </div>
        </span>
      </div>
    </ClickAwayListener>
  );
};

export default CourseItem;
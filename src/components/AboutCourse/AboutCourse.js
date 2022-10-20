import styles from "./AboutCourse.module.css";
import { useState } from "react";
import { Image } from "react-bootstrap";
import ApplicationModal from "../ApplicationModal/ApplicationModal";
import SuccessfullyModal from "../SuccessfullyModal/SuccessfullyModal";

export default function AboutCourse(props) {
  
  const [showSend, setShowSend] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleShowSend = () => {
    setShowSend(false);
    setShowSuccess(true);
  };

  const closeHandler = () => {
    setShowSend(false);
  };

  const handleShowSuccess = () => setShowSuccess(false);

  const isIt = (value) => {
    let is = value % 2
    return is
  }


  return (
    <div className={styles.container}>
      <SuccessfullyModal show={showSuccess} onClickNext={handleShowSuccess}/>
      <ApplicationModal showSend={showSend} handleShowSend={handleShowSend} onClose={closeHandler} />
      <div className={styles.mainInfo}>
        <div className={styles.leftMainInfo}>
          <div className={styles.flud}>
            <p>Oilan-classroom</p>
            <div className={styles.imgBoom}></div>
          </div>
          <div className={styles.courseTitle}>
            <h1>{props.course?.title}</h1>
          </div>
          <div className={styles.courseDescription}>
            <p>
            {props.course?.description}
            </p>
          </div>
          <div className={styles.buttonBlock}>
            <button 
              className={styles.courseButton}
              onClick={() => setShowSend(true)}
            >
              Записаться на курс
            </button>
          </div>
        </div>
        <div className={styles.rightMainInfo}>
          <Image src={'https://realibi.kz/file/596699.png'} className={styles.imgArrow}/>
          <Image src={'https://realibi.kz/file/978476.png'} className={styles.imgGlobe}/>
          <Image src={'https://realibi.kz/file/274985.png'} className={styles.imgGirls}/>
        </div>
      </div>
      <div className={styles.targetPersons}>
        <h1>КОМУ ПОДОЙДЕТ КУРС</h1>
        <div className={styles.items}>
          {props.courseTargets?.map(el => <>
          <div className={styles.item}>
            <Image src={el.img} className={styles.imgEvaluation}/>
            <p className={styles.targetTitle}>{el.title}</p>
            <p className={styles.targetDescr}>{el.text}</p>
          </div>
          </>)}
          
          {/* <div className={styles.item}>
            <Image src={'https://realibi.kz/file/410726.png'} className={styles.imgMedal}/>
            <p className={styles.targetTitle}>Поступающим в НИШ</p>
            <p className={styles.targetDescr}>Готовим ребенка к поступлению в НИШ</p>
          </div>
          <div className={styles.item}>
            <Image src={'https://realibi.kz/file/915691.png'} className={styles.imgDiploma}/>
            <p className={styles.targetTitle} id="about">Сдающим ЕНТ</p>
            <p className={styles.targetDescr}>Готовим ребенка к сдаче ЕНТ</p>
          </div> */}
        </div>
      </div>
      <div className={styles.courseSquares}>
        <h1>О КУРСЕ</h1>
        <div className={styles.squares}>
          {props.courseInfoBlocks?.map(el => <>
            <div className={isIt(el.block_order) ? styles.leftSquare : styles.rightSquare}>
              <p className={styles.squareTitle}>
                {el.title}
              </p>
              <p className={styles.squareText}>
                {el.text} 
              </p>
            </div>
          </>)}
          {/* <div className={styles.leftSquare}>
            <p className={styles.squareTitle}>
              Онлайн Обучение 😎
            </p>
            <p className={styles.squareText}>
              Обучение проходит онлайн в удобное для вас время 
            </p>
          </div>
          <div className={styles.rightSquare}>
            <p className={styles.squareTitle}>
              Индивидуальная программа 😄
            </p>
            <p className={styles.squareText}>
              Программа формируется на основе первого общения с учеником. <br/>Также индивидуально выстраивается расписание занятий 
            </p>
          </div>
          <div className={styles.leftSquare}>
            <p className={styles.squareTitle}>
              50 000 тенге 👌  
            </p>
            <p className={styles.squareText}>
              В стоимость входит 4 недели индивидуальной работы с учеником по 2 занятия в неделю 
            </p>
          </div>
          <div className={styles.rightSquare}>
            <p className={styles.squareTitle}>
              Бонусная система обучения 🔥
            </p>
            <p className={styles.squareText}>
              При положительных оценках вы получаете грант на следующую покупку:<br/>
                от 80 до 100 баллов - грант 10%<br/>
                от 60 до 80 баллов - грант 7%<br/>
                от 40 до 60 баллов - грант 5%  
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}

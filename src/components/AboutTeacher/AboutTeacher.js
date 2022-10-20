import styles from "./AboutTeacher.module.css";
import { useState } from "react";
import { Image } from "react-bootstrap";
import ApplicationModal from "../ApplicationModal/ApplicationModal";
import SuccessfullyModal from "../SuccessfullyModal/SuccessfullyModal";

export default function AboutTeacher(props) {
  const [showMainSpecificate, setShowMainSpecificate] = useState(false)
  const [showDiplomas, setShowDiplomas] = useState(false)
  const [showSkill, setShowSkill] = useState(false)
  const [showYourInteres, setShowYourInteres] = useState(false)
  const [showSend, setShowSend] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [allDiplomas, setAllDiplomas] = useState(false);
  

  const [certificates, setCertificates] = useState([
    'https://realibi.kz/file/939886.png', 
    'https://realibi.kz/file/410531.png',
    'https://realibi.kz/file/104843.png',
    'https://realibi.kz/file/104843.png',
    'https://realibi.kz/file/743376.png'
  ]);
  
  const handleShowSend = () => {
    setShowSend(false);
    setShowSuccess(true);
  };

  const closeHandler = () => {
    setShowSend(false);
  };

  const handleShowSuccess = () => setShowSuccess(false);

  return (
    <div className={styles.container}>
      <SuccessfullyModal show={showSuccess} onClickNext={handleShowSuccess}/>
      <ApplicationModal showSend={showSend} handleShowSend={handleShowSend} onClose={closeHandler} />
      <div className={styles.mainInfo}>
        <h1>ПРЕПОДАВАТЕЛЬ КУРСА</h1>
        <div className={styles.previewBlock}>
          <div className={styles.logoBlock}>
            <Image src={props.teacherByCourse?.avatar} className={styles.imgTeacher}/>
          </div>
          <div className={styles.infoBlock}>
            <h2>Преподаватель курса</h2>
            <h3>{props.teacherByCourse?.name} {props.teacherByCourse?.surname}</h3>
            <p>
              {props.teacherByCourse?.description}
            </p>
            <button 
              className={styles.courseButton}
              onClick={(e) => {
                e.preventDefault();
                setShowSend(true);
              }}
            >
              Записаться на курс
            </button>
          </div>
        </div>
      </div>
      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>Оcновные навыки</p>
          <p 
            onClick={() => setShowMainSpecificate(!showMainSpecificate)}
            className={styles.showButton}
          >
            {showMainSpecificate?<Image src={'https://realibi.kz/file/904733.png'} className={styles.imgArrow}/>:<Image src={'https://realibi.kz/file/148715.png'} className={styles.imgArrow}/>}
          </p>
        </div>
        <div className={showMainSpecificate?styles.showDetailInfoContain:styles.detailInfoContain}>
          <p>
          {props.teacherByCourse?.skills}
          </p>
        </div>
      </div>
      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>Дипломы и сертификаты</p>
          <p 
            onClick={() => setShowDiplomas(!showDiplomas)}
            className={styles.showButton}
          >
            {showDiplomas?<Image src={'https://realibi.kz/file/904733.png'} className={styles.imgArrow}/>:<Image src={'https://realibi.kz/file/148715.png'} className={styles.imgArrow}/>}
          </p>
        </div>
        {/*<div className={showDiplomas?styles.showDetailInfoContain:styles.detailInfoContain}>
          <div className={!allDiplomas ? styles.diplomaBlock : styles.diplomaAll}>
            {certificates.map(certificate => {
              // const extension = certificate.match(/[^.]+$/)[0]
              return <>
                <Image src={certificate} className={styles.imgArrow}/>
              </>        
            })}
            <span 
              onClick={() => setAllDiplomas(!allDiplomas)}
            >
              {!allDiplomas 
                ? "Все"
                : "Скрыть"
              }
            </span>
          </div>
        </div>*/}
      </div>
      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>Опыт работы</p>
          <p 
            onClick={() => setShowSkill(!showSkill)}
            className={styles.showButton}
          >
            {showSkill?<Image src={'https://realibi.kz/file/904733.png'} className={styles.imgArrow}/>:<Image src={'https://realibi.kz/file/148715.png'} className={styles.imgArrow}/>}
          </p>
        </div>
        <div className={showSkill?styles.showDetailInfoContain:styles.detailInfoContain}>
          <p>
          {props.teacherByCourse?.experience}
          </p>
        </div>
      </div>
      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>Чему вы научитесь на курсе</p>
          <p 
            onClick={() => setShowYourInteres(!showYourInteres)}
            className={styles.showButton}
          >
            {showYourInteres?<Image src={'https://realibi.kz/file/904733.png'} className={styles.imgArrow}/>:<Image src={'https://realibi.kz/file/148715.png'} className={styles.imgArrow}/>}
          </p>
        </div>
        <div className={showYourInteres?styles.showDetailInfoContain:styles.detailInfoContain}>
          <div className={styles.items}>
            {props.courseSkills?.map(el => <>
            <div className={styles.item}>
              <Image src={el.img} className={styles.imgArrow}/>
              <p>
                {el.text}
              </p>
            </div>
            </>)}
            {/* <div className={styles.item}>
              <Image src={'https://realibi.kz/file/316032.png'} className={styles.imgArrow}/>
              <p>
                Знать основные математические формулы
              </p>
            </div>
            <div className={styles.item}>
              <Image src={'https://realibi.kz/file/423807.png'} className={styles.imgArrow}/>
              <p>
                Уметь применять формулы на практике
              </p>
            </div>
            <div className={styles.item}>
              <Image src={'https://realibi.kz/file/115526.png'} className={styles.imgArrow}/>
              <p>
                Уметь находить самые простые решения задач
              </p>
            </div>
            <div className={styles.item}>
              <Image src={'https://realibi.kz/file/685686.png'} className={styles.imgArrow}/>
              <p>
                Относиться с интересом к математике
              </p>
            </div>
            <div className={styles.item}>
              <Image src={'https://realibi.kz/file/796133.png'} className={styles.imgArrow}/>
              <p>
                Быть одним из лучших учеников в классе
              </p>
            </div>
            <div className={styles.item}>
              <Image src={'https://realibi.kz/file/877284.png'} className={styles.imgArrow}/>
              <p>
                Быстро выполнять домашние задания
              </p>
            </div>
            <div className={styles.item}>
              <Image src={'https://realibi.kz/file/596856.png'} className={styles.imgArrow}/>
              <p>
                По другому относиться к миру цифр и формул
              </p>
            </div>
            <div className={styles.item}>
              <Image src={'https://realibi.kz/file/522405.png'} className={styles.imgArrow}/>
              <p>
                Не отвлекать родителей на решение домашних работ
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

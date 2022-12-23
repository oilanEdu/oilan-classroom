import styles from "./AboutMarathoneTeacher.module.css";
import { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import ApplicationModal from "../ApplicationModal/ApplicationModal";
import SuccessfullyModal from "../SuccessfullyModal/SuccessfullyModal";
import globals from "../../../src/globals";
import axios from "axios";

export default function AboutMarathoneTeacher(props) {
  const [showMainSpecificate, setShowMainSpecificate] = useState(false)
  const [showDiplomas, setShowDiplomas] = useState(false)
  const [showSkill, setShowSkill] = useState(false)
  const [showYourInteres, setShowYourInteres] = useState(true)
  const [showSend, setShowSend] = useState(false); 
  const [showSuccess, setShowSuccess] = useState(false);
  const [allDiplomas, setAllDiplomas] = useState(false);
  const [teacher, setTeacher] = useState({});
  const [marathoneSkills, setMarathoneSkills] = useState([]);
  const [certificates, setCertificates] = useState([]);

  console.log(props.marathone?.teacher_id);

  const getTeacherData = async () => {
    const teacherData = await axios.post(`${globals.productionServerDomain}/getTeacherByCourse/` + props.marathone?.teacher_id);
    setTeacher(teacherData.data[0]);
    const skills = await axios.post(`${globals.productionServerDomain}/getMarathoneSkills/` + props.marathone?.id);
    setMarathoneSkills(skills.data);
    const certificateTabl = await axios.post(`${globals.productionServerDomain}/getSertificateByTeacherId/` + props.marathone?.teacher_id);
    setCertificates(certificateTabl.data);
  }

  useEffect(() => {
    getTeacherData();
    console.log(teacher);
    console.log(marathoneSkills);
    console.log(certificates);
  }, [props.marathone]);
  
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
      <ApplicationModal showSend={showSend} handleShowSend={handleShowSend} onClose={closeHandler} course={props?.course} teacherByCourse={props?.teacherByCourse}/>
      <div className={styles.mainInfo}>
        <h1>ПРЕПОДАВАТЕЛЬ</h1>
        <div className={styles.previewBlock}>
          <div className={styles.logoBlock}>
            <Image src={teacher?.avatar} className={styles.imgTeacher}/>
          </div>
          <div className={styles.infoBlock}>
            <h3>{teacher?.surname} {teacher?.name} {teacher?.patronymic}</h3>
            <p>{teacher?.description}</p>
            <button 
              className={styles.courseButton}
              onClick={(e) => {
                e.preventDefault();
                setShowSend(true);
              }}
            >
              Попробовать бесплатно
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
          <p>{teacher?.skills}</p>
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
        <div className={showDiplomas?styles.showDetailInfoContain:styles.detailInfoContain}>
          <div className={!allDiplomas ? styles.diplomaBlock : styles.diplomaAll}>
            {certificates?.map(el => {
              return <>
                <Image src={el.img} className={styles.imgArrow}/>
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
        </div>
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
          <p>{teacher?.experience}</p>
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
            {marathoneSkills?.map(el => <>
            <div className={styles.item}>
              <Image src={el.img} className={styles.imgArrow}/>
              <p>
                {el.text}
              </p>
            </div>
            </>)}
          </div>
        </div>
      </div>
    </div>
  );
}

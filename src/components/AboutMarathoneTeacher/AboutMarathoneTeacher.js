import styles from "./AboutMarathoneTeacher.module.css";
import { useState } from "react";
import { Image } from "react-bootstrap";
import ApplicationModal from "../ApplicationModal/ApplicationModal";
import SuccessfullyModal from "../SuccessfullyModal/SuccessfullyModal";

export default function AboutMarathoneTeacher(props) {
  const [showMainSpecificate, setShowMainSpecificate] = useState(false)
  const [showDiplomas, setShowDiplomas] = useState(false)
  const [showSkill, setShowSkill] = useState(false)
  const [showYourInteres, setShowYourInteres] = useState(true)
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

  const [vremenno, setVremenno] = useState([
    {
        text: 'Правильно строить предложения, излагать свои мысли',
        img: 'https://realibi.kz/file/149801.png',
     },
     {
        text: 'правильному произношению звуков ',
        img: 'https://realibi.kz/file/807051.png',
     },
     {
        text: 'понимать текст, аудио материал и поток речи',
        img: 'https://realibi.kz/file/274887.png',
     },
     {
        text: 'пополните словарный запаса',
        img: 'https://realibi.kz/file/772117.png',
     }
    ])
  
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
        <h1>ПРЕПОДАВАТЕЛЬ КУРСА</h1>
        <div className={styles.previewBlock}>
          <div className={styles.logoBlock}>
            <Image src="https://realibi.kz/file/188127.png" className={styles.imgTeacher}/>
          </div>
          <div className={styles.infoBlock}>
            <h2>Преподаватель курса</h2>
            <h3>Зауре Уразкенова</h3>
            <p>
              Выпускница ПГУ им С.Торайгырова. Использует авторскую эффективную программу обучения. Работая над улучшением уровня знаний учащихся, закрытием пробелов в знаниях, объяснением школьных программы и улучшению успеваемости учащихся, подготовкой для участия в олимпиадах и конкурсах, в том числе международных. Большой опыт работы с детьми и взрослыми.
            </p>
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
          <p>
          Уверенность, коммуникативность, новаторство и работа на результат
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
        <div className={showDiplomas?styles.showDetailInfoContain:styles.detailInfoContain}>
          <div className={!allDiplomas ? styles.diplomaBlock : styles.diplomaAll}>
            {props?.sertificates?.map(el => {
              // const extension = certificate.match(/[^.]+$/)[0]
              return <>
                <Image src={el.img} className={styles.imgArrow}/>
              </>        
            })}
            <Image src="https://realibi.kz/file/825214.png" className={styles.imgArrow}/>
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
          <p>
          Oбщий стаж более 20 лет в различных образовательных учреждениях
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
            {vremenno?.map(el => <>
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

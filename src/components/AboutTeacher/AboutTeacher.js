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
            <Image src={'https://realibi.kz/file/436573.png'} className={styles.imgTeacher}/>
          </div>
          <div className={styles.infoBlock}>
            <h2>Преподаватель курса</h2>
            <h3>Дарья Шишкина</h3>
            <p>
              Выпускник Самарского национального университета имени академика С.П. Королева (диплом специалиста по направлению физика, диплом аспиранта по профилю физика и астрономия). Занимаюсь исследованиями в направлении фотовольтаики, наномедицины.<br/> 
              Основные навыки: высшая математика, линейная алгебра,  общая физика, школьная физика и математика 5-11 классы.
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
            Высшая математика, квантовая теория поля, линейная алгебра, квантовая физика, теория поля, общая физика
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
            Доцент кафедры наноинженерии Самарского университета, преподаю дисциплины, связанные с моделированием микроструктур, специальными дисциплинами (физика конденсированного состояния, физика поверхности, дополнительные главы физики, теоретические основы интегральной оптики, технологии дифракционной микрооптики), также работаю в научном образовательном центре нанотехнологии (НОЦ НТ - 94).<br/> 
            Ранее принимала участие в работах гранта РФФИ  НОМЕР ПРОЕКТА 16-48-630688 НАЗВАНИЕ ПРОЕКТА Исследование физических процессов в многослойных фоточувствительных кремниевых структурах с наноразмерными элементами Начало 2016г., окончание 2017г. (исполнитель)<br/>

            1. Изготовление фоточувствительных структур с пористым кремнием (изготовление наноструктур, профедение диффузии, нанесение контактов, оптических покрытий)<br/>
            2. Выполнение лабораторных  испытаний, измерений и других видов работ при проведении исследований солнечных элементов.<br/>
            3. Принятие участия в сборе и обработке материалов в процессе исследований в соответствии с утвержденной программой работы.<br/>
            4. Проведение выборки данных из литературных источников, реферативных и информационных изданий, нормативно-технической документации в соответствии с установленным заданием.<br/>
            5. Выполнение различных вычислительных и графических работ, связанные с проводимыми исследованиями и экспериментами.<br/>
            6. Принятие участия в составлении и оформлении технической документации по выполненным научным подразделением работам.<br/>
            7. Выполнение отдельных служебных поручений своего непосредственного руководителя
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
            <div className={styles.item}>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import styles from "./AboutTeacher.module.css";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import globals from "../../globals";
import { default as axios } from "axios";
import { Image } from "react-bootstrap";
import classnames from 'classnames';
import ApplicationModal from "../ApplicationModal/ApplicationModal";
import SuccessfullyModal from "../SuccessfullyModal/SuccessfullyModal";

export default function AboutTeacher(props) {
  const [showMainSpecificate, setShowMainSpecificate] = useState(false)
  const [showDiplomas, setShowDiplomas] = useState(false)
  const [showSkill, setShowSkill] = useState(false)
  const [showYourInteres, setShowYourInteres] = useState(false)
  const [showSend, setShowSend] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleShowSend = () => {
    setShowSend(false)
    setShowSuccess(true)
  };
  const handleShowSuccess = () => setShowSuccess(false);

  return (
    <div className={styles.container}>
      <SuccessfullyModal show={showSuccess} onClickNext={handleShowSuccess}/>
      <ApplicationModal showSend={showSend} handleShowSend={handleShowSend} />
      <div className={styles.mainInfo}>
        <h1>ПРЕПОДАВАТЕЛЬ КУРСА</h1>
        <div className={styles.previewBlock}>
          <div className={styles.logoBlock}>
            <Image src={'https://realibi.kz/file/177224.png'} className={styles.imgTeacher}/>
          </div>
          <div className={styles.infoBlock}>
            <h1>Крюков Андрей Константинович</h1>
            <p>
              Выпускник Самарского национального университета имени академика С.П. Королева (диплом магистра и бакалавра с отличием по направлению физика). Занимался исследованием в направлении квантовой оптики.
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
            {showMainSpecificate?'-':<Image src={'https://realibi.kz/file/148715.png'} className={styles.imgArrow}/>}
          </p>
        </div>
        <div className={showMainSpecificate?styles.showDetailInfoContain:styles.detailInfoContain}>
          <p>
            высшая математика, квантовая теория поля, линейная алгебра, квантовая физика, теория поля, общая физика
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
            {showDiplomas?'-':<Image src={'https://realibi.kz/file/148715.png'} className={styles.imgArrow}/>}
          </p>
        </div>
        <div className={showDiplomas?styles.showDetailInfoContain:styles.detailInfoContain}>
          <div className={styles.diplomaBlock}>
            <Image src={'https://realibi.kz/file/939886.png'} className={styles.imgArrow}/>
            <Image src={'https://realibi.kz/file/410531.png'} className={styles.imgArrow}/>
            <Image src={'https://realibi.kz/file/104843.png'} className={styles.imgArrow}/>
            <Image src={'https://realibi.kz/file/683692.png'} className={styles.imgArrow}/>
            <Image src={'https://realibi.kz/file/743376.png'} className={styles.imgArrow}/>
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
            {showSkill?'-':<Image src={'https://realibi.kz/file/148715.png'} className={styles.imgArrow}/>}
          </p>
        </div>
        <div className={showSkill?styles.showDetailInfoContain:styles.detailInfoContain}>
          <p>
            Работал в научной исследовательской части (НИЧ -90 и НИЧ-310), а также в научно-исследовательской лаборатории моделирования и обработки информации.<br/>
            Занимался аналитикой и разработкой научно-исследовательского оборудывания в том числе участвовал в разработке одного из модулей по исследованию клеток спинного мозга входящиго в состав спутника БИОН-М. В обязанности входило:<br/>
            1. Выполнение лабораторных анализов, испытаний, измерений и других видов работ.<br/>
            2. Принятие участия в сборе и обработке материалов в процессе исследований<br/>
            3. Слежение за исправным состоянием лабораторного оборудования его наладка<br/>
            4. Подготовка оборудования (приборы, аппаратуру) к проведению экспериментов<br/>
            5. Выполнение различных вычислительных и графических работ, связанные с проводимыми исследованиями и экспериментами.
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
            {showYourInteres?'-':<Image src={'https://realibi.kz/file/148715.png'} className={styles.imgArrow}/>}
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
                Уметь Применять формулы на практике
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
                Относится с интересом к математике
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
                По другому относится к миру цифр и формул
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

import ApplicationBlock from "../src/components/ApplicationBlock/ApplicationBlock";
import CoursePrice from "../src/components/CoursePrice/CoursePrice";
import Footer from "../src/components/Footer/Footer";
import Program from "../src/components/Program/Program";
import styles from "../styles/main.module.css";
import styles1 from "../src/components/AboutCourse/AboutCourse.module.css";
import styles2 from "../src/components/AboutTeacher/AboutTeacher.module.css";
import styles3 from "../src/components/Program/Program.module.css";
import styles4 from "../src/components/CoursePrice/CoursePrice.module.css";
import styles5 from "../src/components/ApplicationBlock/ApplicationBlock.module.css";
import Header from "../src/components/Header/Header";
import AboutCourse from "../src/components/AboutCourse/AboutCourse";
import AboutTeacher from "../src/components/AboutTeacher/AboutTeacher";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { default as axios } from "axios";
import globals from "../src/globals";
import { useRouter } from "next/router";
import { Image } from "react-bootstrap";
import Link from "next/link";
import dynamic from "next/dynamic";
import SuccessfullyModal from "../src/components/SuccessfullyModal/SuccessfullyModal";
import ApplicationModal from "../src/components/ApplicationModal/ApplicationModal";
import classnames from 'classnames';
import Backdrop from "../src/components/Backdrop/Backdrop";
import CaptchaComponent from "../src/components/Captcha/Captcha";


const Main = (props) => {
  const ym = () => {
    return (
      "<!-- Yandex.Metrika counter -->\n" +
      '<script type="text/javascript" >\n' +
      "   (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};\n" +
      "   m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})\n" +
      '   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");\n' +
      "\n" +
      '   ym(90703823, "init", {\n' +
      "        clickmap:true,\n" +
      "        trackLinks:true,\n" +
      "        accurateTrackBounce:true,\n" +
      "        webvisor:true,\n" +
      '        ecommerce:"dataLayer"\n' +
      "   });\n" +
      "</script>\n" +
      '<noscript><div><img src="https://mc.yandex.ru/watch/90703823" style="position:absolute; left:-9999px;" alt="" /></div></noscript>\n' +
      "<!-- /Yandex.Metrika counter -->"
    );
  };

  //about course
  const [showSend, setShowSend] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleShowSend = () => {
    setShowSend(false);
    setShowSuccess(true);
  };

  //about teacher
  const [showMainSpecificate, setShowMainSpecificate] = useState(false);
  const [showDiplomas, setShowDiplomas] = useState(false);
  const [showSkill, setShowSkill] = useState(false);
  const [showYourInteres, setShowYourInteres] = useState(false);
  const [allDiplomas, setAllDiplomas] = useState(false);

  const [certificates, setCertificates] = useState([
    "https://realibi.kz/file/939886.png",
    "https://realibi.kz/file/410531.png",
    "https://realibi.kz/file/104843.png",
    "https://realibi.kz/file/104843.png",
    "https://realibi.kz/file/743376.png",
  ]);

  const closeHandler = () => {
    setShowSend(false);
  };

  const handleShowSuccess = () => setShowSuccess(false);

  //program
  const [startShow, setStartShow] = useState(true);
  const [educationShow, setEducationShow] = useState(false);
  const [feedbackShow, setFeedbackShow] = useState(false);
  const [testShow, setTestShow] = useState(false);

  //course price

  //application block
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [insertCaptchaText, setInsertCaptchaText] = useState(
    "Введите текст с картинки"
  );
  const [captchaText, setCaptchaText] = useState("");
  const [connection, setConnection] = useState("");

  const [check, setCheck] = useState(false);

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [randomizedCaptchaId, setRandomizedCaptchaId] = useState();
  const [randomizedCaptchaData, setRandomizedCaptchaData] = useState();

  const [proccessOfCaptcha, setProccessOfCaptcha] = useState(0);
  const [proccessOfCaptchaUrl, setProccessOfCaptchaUrl] = useState(
    "https://realibi.kz/file/633881.png"
  );

  useEffect(() => {
    loadCaptcha();
  }, []);
  useEffect(() => {
    loadCaptchaWithId();
  }, [randomizedCaptchaId]);

  const loadCaptchaWithId = async () => {
    let data = randomizedCaptchaId;
    let captcha2 = await axios.post(
      `${globals.productionServerDomain}/getCaptchaWithId/` + data
    );
    console.log("captcha2", captcha2["data"]);
    setRandomizedCaptchaData(captcha2["data"]);
  };

  const firstStepValidation = () => {
    if (fullname.length < 3) {
      alert("Заполните все поля!");
      return false;
    } else if (phone.length < 16) {
      alert("Заполните все поля!");
      return false;
    } else {
      // setShowSend(true);
      return true;
    }
  };

  const [course, setCourse] = useState()
  const [teacherByCourse, setTeacherByCourse] = useState()
  const loadCaptcha = async () => {
    let getCourseOC = await axios.post(`${globals.productionServerDomain}/getCourseOC/` + "MathBySimpleWords")
    setCourse(getCourseOC['data'][0])
    let getTeacherByCourse = await axios.post(`${globals.productionServerDomain}/getTeacherByCourse/` + 1)
    setTeacherByCourse(getTeacherByCourse['data'][0])

    let captcha = await axios.get(
      `${globals.productionServerDomain}/getCaptcha/`
    );
    let getAllCaptchaId = await axios.get(
      `${globals.productionServerDomain}/getAllCaptchaId`
    );
    console.log("getAllCaptchaId", getAllCaptchaId["data"]);
    let getAllCaptchaIdRandom = Math.floor(
      Math.random() * getAllCaptchaId["data"].length
    );
    console.log("getAllCaptchaIdRandom", getAllCaptchaIdRandom);

    setRandomizedCaptchaId(getAllCaptchaIdRandom);
    // console.log('CAPTCHA', captcha)
    const captchaFin = captcha["data"][0];
    // console.log('CAPTCHA2', captchaFin)
  };

  const anotherImage = async () => {
    let getAllCaptchaId = await axios.get(
      `${globals.productionServerDomain}/getAllCaptchaId`
    );
    console.log("getAllCaptchaId", getAllCaptchaId["data"]);
    let getAllCaptchaIdRandom = Math.floor(
      Math.random() * getAllCaptchaId["data"].length
    );
    setRandomizedCaptchaId(getAllCaptchaIdRandom);
  };

  const sendApplication = async () => {
    let captcha = await axios.get(
      `${globals.productionServerDomain}/getCaptcha/`
    );
    const captchaFin = captcha["data"][0];
    loadCaptcha();
    console.log("CAPTCHI", captchaFin.text, captchaText);
    if (randomizedCaptchaData[0]?.text == captchaText) {
      handlerOfProccessOfCaptcha(3);
      setProccessOfCaptcha(3);
      setFullname("");
      setConnection("");
      setPhone("");
      setCheck(false);
      console.log("CAPTCHI", randomizedCaptchaData.text, captchaText);
      const ticketData = {
        fullname: fullname,
        phone: phone,
        course_id: 1,
        connection: "Звонок",
        courseName: "Математика простыми словами",
        teacherName: "Дарья Шишкина"
      };

      axios({
        method: "post",
        url: `${globals.productionServerDomain}/createTicket`,
        data: ticketData,
        headers: {
          Authorization: `Bearer ${globals.localStorageKeys.authToken}`,
        },
      })
        .then((res) => {})
        .catch(() => {
          alert("Что-то пошло не так!");
        });
      handleShowSend();
    } else {
      setInsertCaptchaText("Неверный ввод текста с картинки!");
      setProccessOfCaptcha(1);
      handlerOfProccessOfCaptcha(1);
    }
  };

  const onClickNext = () => {
    setShowSend(false);
    setFullname("");
    setEmail("");
    setPhone("");
    setCheck(false);
  };

  //желтый красный зеленый
  const handlerOfProccessOfCaptcha = (value) => {
    if (value === 0) {
      setProccessOfCaptchaUrl("https://realibi.kz/file/633881.png");
    } else if (value === 1) {
      setProccessOfCaptchaUrl("https://realibi.kz/file/499291.png");
    } else {
      setProccessOfCaptchaUrl("https://realibi.kz/file/98680.png");
    }
  };

  useEffect(() => {
    console.log("course teacherByCourse", course, teacherByCourse)
  }, [course, teacherByCourse])
  return (
    <div>
      <div className={styles.main}>
        <Header white={true} />
        <div className={styles1.container}>
          <SuccessfullyModal
            show={showSuccess}
            onClickNext={handleShowSuccess}
          />
          <ApplicationModal
            showSend={showSend}
            handleShowSend={handleShowSend}
            onClose={closeHandler}
            course={course}
            teacherByCourse={teacherByCourse}
          />
          <div className={styles1.mainInfo}>
            <div className={styles1.leftMainInfo}>
              <div className={styles1.flud}>
                <p>Oilan-classroom</p>
                <div className={styles1.imgBoom}></div>
              </div>
              <div className={styles1.courseTitle}>
                <h1>Математика простыми словами</h1>
              </div>
              <div className={styles1.courseDescription}>
                <p>
                  Курс предназначен для учащихся школ. На нем проходятся
                  основные темы из общего курса математики в школе. Благодаря
                  ему вы значительно повысите свои знания по предмету и сможете
                  легко и быстро решать задачи из тестов для поступления в НИШ и
                  сдачи ЕНТ.
                </p>
              </div>
              <div className={styles1.buttonBlock}>
                <button
                  className={styles1.courseButton}
                  onClick={() => setShowSend(true)}
                >
                  Записаться на курс
                </button>
              </div>
            </div>
            <div className={styles1.rightMainInfo}>
              <Image
                src={"https://realibi.kz/file/596699.png"}
                className={styles1.imgArrow}
              />
              <Image
                src={"https://realibi.kz/file/978476.png"}
                className={styles1.imgGlobe}
              />
              <Image
                src={"https://realibi.kz/file/274985.png"}
                className={styles1.imgGirls}
              />
            </div>
          </div>
          <div className={styles1.targetPersons}>
            <h1>КОМУ ПОДОЙДЕТ КУРС</h1>
            <div className={styles1.items}>
              <div className={styles1.item}>
                <Image
                  src={"https://realibi.kz/file/243934.png"}
                  className={styles1.imgEvaluation}
                />
                <p className={styles1.targetTitle}>
                  Школьникам с низкой успеваемостью
                </p>
                <p className={styles1.targetDescr}>
                  За 2 месяца занятий гарантируем заметный рост в успеваемости
                  по предмету
                </p>
              </div>
              <div className={styles1.item}>
                <Image
                  src={"https://realibi.kz/file/410726.png"}
                  className={styles1.imgMedal}
                />
                <p className={styles1.targetTitle}>Поступающим в НИШ</p>
                <p className={styles1.targetDescr}>
                  Готовим ребенка к поступлению в НИШ
                </p>
              </div>
              <div className={styles1.item}>
                <Image
                  src={"https://realibi.kz/file/915691.png"}
                  className={styles1.imgDiploma}
                />
                <p className={styles1.targetTitle} id="about">
                  Сдающим ЕНТ
                </p>
                <p className={styles1.targetDescr}>
                  Готовим ребенка к сдаче ЕНТ
                </p>
              </div>
            </div>
          </div>
          <div className={styles1.courseSquares}>
            <h1>О КУРСЕ</h1>
            <div className={styles1.squares}>
              <div className={styles1.leftSquare}>
                <p className={styles1.squareTitle}>Онлайн Обучение 😎</p>
                <p className={styles1.squareText}>
                  Обучение проходит онлайн в удобное для вас время
                </p>
              </div>
              <div className={styles1.rightSquare}>
                <p className={styles1.squareTitle}>
                  Индивидуальная программа 😄
                </p>
                <p className={styles1.squareText}>
                  Программа формируется на основе первого общения с учеником.{" "}
                  <br />
                  Также индивидуально выстраивается расписание занятий
                </p>
              </div>
              <div className={styles1.leftSquare}>
                <p className={styles1.squareTitle}>50 000 тенге 👌</p>
                <p className={styles1.squareText}>
                  В стоимость входит 4 недели индивидуальной работы с учеником
                  по 2 занятия в неделю
                </p>
              </div>
              <div className={styles1.rightSquare}>
                <p className={styles1.squareTitle}>
                  Бонусная система обучения 🔥
                </p>
                <p className={styles1.squareText}>
                  При положительных оценках вы получаете грант на следующую
                  покупку:
                  <br />
                  от 80 до 100 баллов - грант 10%
                  <br />
                  от 60 до 80 баллов - грант 7%
                  <br />
                  от 40 до 60 баллов - грант 5%
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles2.container}>
          {/* <SuccessfullyModal
            show={showSuccess}
            onClickNext={handleShowSuccess}
          />
          <ApplicationModal
            showSend={showSend}
            handleShowSend={handleShowSend}
            onClose={closeHandler}
            course={course}
            teacherByCourse={teacherByCourse}
          /> */}
          <div className={styles2.mainInfo}>
            <h1>ПРЕПОДАВАТЕЛЬ КУРСА</h1>
            <div className={styles2.previewBlock}>
              <div className={styles2.logoBlock}>
                <Image
                  src={"https://realibi.kz/file/436573.png"}
                  className={styles2.imgTeacher}
                />
              </div>
              <div className={styles2.infoBlock}>
                <h2>Преподаватель курса</h2>
                <h3>Дарья Шишкина</h3>
                <p>
                  Выпускник Самарского национального университета имени
                  академика С.П. Королева (диплом специалиста по направлению
                  физика, диплом аспиранта по профилю физика и астрономия).
                  Занимаюсь исследованиями в направлении фотовольтаики,
                  наномедицины.
                  <br />
                  Основные навыки: высшая математика, линейная алгебра, общая
                  физика, школьная физика и математика 5-11 классы.
                </p>
                <button
                  className={styles2.courseButton}
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
          <div className={styles2.detailInfo}>
            <div className={styles2.detailInfoHeader}>
              <p>Оcновные навыки</p>
              <p
                onClick={() => setShowMainSpecificate(!showMainSpecificate)}
                className={styles2.showButton}
              >
                {showMainSpecificate ? (
                  <Image
                    src={"https://realibi.kz/file/904733.png"}
                    className={styles2.imgArrow}
                  />
                ) : (
                  <Image
                    src={"https://realibi.kz/file/148715.png"}
                    className={styles2.imgArrow}
                  />
                )}
              </p>
            </div>
            <div
              className={
                showMainSpecificate
                  ? styles2.showDetailInfoContain
                  : styles2.detailInfoContain
              }
            >
              <p>
                Высшая математика, квантовая теория поля, линейная алгебра,
                квантовая физика, теория поля, общая физика
              </p>
            </div>
          </div>
          <div className={styles2.detailInfo}>
            <div className={styles2.detailInfoHeader}>
              <p>Дипломы и сертификаты</p>
              <p
                onClick={() => setShowDiplomas(!showDiplomas)}
                className={styles2.showButton}
              >
                {showDiplomas ? (
                  <Image
                    src={"https://realibi.kz/file/904733.png"}
                    className={styles2.imgArrow}
                  />
                ) : (
                  <Image
                    src={"https://realibi.kz/file/148715.png"}
                    className={styles2.imgArrow}
                  />
                )}
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
          <div className={styles2.detailInfo}>
            <div className={styles2.detailInfoHeader}>
              <p>Опыт работы</p>
              <p
                onClick={() => setShowSkill(!showSkill)}
                className={styles2.showButton}
              >
                {showSkill ? (
                  <Image
                    src={"https://realibi.kz/file/904733.png"}
                    className={styles2.imgArrow}
                  />
                ) : (
                  <Image
                    src={"https://realibi.kz/file/148715.png"}
                    className={styles2.imgArrow}
                  />
                )}
              </p>
            </div>
            <div
              className={
                showSkill
                  ? styles2.showDetailInfoContain
                  : styles2.detailInfoContain
              }
            >
              <p>
                Доцент кафедры наноинженерии Самарского университета, преподаю
                дисциплины, связанные с моделированием микроструктур,
                специальными дисциплинами (физика конденсированного состояния,
                физика поверхности, дополнительные главы физики, теоретические
                основы интегральной оптики, технологии дифракционной
                микрооптики), также работаю в научном образовательном центре
                нанотехнологии (НОЦ НТ - 94).
                <br />
                Ранее принимала участие в работах гранта РФФИ НОМЕР ПРОЕКТА
                16-48-630688 НАЗВАНИЕ ПРОЕКТА Исследование физических процессов
                в многослойных фоточувствительных кремниевых структурах с
                наноразмерными элементами Начало 2016г., окончание 2017г.
                (исполнитель)
                <br />
                1. Изготовление фоточувствительных структур с пористым кремнием
                (изготовление наноструктур, профедение диффузии, нанесение
                контактов, оптических покрытий)
                <br />
                2. Выполнение лабораторных испытаний, измерений и других видов
                работ при проведении исследований солнечных элементов.
                <br />
                3. Принятие участия в сборе и обработке материалов в процессе
                исследований в соответствии с утвержденной программой работы.
                <br />
                4. Проведение выборки данных из литературных источников,
                реферативных и информационных изданий, нормативно-технической
                документации в соответствии с установленным заданием.
                <br />
                5. Выполнение различных вычислительных и графических работ,
                связанные с проводимыми исследованиями и экспериментами.
                <br />
                6. Принятие участия в составлении и оформлении технической
                документации по выполненным научным подразделением работам.
                <br />
                7. Выполнение отдельных служебных поручений своего
                непосредственного руководителя
              </p>
            </div>
          </div>
          <div className={styles2.detailInfo}>
            <div className={styles2.detailInfoHeader}>
              <p>Чему вы научитесь на курсе</p>
              <p
                onClick={() => setShowYourInteres(!showYourInteres)}
                className={styles2.showButton}
              >
                {showYourInteres ? (
                  <Image
                    src={"https://realibi.kz/file/904733.png"}
                    className={styles2.imgArrow}
                  />
                ) : (
                  <Image
                    src={"https://realibi.kz/file/148715.png"}
                    className={styles.imgArrow}
                  />
                )}
              </p>
            </div>
            <div
              className={
                showYourInteres
                  ? styles2.showDetailInfoContain
                  : styles2.detailInfoContain
              }
            >
              <div className={styles2.items}>
                <div className={styles2.item}>
                  <Image
                    src={"https://realibi.kz/file/316032.png"}
                    className={styles2.imgArrow}
                  />
                  <p>Знать основные математические формулы</p>
                </div>
                <div className={styles2.item}>
                  <Image
                    src={"https://realibi.kz/file/423807.png"}
                    className={styles2.imgArrow}
                  />
                  <p>Уметь применять формулы на практике</p>
                </div>
                <div className={styles2.item}>
                  <Image
                    src={"https://realibi.kz/file/115526.png"}
                    className={styles2.imgArrow}
                  />
                  <p>Уметь находить самые простые решения задач</p>
                </div>
                <div className={styles2.item}>
                  <Image
                    src={"https://realibi.kz/file/685686.png"}
                    className={styles2.imgArrow}
                  />
                  <p>Относиться с интересом к математике</p>
                </div>
                <div className={styles2.item}>
                  <Image
                    src={"https://realibi.kz/file/796133.png"}
                    className={styles2.imgArrow}
                  />
                  <p>Быть одним из лучших учеников в классе</p>
                </div>
                <div className={styles2.item}>
                  <Image
                    src={"https://realibi.kz/file/877284.png"}
                    className={styles2.imgArrow}
                  />
                  <p>Быстро выполнять домашние задания</p>
                </div>
                <div className={styles2.item}>
                  <Image
                    src={"https://realibi.kz/file/596856.png"}
                    className={styles2.imgArrow}
                  />
                  <p>По другому относиться к миру цифр и формул</p>
                </div>
                <div className={styles2.item}>
                  <Image
                    src={"https://realibi.kz/file/522405.png"}
                    className={styles2.imgArrow}
                  />
                  <p>Не отвлекать родителей на решение домашних работ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles3.container} id="program">
          <div className={styles3.program_block_container}>
            <div className={styles3.program_block}>
              <div className={styles3.program_title}>
                <img src="https://realibi.kz/file/453815.png" />
                <h2>Программа курса</h2>
                <img src="https://realibi.kz/file/730116.png" />
              </div>
              <span>
                Программа разрабатывается индивидуально для вас по результатам
                пробного занятия. На связи с вами будет преподаватель для
                проверки задания и передачи обратной связи
              </span>
            </div>
          </div>

          <div className={styles3.stage_block_container}>
            <h2>Этапы обучения на курсе</h2>
            <div className={styles3.stages}>
              <div className={classnames(styles3.stage, styles3.start_block)}>
                <span
                  onMouseEnter={() => setStartShow(true)}
                  onMouseLeave={() => setStartShow(false)}
                >
                  1
                </span>
                <div
                  style={{ display: startShow ? "flex" : "none" }}
                  className={classnames(styles3.stage_info, styles3.start)}
                >
                  <h3>Старт</h3>
                  <p>
                    Вы знакомитесь с преподавателем и составляете программу
                    обучения
                  </p>
                </div>
              </div>
              <div className={styles3.stage}>
                <span
                  onMouseEnter={() => setEducationShow(true)}
                  onMouseLeave={() => setEducationShow(false)}
                >
                  2
                </span>
                <div
                  style={{ display: educationShow ? "flex" : "none" }}
                  className={classnames(styles3.stage_info, styles3.education)}
                >
                  <h3>Обучение</h3>
                  <p>
                    Обучение. Вы присутствуете на онлайн лекциях, изучаете
                    материал и выполняете индивидуальные задания
                  </p>
                </div>
              </div>
              <div className={styles3.stage}>
                <span
                  onMouseEnter={() => setFeedbackShow(true)}
                  onMouseLeave={() => setFeedbackShow(false)}
                >
                  3
                </span>
                <div
                  style={{ display: feedbackShow ? "flex" : "none" }}
                  className={classnames(styles3.stage_info, styles3.feedback)}
                >
                  <h3>Обратная связь</h3>
                  <p>Выполняете задания и получаете обратную связь по ним</p>
                </div>
              </div>
              <div className={styles3.stage}>
                <span
                  onMouseEnter={() => setTestShow(true)}
                  onMouseLeave={() => setTestShow(false)}
                >
                  4
                </span>
                <div
                  style={{ display: testShow ? "flex" : "none" }}
                  className={classnames(styles3.stage_info, styles3.test)}
                >
                  <h3>Тестирование и оценка</h3>
                  <p>
                    По результатам месяца проводится итоговый тест на основе
                    которого замеряется прогресс обучающегося во время всего
                    курса.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles4.container}>
          {/* <SuccessfullyModal
            show={showSuccess}
            onClickNext={handleShowSuccess}
          />
          <ApplicationModal
            showSend={showSend}
            handleShowSend={handleShowSend}
            onClose={closeHandler}
            course={course}
            teacherByCourse={teacherByCourse}
          /> */}
          <h2>Стоимость обучения на курсе</h2>

          <div className={styles4.price_content}>
            <span
              className={styles4.buy}
              onClick={() => setShowSend(true)}
            ></span>
            <span className={styles4.possibility}>
              * Мы предоставляем возможность оплаты курса еженедельно
            </span>
            <div className={styles4.price_info}>
              <div className={classnames(styles4.price_info_item, styles4.full)}>
                <span>50 000 ₸</span>
                <p>За полный курс</p>
              </div>
              <div className={classnames(styles4.price_info_item, styles4.start)}>
                <span>дата начала</span>
                <p>24.10.2022</p>
              </div>
              <div className={classnames(styles4.price_info_item, styles4.part)}>
                <span>13 000 ₸</span>
                <p>*При оплате частями.</p>
                <p>Оплата совершается раз в неделю</p>
              </div>
              <div
                className={classnames(styles4.price_info_item, styles4.finish)}
              >
                <span>Дата окончания</span>
                <p>24.11.2022</p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles5.container}>
          {/* <SuccessfullyModal
            show={showSend}
            onClickNext={onClickNext}
            handleShow={handleShowSend}
          />
          <Backdrop show={showSend} /> */}
          <h1>Запишитесь на курс сейчас</h1>
          <span className={styles5.subtitle}>
            И мы свяжемся с вами для записи на пробный урок
          </span>
          <form className={styles5.form_container}>
            <label className={styles5.input_container}>
              Ваше Имя
              <input
                placeholder="Ваше Имя"
                name="fullname"
                value={fullname}
                onChange={(e) => {
                  if (phone.length > 10 && fullname.length > 3 && email.length > 6) {
                    setShowCaptcha(true)
                  }
                  setFullname(e.target.value)
                }}
              />
            </label>
            <label className={styles5.input_container}>
              Ваш E-mail
              <input
                placeholder="Ваш E-mail"
                name="email"
                value={email}
                onChange={(e) => {
                  if (phone.length > 10 && fullname.length > 3 && email.length > 6) {
                    setShowCaptcha(true)
                  }
                  setEmail(e.target.value)
                }}
              />
            </label>
            <label className={styles5.input_container}>
              Ваш Телефон
              <input
                placeholder="Ваш Телефон"
                name="phone"
                value={phone}
                onKeyDown={(e) => {
                  if (e.keyCode === 8) {
                    setPhone(phone.slice(0, -1));
                  }
                }}
                onChange={(e) => {
                  if (phone.length > 10 && fullname.length > 3  && email.length > 6) {
                    setShowCaptcha(true)
                  }
                  globals.checkPhoneMask(e.target.value, setPhone);
                }}
              />
            </label>
            <CaptchaComponent
              insertCaptchaText={insertCaptchaText}
              setCaptchaText={setCaptchaText}
              sendApplication={sendApplication}
              setFullname={setFullname}
              setConnection={setConnection}
              setPhone={setPhone}
              setCheck={setCheck}
              showCaptcha={showCaptcha}
              captchaImage={randomizedCaptchaData?.[0]?.link}
              anotherImage={anotherImage}
              proccessOfCaptchaUrl={proccessOfCaptchaUrl}
              proccessOfCaptcha={proccessOfCaptcha}
            />
            <button
              className={styles5.button_animate}
              onClick={(e) => {
                e.preventDefault();
                if (check === false) {
                  alert("Прочтите публичную оферту и дайте свое согласие!");
                } else {
                  if (firstStepValidation()) {
                    // sendApplication();
                    // setShowCaptcha(true);
                  } else {
                    alert("Заполните пожалуйста все поля.");
                  }
                }
              }}
            >
              Записаться на курс
            </button>
            <span
              className={styles5.check}
              style={{maxWidth: "375px"}}
              // className={check ? styles5.check_on : styles5.check_off}
              // onClick={() => setCheck(!check)}
            >
              Нажимая на кнопку "Записаться на курс", Вы принимаете <Link href="/offer"><a>условия публичной оферты</a></Link>
            </span>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Main;

import styles from "./AdminBlocks.module.css";
import React, { useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import globals from "../../globals";

const axios = require("axios").default;

export default function AdminBlocks(props) {
  const [showCreateTeacher, setShowCreateTeacher] = useState(false)
  const [showCreateCourse, setShowCreateCourse] = useState(false)
  const [showCreateCourseTarget, setShowCreateCourseTarget] = useState(false)
  const [showCreateCourseInfoBlock, setShowCreateCourseInfoBlock] = useState(false)
  const [showCreateCourseSkill, setShowCreateCourseSkill] = useState(false)
  const [showCreateCourseStage, setShowCreateCourseStage] = useState(false)
  const [showCreateLesson, setShowCreateLesson] = useState(false)
  const [showCreateExercise, setShowCreateExercise] = useState(false)
  const [showCreateSertificate, setShowCreateSertificate] = useState(false)
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [showCreateStudent, setShowCreateStudent] = useState(false)
  const [showCreateCategory, setShowCreateCategory] = useState(false)
  const [showCreateSCM, setShowCreateSCM] = useState(false)
  const [showCreateProgram, setShowCreateProgram] = useState(false)
 
  const [surname, setSurname] = useState("");
  const [name, setName] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [url, setUrl] = useState("");
  const [avatar, setAvatar] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fullPrice, setFullPrice] = useState(0);
  const [monthlyPrice, setMonthlyPrice] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [program, setProgram] = useState("");
  const [courseUrl, setCourseUrl] = useState("");
  const [translationLink, setTranslationLink] = useState("");
  const [teacherId, setTeacherId] = useState(0);
  const [courseCategory, setCourseCategory] = useState(0);

  const [targetTitle, setTargetTitle] = useState("");
  const [targetImg, setTargetImg] = useState("");
  const [targetText, setTargetText] = useState("");
  const [targetCourseId, setTargetCourseId] = useState(0);

  const [infoBlockTitle, setInfoBlockTitle] = useState("");
  const [infoBlockText, setInfoBlockText] = useState("");
  const [infoBlockOrder, setInfoBlockOrder] = useState(0);
  const [infoBlockCourseId, setInfoBlockCourseId] = useState(0);

  const [sertificateTitle, setSertificateTitle] = useState("");
  const [sertificateImg, setSertificateImg] = useState("");
  const [sertificateTeacherId, setSertificateTeacherId] = useState(0);

  const [skillImg, setSkillImg] = useState("");
  const [skillText, setSkillText] = useState("");
  const [skillCourseId, setSkillCourseId] = useState(0);

  const [stageTitle, setStageTitle] = useState("")
  const [stageText, setStageText] = useState("");
  const [stageOrder, setStageOrder] = useState(0);
  const [stageCourseId, setStageCourseId] = useState(0);

  const [nick, setNick] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState(0);
  const [personId, setPersonId] = useState(0);

  const [studentSurname, setStudentSurname] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentPatronymic, setStudentPatronymic] = useState("");
  const [nickname, setNickname] = useState("");

  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonOrder, setLessonOrder] = useState(0);
  const [lessonCourseId, setLessonCourseId] = useState(0);
  const [lessonTesis, setLessonTesis] = useState("");
  const [lessonStartTime, setLessonStartTime] = useState("");
  const [lessonProgramId, setLessonProgramId] = useState(0);

  const [exerciseText, setExerciseText] = useState("");
  const [exerciseLessonId, setExerciseLessonId] = useState(0);
  const [correctlyAnswer, setCorrectlyAnswer] = useState("");
  const [exerciseCourseId, setExerciseCourseId] = useState(0);
  const [exerciseProgramId, setExerciseProgramId] = useState(0);

  const [categoryName, setCategoryName] = useState("");
  const [categoryUrl, setCategoryUrl] = useState("");

  const [SCMStudentId, setSCMStudentId] = useState(0);
  const [SCMCourseId, setSCMCourseId] = useState(0);
  const [SCMProgramId, setSCMProgramId] = useState(0);

  const [teachers, setTeachers] = useState([])
  const [categories, setCategories] = useState([])
  const [courses, setCourses] = useState([])
  const [programs, setPrograms] = useState([])
  const [lessons, setLessons] = useState([])
  const [students, setStudents] = useState([])
  const [roles, setRoles] = useState([])

  const [programTitle, setProgramTitle] = useState("");
  const [programCourseId, setProgramCourseId] = useState(0);
  const [programTeacherId, setProgramTeacherId] = useState(0);

  const getTeachers = async () => {
    let result = await axios.get(`${globals.productionServerDomain}/getTeachers`)
      setTeachers(result.data);
      console.log(teachers)
  }

  const getCategories = async () => {
    let result = await axios.get(`${globals.productionServerDomain}/getCategories`)
      setCategories(result.data);
      console.log(categories)
  }

  const getCourses = async () => {
    let result = await axios.get(`${globals.productionServerDomain}/getCourses`)
      setCourses(result.data);
      console.log(courses)
  }

  const getPrograms = async () => {
    let result = await axios.get(`${globals.productionServerDomain}/getPrograms`)
      setPrograms(result.data);
      console.log(programs)
  }

  const getLessons = async () => {
    let result = await axios.get(`${globals.productionServerDomain}/getLessons`)
      setLessons(result.data);
      console.log(lessons)
  }

  const getStudents = async () => {
    let result = await axios.get(`${globals.productionServerDomain}/getStudents`)
      setStudents(result.data);
      console.log(students)
  }

  const getRoles = async () => {
    let result = await axios.get(`${globals.productionServerDomain}/getRoles`)
      setRoles(result.data);
      console.log(roles)
  }

  useEffect(() => {
    getTeachers()
    getCategories()
    getCourses()
    getPrograms()
    getLessons()
    getStudents()
    getRoles()
  },[])

  const createTeacher = async () => {
    const data = {
      surname,
      name,
      patronymic,
      skills,
      experience,
      url,
      avatar,
    };

    await axios({
      method: "post",
      url: `${globals.productionServerDomain}/createTeacher`,
      data: data,
    })
      .then(function (res) {
        alert("Преподаватель успешно создан");
      })
      .catch((err) => {
        alert("Произошла ошибка");
      });
  };

  const createCourse = async () => {
    const data = {
      title,
      description,
      fullPrice,
      monthlyPrice,
      startDate,
      endDate,
      program,
      courseUrl,
      translationLink,
      teacherId,
      courseCategory,
    };

    await axios({
      method: "post",
      url: `${globals.productionServerDomain}/createCourse`,
      data: data,
    })
      .then(function (res) {
        alert("Курс успешно создан");
      })
      .catch((err) => {
        alert("Произошла ошибка");
      });
  };

  const createCourseTarget = async () => {
    const data = {
      targetTitle,
      targetImg,
      targetText,
      targetCourseId,
    };

    await axios({
      method: "post",
      url: `${globals.productionServerDomain}/createCourseTarget`,
      data: data,
    })
      .then(function (res) {
        alert("Блок успешно создан");
      })
      .catch((err) => {
        alert("Произошла ошибка");
      });
  };

  const createCourseInfoBlock = async () => {
    const data = {
      infoBlockTitle,
      infoBlockText,
      infoBlockOrder,
      infoBlockCourseId,
    };

    await axios({
      method: "post",
      url: `${globals.productionServerDomain}/createCourseInfoBlock`,
      data: data,
    })
      .then(function (res) {
        alert("Блок успешно создан");
      })
      .catch((err) => {
        alert("Произошла ошибка");
      });
  };

  const createSertificate = async () => {
    const data = {
      sertificateTitle,
      sertificateImg,
      sertificateTeacherId,
    };

    await axios({
      method: "post",
      url: `${globals.productionServerDomain}/createSertificate`,
      data: data,
    })
      .then(function (res) {
        alert("Сертификат успешно создан");
      })
      .catch((err) => {
        alert("Произошла ошибка");
      });
  };

  const createCourseSkill = async () => {
    const data = {
      skillImg,
      skillText,
      skillCourseId,
    };

    await axios({
      method: "post",
      url: `${globals.productionServerDomain}/createCourseSkill`,
      data: data,
    })
      .then(function (res) {
        alert("Блок успешно создан");
      })
      .catch((err) => {
        alert("Произошла ошибка");
      });
  };

  const createCourseStage = async () => {
    const data = {
      stageTitle,
      stageText,
      stageOrder,
      stageCourseId,
    };

    await axios({
      method: "post",
      url: `${globals.productionServerDomain}/createCourseStage`,
      data: data,
    })
      .then(function (res) {
        alert("Этап успешно создан");
      })
      .catch((err) => {
        alert("Произошла ошибка");
      });
  };

  const createUser = async () => {
    const data = {
      nick,
      password,
      roleId,
      personId,
    };

    await axios({
      method: "post",
      url: `${globals.productionServerDomain}/createUser`,
      data: data,
    })
      .then(function (res) {
        alert("Личный кабинет успешно создан");
      })
      .catch((err) => {
        alert("Произошла ошибка");
      });
  };

  const createStudent = async () => {
    const data = {
      studentSurname,
      studentName,
      studentPatronymic,
      nickname,
    };

    await axios({
      method: "post",
      url: `${globals.productionServerDomain}/createStudent`,
      data: data,
    })
      .then(function (res) {
        alert("Студент успешно создан");
      })
      .catch((err) => {
        alert("Произошла ошибка");
      });
  };

  const createLesson = async () => {
    const data = {
      lessonTitle,
      lessonOrder,
      lessonCourseId,
      lessonTesis,
      lessonStartTime,
      lessonProgramId,
    };

    await axios({
      method: "post",
      url: `${globals.productionServerDomain}/createLesson`,
      data: data,
    })
      .then(function (res) {
        alert("Урок успешно создан");
      })
      .catch((err) => {
        alert("Произошла ошибка");
      });
  };

  const createExercise = async () => {
    const data = {
      exerciseText,
      exerciseLessonId,
      correctlyAnswer,
    };

    await axios({
      method: "post",
      url: `${globals.productionServerDomain}/createExercise`,
      data: data,
    })
      .then(function (res) {
        alert("Задание успешно создано");
      })
      .catch((err) => {
        alert("Произошла ошибка");
      });
  };

  const createCategory = async () => {
    const data = {
      categoryName,
      categoryUrl,
    };

    await axios({
      method: "post",
      url: `${globals.productionServerDomain}/createCategory`,
      data: data,
    })
      .then(function (res) {
        alert("Категория успешно создана");
      })
      .catch((err) => {
        alert("Произошла ошибка");
      });
  };

  const createSCM = async () => {
    const data = {
      SCMStudentId,
      SCMCourseId,
      SCMProgramId,
    };

    await axios({
      method: "post",
      url: `${globals.productionServerDomain}/createSCM`,
      data: data,
    })
      .then(function (res) {
        alert("Связь успешно назначена");
      })
      .catch((err) => {
        alert("Произошла ошибка");
      });
  };

  const createProgram = async () => {
    const data = {
      programTitle,
      programCourseId,
      programTeacherId,
    };

    await axios({
      method: "post",
      url: `${globals.productionServerDomain}/createProgram`,
      data: data,
    })
      .then(function (res) {
        alert("Программа успешно создана");
      })
      .catch((err) => {
        alert("Произошла ошибка");
      });
  };

  return (
    <div className={styles.container}>

      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>Создать преподавателя</p>
          <p 
            onClick={() => setShowCreateTeacher(!showCreateTeacher)}
            className={styles.showButton}
          >
            {showCreateTeacher?<Image src={'https://realibi.kz/file/904733.png'} className={styles.imgArrow}/>:<Image src={'https://realibi.kz/file/148715.png'} className={styles.imgArrow}/>}
          </p>
        </div>
        <div className={showCreateTeacher?styles.showDetailInfoContain:styles.detailInfoContain}>
          <div className={styles.dataBlock}>
            <div className={styles.formBlock}>
              Фамилия: <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              /><br/>
              Имя: <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              /><br/>
              Отчество: <input
                type="text"
                value={patronymic}
                onChange={(e) => setPatronymic(e.target.value)}
              /><br/>
              Навыки: <textarea
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}></textarea><br/>
              Опыт работы: <textarea
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}></textarea><br/>
              URL: <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              /><br/>
              Фото: <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
              /><br/>
              <button onClick={() => {createTeacher()}}>Создать</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>Создать курс</p>
          <p 
            onClick={() => setShowCreateCourse(!showCreateCourse)}
            className={styles.showButton}
          >
            {showCreateCourse?<Image src={'https://realibi.kz/file/904733.png'} className={styles.imgArrow}/>:<Image src={'https://realibi.kz/file/148715.png'} className={styles.imgArrow}/>}
          </p>
        </div>
        <div className={showCreateCourse?styles.showDetailInfoContain:styles.detailInfoContain}>
          <div className={styles.dataBlock}>
            <div className={styles.formBlock}>
              Название курса: <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              /><br/>
              Описание курса: <textarea
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}></textarea><br/>
              Стоимость курса: <input
                type="number"
                value={fullPrice}
                onChange={(e) => setFullPrice(e.target.value)}
              /><br/>
              Стоимость одного месяца: <input
                type="number"
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(e.target.value)}
              /><br/>
              Дата начала: <input 
                type="date"
                // value="2022-10-20"
                min="2022-01-01" 
                max="2025-12-31"
                onChange={(e) => setStartDate(e.target.value)}
              /><br/>
              Дата окончания: <input 
                type="date"
                // value="2022-10-20"
                min="2022-01-01" 
                max="2025-12-31"
                onChange={(e) => setEndDate(e.target.value)}
              /><br/>
              Программа: <textarea
                type="text"
                value={program}
                onChange={(e) => setProgram(e.target.value)}></textarea><br/>
              URL: <input
                type="text"
                value={courseUrl}
                onChange={(e) => setCourseUrl(e.target.value)}
              /><br/>
              Ссылка на трансляцию: <input
                type="text"
                value={translationLink}
                onChange={(e) => setTranslationLink(e.target.value)}
              /><br/>
              Преподаватель: <select
                onChange={(e) => setTeacherId(e.target.value)}
                value={teacherId}>
                  <option value="0" disabled>Выберите преподавателя</option>
                  {teachers.map(teacher => (
                    <option value={teacher.id}>{teacher.surname} {teacher.name} {teacher.patronymic}</option>
                    ))}
                </select><br/>
              Направление: <select
                onChange={(e) => setCourseCategory(e.target.value)}
                value={courseCategory}>
                  <option value="0" disabled>Выберите направление</option>
                  {categories.map(category => (
                    <option value={category.id}>{category.name}</option>
                    ))}
                </select><br/>
              <button onClick={() => {createCourse()}}>Создать</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>Создать блок "Кому подойдёт этот курс"</p>
          <p 
            onClick={() => setShowCreateCourseTarget(!showCreateCourseTarget)}
            className={styles.showButton}
          >
            {showCreateCourseTarget?<Image src={'https://realibi.kz/file/904733.png'} className={styles.imgArrow}/>:<Image src={'https://realibi.kz/file/148715.png'} className={styles.imgArrow}/>}
          </p>
        </div>
        <div className={showCreateCourseTarget?styles.showDetailInfoContain:styles.detailInfoContain}>
          <div className={styles.dataBlock}>
            <div className={styles.formBlock}>   
              Заголовок блока: <input
                    type="text"
                    value={targetTitle}
                    onChange={(e) => setTargetTitle(e.target.value)}
                  /><br/>
              Ссылка на изображение блока: <input
                    type="text"
                    value={targetImg}
                    onChange={(e) => setTargetImg(e.target.value)}
                  /><br/>
              Содержание блока: <textarea
                    type="text"
                    value={targetText}
                    onChange={(e) => setTargetText(e.target.value)}></textarea><br/>
              Курс: <select
                    onChange={(e) => setTargetCourseId(e.target.value)}
                    value={targetCourseId}>
                      <option value="0" disabled>Выберите курс</option>
                      {courses.map(course => (
                        <option value={course.id}>{course.title} ({course.url})</option>
                        ))}
                    </select><br/>
              <button onClick={() => {createCourseTarget()}}>Создать</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>Создать блок информации о курсе</p>
          <p 
            onClick={() => setShowCreateCourseInfoBlock(!showCreateCourseInfoBlock)}
            className={styles.showButton}
          >
            {showCreateCourseInfoBlock?<Image src={'https://realibi.kz/file/904733.png'} className={styles.imgArrow}/>:<Image src={'https://realibi.kz/file/148715.png'} className={styles.imgArrow}/>}
          </p>
        </div>
        <div className={showCreateCourseInfoBlock?styles.showDetailInfoContain:styles.detailInfoContain}>
          <div className={styles.dataBlock}>
            <div className={styles.formBlock}>
              Заголовок блока: <input
                    type="text"
                    value={infoBlockTitle}
                    onChange={(e) => setInfoBlockTitle(e.target.value)}
                  /><br/>
              Содержание блока: <textarea
                    type="text"
                    value={infoBlockText}
                    onChange={(e) => setInfoBlockText(e.target.value)}></textarea><br/>
              Номер блока: <input
                    type="number"
                    value={infoBlockOrder}
                    onChange={(e) => setInfoBlockOrder(e.target.value)}
                  /><br/>
              Курс: <select
                    onChange={(e) => setInfoBlockCourseId(e.target.value)}
                    value={infoBlockCourseId}>
                      <option value="0" disabled>Выберите курс</option>
                      {courses.map(course => (
                        <option value={course.id}>{course.title} ({course.url})</option>
                        ))}
                    </select><br/>
              <button onClick={() => {createCourseInfoBlock()}}>Создать</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>Создать блок "Чему вы научитесь на курсе"</p>
          <p 
            onClick={() => setShowCreateCourseSkill(!showCreateCourseSkill)}
            className={styles.showButton}
          >
            {showCreateCourseSkill?<Image src={'https://realibi.kz/file/904733.png'} className={styles.imgArrow}/>:<Image src={'https://realibi.kz/file/148715.png'} className={styles.imgArrow}/>}
          </p>
        </div>
        <div className={showCreateCourseSkill?styles.showDetailInfoContain:styles.detailInfoContain}>
          <div className={styles.dataBlock}>
            <div className={styles.formBlock}>
              Ссылка на изображение блока: <input
                    type="text"
                    value={skillImg}
                    onChange={(e) => setSkillImg(e.target.value)}
                  /><br/>
              Содержание блока: <textarea
                    type="text"
                    value={skillText}
                    onChange={(e) => setSkillText(e.target.value)}></textarea><br/>
              Курс: <select
                    onChange={(e) => setSkillCourseId(e.target.value)}
                    value={skillCourseId}>
                      <option value="0" disabled>Выберите курс</option>
                      {courses.map(course => (
                        <option value={course.id}>{course.title} ({course.url})</option>
                        ))}
                    </select><br/>
              <button onClick={() => {createCourseSkill()}}>Создать</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>Создать этап обучения</p>
          <p 
            onClick={() => setShowCreateCourseStage(!showCreateCourseStage)}
            className={styles.showButton}
          >
            {showCreateCourseStage?<Image src={'https://realibi.kz/file/904733.png'} className={styles.imgArrow}/>:<Image src={'https://realibi.kz/file/148715.png'} className={styles.imgArrow}/>}
          </p>
        </div>
        <div className={showCreateCourseStage?styles.showDetailInfoContain:styles.detailInfoContain}>
          <div className={styles.dataBlock}>
            <div className={styles.formBlock}>
              Заголовок этапа: <input
                    type="text"
                    value={stageTitle}
                    onChange={(e) => setStageTitle(e.target.value)}
                  /><br/>
              Содержание этапа: <textarea
                    type="text"
                    value={stageText}
                    onChange={(e) => setStageText(e.target.value)}></textarea><br/>
              Номер этапа: <input
                    type="text"
                    value={stageOrder}
                    onChange={(e) => setStageOrder(e.target.value)}
                  /><br/>
              Курс: <select
                    onChange={(e) => setStageCourseId(e.target.value)}
                    value={stageCourseId}>
                      <option value="0" disabled>Выберите курс</option>
                      {courses.map(course => (
                        <option value={course.id}>{course.title} ({course.url})</option>
                        ))}
                    </select><br/>
              <button onClick={() => {createCourseStage()}}>Создать</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>Создать урок</p>
          <p 
            onClick={() => setShowCreateLesson(!showCreateLesson)}
            className={styles.showButton}
          >
            {showCreateLesson?<Image src={'https://realibi.kz/file/904733.png'} className={styles.imgArrow}/>:<Image src={'https://realibi.kz/file/148715.png'} className={styles.imgArrow}/>}
          </p>
        </div>
        <div className={showCreateLesson?styles.showDetailInfoContain:styles.detailInfoContain}>
          <div className={styles.dataBlock}>
            <div className={styles.formBlock}>
              Название урока: <input
                    type="text"
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                  /><br/>
              Номер урока: <input
                    type="text"
                    value={lessonOrder}
                    onChange={(e) => setLessonOrder(e.target.value)}
                  /><br/>
              Курс: <select
                    onChange={(e) => {
                      setLessonCourseId(e.target.value)
                      setLessonProgramId(0)
                      }
                    }
                    value={lessonCourseId}>
                      <option value="0" disabled>Выберите курс</option>
                      {courses.map(course => (
                        <option value={course.id}>{course.title} ({course.url})</option>
                        ))}
                    </select><br/>
              Программа: <select
                    onChange={(e) => setLessonProgramId(e.target.value)}
                    value={lessonProgramId}>
                      <option value="0" disabled>Выберите программу</option>
                      {programs.map(program => program.course_id == lessonCourseId?(
                        <option value={program.id}>{program.title}</option>
                          ):(<></>)
                        )}
                    </select><br/>
              Содержание урока: <textarea
                    type="text"
                    value={lessonTesis}
                    onChange={(e) => setLessonTesis(e.target.value)}></textarea><br/>
              Дата начала: <input 
                    type="date"
                    value="2022-10-20"
                    min="2022-01-01" 
                    max="2025-12-31"
                    onChange={(e) => setLessonStartTime(e.target.value)}
                  /><br/>
              <button onClick={() => {createLesson()}}>Создать</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>Создать задание</p>
          <p 
            onClick={() => setShowCreateExercise(!showCreateExercise)}
            className={styles.showButton}
          >
            {showCreateExercise?<Image src={'https://realibi.kz/file/904733.png'} className={styles.imgArrow}/>:<Image src={'https://realibi.kz/file/148715.png'} className={styles.imgArrow}/>}
          </p>
        </div>
        <div className={showCreateExercise?styles.showDetailInfoContain:styles.detailInfoContain}>
          <div className={styles.dataBlock}>
            <div className={styles.formBlock}>
              Курс: <select
                    onChange={(e) => {
                      setExerciseCourseId(e.target.value)
                      setExerciseProgramId(0)
                      setExerciseLessonId(0)
                      }
                    }
                    value={exerciseCourseId}>
                      <option value="0" disabled>Выберите курс</option>
                      {courses.map(course => (
                        <option value={course.id}>{course.title} ({course.url})</option>
                        ))}
                    </select><br/>
              Программа: <select
                    onChange={(e) => {
                      setExerciseProgramId(e.target.value)
                      setExerciseLessonId(0)
                      }
                    }
                    value={exerciseProgramId}>
                      <option value="0" disabled>Выберите программу</option>
                      {programs.map(program => program.course_id == exerciseCourseId?(
                        <option value={program.id}>{program.title}</option>
                          ):(<></>)
                        )}
                    </select><br/>
              Урок: <select
                    onChange={(e) => setExerciseLessonId(e.target.value)}
                    value={exerciseLessonId}>
                      <option value="0" disabled>Выберите урок</option>
                      {lessons.map(lesson => lesson.program_id == exerciseProgramId?(
                        <option value={lesson.id}>{lesson.title}</option>
                          ):(<></>)
                        )}
                    </select><br/>
              Текст задания: <textarea
                    type="text"
                    value={exerciseText}
                    onChange={(e) => setExerciseText(e.target.value)}></textarea><br/>
              Правильный ответ: <input
                    type="text"
                    value={correctlyAnswer}
                    onChange={(e) => setCorrectlyAnswer(e.target.value)}
                  /><br/>
              <button onClick={() => {createExercise()}}>Создать</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>Создать сертификат</p>
          <p 
            onClick={() => setShowCreateSertificate(!showCreateSertificate)}
            className={styles.showButton}
          >
            {showCreateSertificate?<Image src={'https://realibi.kz/file/904733.png'} className={styles.imgArrow}/>:<Image src={'https://realibi.kz/file/148715.png'} className={styles.imgArrow}/>}
          </p>
        </div>
        <div className={showCreateSertificate?styles.showDetailInfoContain:styles.detailInfoContain}>
          <div className={styles.dataBlock}>
            <div className={styles.formBlock}>
              Название сертификата: <input
                    type="text"
                    value={sertificateTitle}
                    onChange={(e) => setSertificateTitle(e.target.value)}
                  /><br/>
              Ссылка на сертификат: <input
                    type="text"
                    value={sertificateImg}
                    onChange={(e) => setSertificateImg(e.target.value)}
                  /><br/>
              Преподаватель: <select
                onChange={(e) => setSertificateTeacherId(e.target.value)}
                value={sertificateTeacherId}>
                  <option value="0" disabled>Выберите преподавателя</option>
                  {teachers.map(teacher => (
                    <option value={teacher.id}>{teacher.surname} {teacher.name} {teacher.patronymic}</option>
                    ))}
                </select><br/>
              <button onClick={() => {createSertificate()}}>Создать</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>Создать личный кабинет</p>
          <p 
            onClick={() => setShowCreateUser(!showCreateUser)}
            className={styles.showButton}
          >
            {showCreateUser?<Image src={'https://realibi.kz/file/904733.png'} className={styles.imgArrow}/>:<Image src={'https://realibi.kz/file/148715.png'} className={styles.imgArrow}/>}
          </p>
        </div>
        <div className={showCreateUser?styles.showDetailInfoContain:styles.detailInfoContain}>
          <div className={styles.dataBlock}>
            <div className={styles.formBlock}>
              Логин: <input
                    type="text"
                    value={nick}
                    onChange={(e) => setNick(e.target.value)}
                  /><br/>
              Пароль: <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  /><br/>
              Роль: <select
                onChange={(e) => setRoleId(e.target.value)}
                value={roleId}>
                  <option value="0" disabled>Выберите роль</option>
                  {roles.map(role => role.id !== 1?(
                    <option value={role.id}>{role.name}</option>
                    ):(<></>))}
                </select><br/>
              Пользователь: <select
                onChange={(e) => setPersonId(e.target.value)}
                value={personId}>
                  <option value="0" disabled>Выберите пользователя</option>
                  {(roleId == 2)?teachers.map(teacher => (
                    <option value={teacher.id}>{teacher.surname} {teacher.name} {teacher.patronymic}</option>
                    )):
                    (roleId == 3)?students.map(student => (
                    <option value={student.id}>{student.surname} {student.name} {student.patronymic}</option>
                    )):(<></>)}
                </select><br/>
              <button onClick={() => {createUser()}}>Создать</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>Создать студента</p>
          <p 
            onClick={() => setShowCreateStudent(!showCreateStudent)}
            className={styles.showButton}
          >
            {showCreateStudent?<Image src={'https://realibi.kz/file/904733.png'} className={styles.imgArrow}/>:<Image src={'https://realibi.kz/file/148715.png'} className={styles.imgArrow}/>}
          </p>
        </div>
        <div className={showCreateStudent?styles.showDetailInfoContain:styles.detailInfoContain}>
          <div className={styles.dataBlock}>
            <div className={styles.formBlock}>
              Фамилия: <input
                    type="text"
                    value={studentSurname}
                    onChange={(e) => setStudentSurname(e.target.value)}
                  /><br/>
              Имя: <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  /><br/>
              Отчество: <input
                    type="text"
                    value={studentPatronymic}
                    onChange={(e) => setStudentPatronymic(e.target.value)}
                  /><br/>
              Никнейм: <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  /><br/>
              <button onClick={() => {createStudent()}}>Создать</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>Создать категорию</p>
          <p 
            onClick={() => setShowCreateCategory(!showCreateCategory)}
            className={styles.showButton}
          >
            {showCreateCategory?<Image src={'https://realibi.kz/file/904733.png'} className={styles.imgArrow}/>:<Image src={'https://realibi.kz/file/148715.png'} className={styles.imgArrow}/>}
          </p>
        </div>
        <div className={showCreateCategory?styles.showDetailInfoContain:styles.detailInfoContain}>
          <div className={styles.dataBlock}>
            <div className={styles.formBlock}>
              Название категории: <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  /><br/>
              URL категории: <input
                    type="text"
                    value={categoryUrl}
                    onChange={(e) => setCategoryUrl(e.target.value)}
                  /><br/>
              <button onClick={() => {createCategory()}}>Создать</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>Назначить студента на курс</p>
          <p 
            onClick={() => setShowCreateSCM(!showCreateSCM)}
            className={styles.showButton}
          >
            {showCreateSCM?<Image src={'https://realibi.kz/file/904733.png'} className={styles.imgArrow}/>:<Image src={'https://realibi.kz/file/148715.png'} className={styles.imgArrow}/>}
          </p>
        </div>
        <div className={showCreateSCM?styles.showDetailInfoContain:styles.detailInfoContain}>
          <div className={styles.dataBlock}>
            <div className={styles.formBlock}>
              Студент: <select
                    onChange={(e) => setSCMStudentId(e.target.value)}
                    value={SCMStudentId}>
                      <option value="0" disabled>Выберите студента</option>
                      {students.map(student => (
                      <option value={student.id}>{student.surname} {student.name} {student.patronymic}</option>
                        ))}
                    </select><br/>
              Курс: <select
                    onChange={(e) => {
                      setSCMCourseId(e.target.value)
                      setSCMProgramId(0)
                      }
                    }
                    value={SCMCourseId}>
                      <option value="0" disabled>Выберите курс</option>
                      {courses.map(course => (
                        <option value={course.id}>{course.title} ({course.url})</option>
                        ))}
                    </select><br/>
              Программа: <select
                    onChange={(e) => setSCMProgramId(e.target.value)}
                    value={SCMProgramId}>
                      <option value="0" disabled>Выберите программу</option>
                      {programs.map(program => program.course_id == SCMCourseId?(
                        <option value={program.id}>{program.title}</option>
                          ):(<></>)
                        )}
                    </select><br/>
              <button onClick={() => {createSCM()}}>Назначить</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>Создать программу</p>
          <p 
            onClick={() => setShowCreateProgram(!showCreateProgram)}
            className={styles.showButton}
          >
            {showCreateProgram?<Image src={'https://realibi.kz/file/904733.png'} className={styles.imgArrow}/>:<Image src={'https://realibi.kz/file/148715.png'} className={styles.imgArrow}/>}
          </p>
        </div>
        <div className={showCreateProgram?styles.showDetailInfoContain:styles.detailInfoContain}>
          <div className={styles.dataBlock}>
            <div className={styles.formBlock}>
              Название программы: <input
                    type="text"
                    value={programTitle}
                    onChange={(e) => setProgramTitle(e.target.value)}
                  /><br/>
              Курс: <select
                    onChange={(e) => setProgramCourseId(e.target.value)}
                    value={programCourseId}>
                      <option value="0" disabled>Выберите курс</option>
                      {courses.map(course => (
                        <option value={course.id}>{course.title} ({course.url})</option>
                        ))}
                    </select><br/>
              Преподаватель: <select
                    onChange={(e) => setProgramTeacherId(e.target.value)}
                    value={programTeacherId}>
                      <option value="0" disabled>Выберите преподавателя</option>
                      {teachers.map(teacher => (
                        <option value={teacher.id}>{teacher.surname} {teacher.name} {teacher.patronymic}</option>
                        ))}
                    </select><br/>
              <button onClick={() => {createProgram()}}>Создать</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

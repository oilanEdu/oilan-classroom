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
  const [teacherDescription, setTeacherDescription] = useState("");

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
  const status = "not verified"

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
      teacherDescription
    };

    await axios({
      method: "post",
      url: `${globals.productionServerDomain}/createTeacher`,
      data: data,
    })
      .then(function (res) {
        alert("?????????????????????????? ?????????????? ????????????");
      })
      .catch((err) => {
        alert("?????????????????? ????????????");
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
        alert("???????? ?????????????? ????????????");
      })
      .catch((err) => {
        alert("?????????????????? ????????????");
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
        alert("???????? ?????????????? ????????????");
      })
      .catch((err) => {
        alert("?????????????????? ????????????");
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
        alert("???????? ?????????????? ????????????");
      })
      .catch((err) => {
        alert("?????????????????? ????????????");
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
        alert("???????????????????? ?????????????? ????????????");
      })
      .catch((err) => {
        alert("?????????????????? ????????????");
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
        alert("???????? ?????????????? ????????????");
      })
      .catch((err) => {
        alert("?????????????????? ????????????");
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
        alert("???????? ?????????????? ????????????");
      })
      .catch((err) => {
        alert("?????????????????? ????????????");
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
        alert("???????????? ?????????????? ?????????????? ????????????");
      })
      .catch((err) => {
        alert("?????????????????? ????????????");
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
        alert("?????????????? ?????????????? ????????????");
      })
      .catch((err) => {
        alert("?????????????????? ????????????");
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
        alert("???????? ?????????????? ????????????");
      })
      .catch((err) => {
        alert("?????????????????? ????????????");
      });
  };

  const createExercise = async () => {
    const data = {
      exerciseText,
      exerciseLessonId,
      correctlyAnswer,
      status
    };

    await axios({
      method: "post",
      url: `${globals.productionServerDomain}/createExercise`,
      data: data,
    })
      .then(function (res) {
        alert("?????????????? ?????????????? ??????????????");
      })
      .catch((err) => {
        alert("?????????????????? ????????????");
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
        alert("?????????????????? ?????????????? ??????????????");
      })
      .catch((err) => {
        alert("?????????????????? ????????????");
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
        alert("?????????? ?????????????? ??????????????????");
      })
      .catch((err) => {
        alert("?????????????????? ????????????");
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
        alert("?????????????????? ?????????????? ??????????????");
      })
      .catch((err) => {
        alert("?????????????????? ????????????");
      });
  };

  return (
    <div className={styles.container}>

      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>?????????????? ??????????????????????????</p>
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
              ??????????????: <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              /><br/>
              ??????: <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              /><br/>
              ????????????????: <input
                type="text"
                value={patronymic}
                onChange={(e) => setPatronymic(e.target.value)}
              /><br/>
              ????????????: <textarea
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}></textarea><br/>
              ???????? ????????????: <textarea
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}></textarea><br/>
              URL: <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              /><br/>
              ????????: <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
              /><br/>
              ????????????????: <input
                type="text"
                value={teacherDescription}
                onChange={(e) => setTeacherDescription(e.target.value)}
              /><br/>
              <button onClick={() => {createTeacher()}}>??????????????</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>?????????????? ????????</p>
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
              ???????????????? ??????????: <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              /><br/>
              ???????????????? ??????????: <textarea
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}></textarea><br/>
              ?????????????????? ??????????: <input
                type="number"
                value={fullPrice}
                onChange={(e) => setFullPrice(e.target.value)}
              /><br/>
              ?????????????????? ???????????? ????????????: <input
                type="number"
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(e.target.value)}
              /><br/>
              ???????? ????????????: <input 
                type="date"
                // value="2022-10-20"
                min="2022-01-01" 
                max="2025-12-31"
                onChange={(e) => setStartDate(e.target.value)}
              /><br/>
              ???????? ??????????????????: <input 
                type="date"
                // value="2022-10-20"
                min="2022-01-01" 
                max="2025-12-31"
                onChange={(e) => setEndDate(e.target.value)}
              /><br/>
              ??????????????????: <textarea
                type="text"
                value={program}
                onChange={(e) => setProgram(e.target.value)}></textarea><br/>
              URL: <input
                type="text"
                value={courseUrl}
                onChange={(e) => setCourseUrl(e.target.value)}
              /><br/>
              ???????????? ???? ????????????????????: <input
                type="text"
                value={translationLink}
                onChange={(e) => setTranslationLink(e.target.value)}
              /><br/>
              ??????????????????????????: <select
                onChange={(e) => setTeacherId(e.target.value)}
                value={teacherId}>
                  <option value="0" disabled>???????????????? ??????????????????????????</option>
                  {teachers.map(teacher => (
                    <option value={teacher.id}>{teacher.surname} {teacher.name} {teacher.patronymic}</option>
                    ))}
                </select><br/>
              ??????????????????????: <select
                onChange={(e) => setCourseCategory(e.target.value)}
                value={courseCategory}>
                  <option value="0" disabled>???????????????? ??????????????????????</option>
                  {categories.map(category => (
                    <option value={category.id}>{category.name}</option>
                    ))}
                </select><br/>
              <button onClick={() => {createCourse()}}>??????????????</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>?????????????? ???????? "???????? ???????????????? ???????? ????????"</p>
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
              ?????????????????? ??????????: <input
                    type="text"
                    value={targetTitle}
                    onChange={(e) => setTargetTitle(e.target.value)}
                  /><br/>
              ???????????? ???? ?????????????????????? ??????????: <input
                    type="text"
                    value={targetImg}
                    onChange={(e) => setTargetImg(e.target.value)}
                  /><br/>
              ???????????????????? ??????????: <textarea
                    type="text"
                    value={targetText}
                    onChange={(e) => setTargetText(e.target.value)}></textarea><br/>
              ????????: <select
                    onChange={(e) => setTargetCourseId(e.target.value)}
                    value={targetCourseId}>
                      <option value="0" disabled>???????????????? ????????</option>
                      {courses.map(course => (
                        <option value={course.id}>{course.title} ({course.url})</option>
                        ))}
                    </select><br/>
              <button onClick={() => {createCourseTarget()}}>??????????????</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>?????????????? ???????? ???????????????????? ?? ??????????</p>
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
              ?????????????????? ??????????: <input
                    type="text"
                    value={infoBlockTitle}
                    onChange={(e) => setInfoBlockTitle(e.target.value)}
                  /><br/>
              ???????????????????? ??????????: <textarea
                    type="text"
                    value={infoBlockText}
                    onChange={(e) => setInfoBlockText(e.target.value)}></textarea><br/>
              ?????????? ??????????: <input
                    type="number"
                    value={infoBlockOrder}
                    onChange={(e) => setInfoBlockOrder(e.target.value)}
                  /><br/>
              ????????: <select
                    onChange={(e) => setInfoBlockCourseId(e.target.value)}
                    value={infoBlockCourseId}>
                      <option value="0" disabled>???????????????? ????????</option>
                      {courses.map(course => (
                        <option value={course.id}>{course.title} ({course.url})</option>
                        ))}
                    </select><br/>
              <button onClick={() => {createCourseInfoBlock()}}>??????????????</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>?????????????? ???????? "???????? ???? ?????????????????? ???? ??????????"</p>
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
              ???????????? ???? ?????????????????????? ??????????: <input
                    type="text"
                    value={skillImg}
                    onChange={(e) => setSkillImg(e.target.value)}
                  /><br/>
              ???????????????????? ??????????: <textarea
                    type="text"
                    value={skillText}
                    onChange={(e) => setSkillText(e.target.value)}></textarea><br/>
              ????????: <select
                    onChange={(e) => setSkillCourseId(e.target.value)}
                    value={skillCourseId}>
                      <option value="0" disabled>???????????????? ????????</option>
                      {courses.map(course => (
                        <option value={course.id}>{course.title} ({course.url})</option>
                        ))}
                    </select><br/>
              <button onClick={() => {createCourseSkill()}}>??????????????</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>?????????????? ???????? ????????????????</p>
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
              ?????????????????? ??????????: <input
                    type="text"
                    value={stageTitle}
                    onChange={(e) => setStageTitle(e.target.value)}
                  /><br/>
              ???????????????????? ??????????: <textarea
                    type="text"
                    value={stageText}
                    onChange={(e) => setStageText(e.target.value)}></textarea><br/>
              ?????????? ??????????: <input
                    type="text"
                    value={stageOrder}
                    onChange={(e) => setStageOrder(e.target.value)}
                  /><br/>
              ????????: <select
                    onChange={(e) => setStageCourseId(e.target.value)}
                    value={stageCourseId}>
                      <option value="0" disabled>???????????????? ????????</option>
                      {courses.map(course => (
                        <option value={course.id}>{course.title} ({course.url})</option>
                        ))}
                    </select><br/>
              <button onClick={() => {createCourseStage()}}>??????????????</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>?????????????? ????????</p>
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
              ???????????????? ??????????: <input
                    type="text"
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                  /><br/>
              ?????????? ??????????: <input
                    type="text"
                    value={lessonOrder}
                    onChange={(e) => setLessonOrder(e.target.value)}
                  /><br/>
              ????????: <select
                    onChange={(e) => {
                      setLessonCourseId(e.target.value)
                      setLessonProgramId(0)
                      }
                    }
                    value={lessonCourseId}>
                      <option value="0" disabled>???????????????? ????????</option>
                      {courses.map(course => (
                        <option value={course.id}>{course.title} ({course.url})</option>
                        ))}
                    </select><br/>
              ??????????????????: <select
                    onChange={(e) => setLessonProgramId(e.target.value)}
                    value={lessonProgramId}>
                      <option value="0" disabled>???????????????? ??????????????????</option>
                      {programs.map(program => program.course_id == lessonCourseId?(
                        <option value={program.id}>{program.title}</option>
                          ):(<></>)
                        )}
                    </select><br/>
              ???????????????????? ??????????: <textarea
                    type="text"
                    value={lessonTesis}
                    onChange={(e) => setLessonTesis(e.target.value)}></textarea><br/>
              ???????? ????????????: <input 
                    type="date"
                    value="2022-10-20"
                    min="2022-01-01" 
                    max="2025-12-31"
                    onChange={(e) => setLessonStartTime(e.target.value)}
                  /><br/>
              <button onClick={() => {createLesson()}}>??????????????</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>?????????????? ??????????????</p>
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
              ????????: <select
                    onChange={(e) => {
                      setExerciseCourseId(e.target.value)
                      setExerciseProgramId(0)
                      setExerciseLessonId(0)
                      }
                    }
                    value={exerciseCourseId}>
                      <option value="0" disabled>???????????????? ????????</option>
                      {courses.map(course => (
                        <option value={course.id}>{course.title} ({course.url})</option>
                        ))}
                    </select><br/>
              ??????????????????: <select
                    onChange={(e) => {
                      setExerciseProgramId(e.target.value)
                      setExerciseLessonId(0)
                      }
                    }
                    value={exerciseProgramId}>
                      <option value="0" disabled>???????????????? ??????????????????</option>
                      {programs.map(program => program.course_id == exerciseCourseId?(
                        <option value={program.id}>{program.title}</option>
                          ):(<></>)
                        )}
                    </select><br/>
              ????????: <select
                    onChange={(e) => setExerciseLessonId(e.target.value)}
                    value={exerciseLessonId}>
                      <option value="0" disabled>???????????????? ????????</option>
                      {lessons.map(lesson => lesson.program_id == exerciseProgramId?(
                        <option value={lesson.id}>{lesson.title}</option>
                          ):(<></>)
                        )}
                    </select><br/>
              ?????????? ??????????????: <textarea
                    type="text"
                    value={exerciseText}
                    onChange={(e) => setExerciseText(e.target.value)}></textarea><br/>
              ???????????????????? ??????????: <input
                    type="text"
                    value={correctlyAnswer}
                    onChange={(e) => setCorrectlyAnswer(e.target.value)}
                  /><br/>
              <button onClick={() => {createExercise()}}>??????????????</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>?????????????? ????????????????????</p>
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
              ???????????????? ??????????????????????: <input
                    type="text"
                    value={sertificateTitle}
                    onChange={(e) => setSertificateTitle(e.target.value)}
                  /><br/>
              ???????????? ???? ????????????????????: <input
                    type="text"
                    value={sertificateImg}
                    onChange={(e) => setSertificateImg(e.target.value)}
                  /><br/>
              ??????????????????????????: <select
                onChange={(e) => setSertificateTeacherId(e.target.value)}
                value={sertificateTeacherId}>
                  <option value="0" disabled>???????????????? ??????????????????????????</option>
                  {teachers.map(teacher => (
                    <option value={teacher.id}>{teacher.surname} {teacher.name} {teacher.patronymic}</option>
                    ))}
                </select><br/>
              <button onClick={() => {createSertificate()}}>??????????????</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>?????????????? ???????????? ??????????????</p>
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
              ??????????: <input
                    type="text"
                    value={nick}
                    onChange={(e) => setNick(e.target.value)}
                  /><br/>
              ????????????: <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  /><br/>
              ????????: <select
                onChange={(e) => setRoleId(e.target.value)}
                value={roleId}>
                  <option value="0" disabled>???????????????? ????????</option>
                  {roles.map(role => role.id !== 1?(
                    <option value={role.id}>{role.name}</option>
                    ):(<></>))}
                </select><br/>
              ????????????????????????: <select
                onChange={(e) => setPersonId(e.target.value)}
                value={personId}>
                  <option value="0" disabled>???????????????? ????????????????????????</option>
                  {(roleId == 2)?teachers.map(teacher => (
                    <option value={teacher.id}>{teacher.surname} {teacher.name} {teacher.patronymic}</option>
                    )):
                    (roleId == 3)?students.map(student => (
                    <option value={student.id}>{student.surname} {student.name} {student.patronymic}</option>
                    )):(<></>)}
                </select><br/>
              <button onClick={() => {createUser()}}>??????????????</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>?????????????? ????????????????</p>
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
              ??????????????: <input
                    type="text"
                    value={studentSurname}
                    onChange={(e) => setStudentSurname(e.target.value)}
                  /><br/>
              ??????: <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  /><br/>
              ????????????????: <input
                    type="text"
                    value={studentPatronymic}
                    onChange={(e) => setStudentPatronymic(e.target.value)}
                  /><br/>
              ??????????????: <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  /><br/>
              <button onClick={() => {createStudent()}}>??????????????</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>?????????????? ??????????????????</p>
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
              ???????????????? ??????????????????: <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  /><br/>
              URL ??????????????????: <input
                    type="text"
                    value={categoryUrl}
                    onChange={(e) => setCategoryUrl(e.target.value)}
                  /><br/>
              <button onClick={() => {createCategory()}}>??????????????</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>?????????????????? ???????????????? ???? ????????</p>
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
              ??????????????: <select
                    onChange={(e) => setSCMStudentId(e.target.value)}
                    value={SCMStudentId}>
                      <option value="0" disabled>???????????????? ????????????????</option>
                      {students.map(student => (
                      <option value={student.id}>{student.surname} {student.name} {student.patronymic}</option>
                        ))}
                    </select><br/>
              ????????: <select
                    onChange={(e) => {
                      setSCMCourseId(e.target.value)
                      setSCMProgramId(0)
                      }
                    }
                    value={SCMCourseId}>
                      <option value="0" disabled>???????????????? ????????</option>
                      {courses.map(course => (
                        <option value={course.id}>{course.title} ({course.url})</option>
                        ))}
                    </select><br/>
              ??????????????????: <select
                    onChange={(e) => setSCMProgramId(e.target.value)}
                    value={SCMProgramId}>
                      <option value="0" disabled>???????????????? ??????????????????</option>
                      {programs.map(program => program.course_id == SCMCourseId?(
                        <option value={program.id}>{program.title}</option>
                          ):(<></>)
                        )}
                    </select><br/>
              <button onClick={() => {createSCM()}}>??????????????????</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>?????????????? ??????????????????</p>
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
              ???????????????? ??????????????????: <input
                    type="text"
                    value={programTitle}
                    onChange={(e) => setProgramTitle(e.target.value)}
                  /><br/>
              ????????: <select
                    onChange={(e) => setProgramCourseId(e.target.value)}
                    value={programCourseId}>
                      <option value="0" disabled>???????????????? ????????</option>
                      {courses.map(course => (
                        <option value={course.id}>{course.title} ({course.url})</option>
                        ))}
                    </select><br/>
              ??????????????????????????: <select
                    onChange={(e) => setProgramTeacherId(e.target.value)}
                    value={programTeacherId}>
                      <option value="0" disabled>???????????????? ??????????????????????????</option>
                      {teachers.map(teacher => (
                        <option value={teacher.id}>{teacher.surname} {teacher.name} {teacher.patronymic}</option>
                        ))}
                    </select><br/>
              <button onClick={() => {createProgram()}}>??????????????</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

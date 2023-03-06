import styles from "./NewStudent.module.css";
import React, { useState, useEffect } from "react";
import globals from "../../globals";
import CopyLink from "../CopyLink/CopyLink";
import { useClipboard } from 'use-clipboard-copy';
const generator = require('generate-password');

const axios = require("axios").default;

export default function NewStudent({ show, setShow, programs } ) {
  const [showCreateStudent, setShowCreateStudent] = useState(false)
  const clipboard = useClipboard();

  const [studentSurname, setStudentSurname] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentPatronymic, setStudentPatronymic] = useState("");
  const [nickname, setNickname] = useState("");

  const [teachers, setTeachers] = useState([])
  const [categories, setCategories] = useState([])
  const [courses, setCourses] = useState([])
  const [programsAll, setProgramsAll] = useState([])
  const [lessons, setLessons] = useState([])
  const [students, setStudents] = useState([])
  const [roles, setRoles] = useState([])
  const [lessonProgramId, setLessonProgramId] = useState(0);
  const [courseId, setCourseId] = useState()

  const [courseUrl, setCourseUrl] = useState("");
  const [showLogData, setShowLogData] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [succesMessage, setSuccesMessage] = useState("");

  const [showGenetarePass, setShowGeneratePass] = useState(false);
  const [generatePass, setGeneratePass] = useState("");

  const generatePassHandler = (e) => {
    e.preventDefault()
    setShowGeneratePass(true);
    setGeneratePass(generator.generate({
      length: 12,
	    numbers: true,
      symbols: true,
    }))
  }

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
      setProgramsAll(result.data);
      console.log(programsAll)
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

  const createStudentAndProgram = async () => {
    let result = await axios.post(`${globals.productionServerDomain}/getCourseByProgramId`, { programId: lessonProgramId });
    console.log('result', result.data.url)
    let courseURL = result.data.url
    setCourseUrl(result.data.url);
    const data = {
      studentSurname,
      studentName,
      studentPatronymic,
      nickname,
      programId: lessonProgramId
    };

    const dataAddProgram = {
      nickname,
      programId: lessonProgramId
    };

    console.log(data);

    if (studentSurname !== "" && studentName !== "" && nickname !== "" && lessonProgramId !== 0) {

      await axios({
        method: "post",
        url: `${globals.productionServerDomain}/createStudentAndProgram`,
        data: data,
      })
        .then(function (res) {
          console.log(res);
          setSuccesMessage("Учетная запись студента успешно создана!");
          setErrorMessage("");
        })
        .catch((err) => {
          console.log(err);
          setErrorMessage(err.response.data)
        });
    } else if (studentSurname === "" && studentName === "" && nickname !== "" && lessonProgramId !== 0) {
      await axios({
        method: "post",
        url: `${globals.productionServerDomain}/addStudentProgram`,
        data: dataAddProgram,
      })
        .then(function (res) {
          console.log(res);
          setSuccesMessage("Студент успешно добавлен в программу!");
          setErrorMessage("");
        })
        .catch((err) => {
          console.log(err);
          setErrorMessage(err.response.data)
        });
    } else {
      setErrorMessage("Заполните поля, обязательные для заполнения")
    }
  };
  console.log(courseId);

  return (
    <>
      <div 
        className={styles.modal}
        style={{
          transform: `translate(${show ? "-50%, -50%" : "-50%, -100%"})`,
          top: show ? "50%" : "0%",
          opacity: show ? 1 : 0
        }}
      >
        <div className={styles.detailInfo}>
          <p 
            className={styles.close}
            onClick={() => setShow(!show)}
          >
            X
          </p>
          <div className={styles.showDetailInfoContain}>
            <div className={styles.detailInfoHeader}>
              <p>Создать студента</p>
              <span>Если студент <span style={{color: "#212AFB"}}>уже проходил обучение на платформе</span> на другом курсе, регистрация не требуется - чтобы добавить его на курс, достаточно его личного логина</span>
            </div>
            <div className={styles.dataBlock}>
              <div className={styles.formBlock}>
                <div className={styles.input_container}>
                  <input
                    className={styles.input_block}
                    type="text"
                    placeholder="Имя"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />
                  <span>*</span>
                </div>
                <div className={styles.input_container}>
                  <input
                    className={styles.input_block}
                    type="text"
                    placeholder="Отчество"
                    value={studentPatronymic}
                    onChange={(e) => setStudentPatronymic(e.target.value)}
                  />
                </div> 
                <div className={styles.input_container}>
                  <input
                    className={styles.input_block}
                    type="text"
                    value={studentSurname}
                    placeholder="Фамилия"
                    onChange={(e) => setStudentSurname(e.target.value)}
                  />
                  <span>*</span>
                </div> 
                <div className={styles.url_input}>
                  <div className={styles.pass_data} style={{display: showLogData ? "block" : "none"}}>
                    <p className={styles.pass_data_head}>Для защиты данных наши условия для логина </p>
                    <p className={styles.pass_data_head}>Он должен содержать:</p>
                    <p className={styles.pass_data_text}>8 и более символов</p>
                    <p className={styles.pass_data_text}>латинские буквы</p>
                    <p className={styles.pass_data_text}>цифры</p>
                    <p className={styles.pass_data_text}>знаки пунктуации (!”$%/:’@[]^_)</p>
                    {/* <button 
                      onClick={(e) => generatePassHandler(e)}
                      className={styles.generate_pass}
                    >
                      Сгенерировать логин
                    </button>
                    <div className={styles.generate_pass_text} style={{display: showGenetarePass ? "block" : "none"}}>
                    {generatePass}
                      <input className={styles.url_input} ref={clipboard.target} value={generatePass} readOnly />
                      <span 
                        className={styles.generate_pass_copy} 
                        onClick={clipboard.copy}
                      ></span>
                    </div> */}
                    <div className={styles.pass_data_left}></div>
                  </div>
                  <div className={styles.input_container}>
                    <input
                      className={styles.input_block}
                      type="text"
                      placeholder="Логин для входа в систему"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                    />
                    <span>*</span>
                  </div> 
                  <span onClick={() => setShowLogData(!showLogData)} className={styles.login_cr}></span>
                </div>
                <div className={styles.form_input}>
                    <button 
                      onClick={(e) => generatePassHandler(e)}
                      className={styles.generate_pass}
                    >
                      Сгенерировать логин
                    </button>
                    <div className={styles.generate_pass_text} style={{display: showGenetarePass ? "block" : "none"}}>
                      {generatePass}
                      <input className={styles.copy_input} ref={clipboard.target} value={generatePass} readOnly />
                      <span 
                        className={styles.generate_pass_copy} 
                        onClick={clipboard.copy}
                      ></span>
                    </div>
                  </div>
                <div className={styles.input_container}>
                  <select
                    className={styles.input_block}
                    onChange={(e) => {
                      setLessonProgramId(e.target.value)
                      console.log(e);
                    }}
                    value={lessonProgramId}
                  >
                    <option value="0" disabled>Выберите программу</option>
                    {programs.map(program =>(
                      <option value={program.id}>{program.title}</option>
                    ))}
                  </select>
                  <span>*</span>
                </div> 
                <span 
                  style={{display: errorMessage === "" ? "none" : "inline-block"}}  
                  className={styles.error_message}
                >
                  {errorMessage}
                </span>
                <span style={{color: "#3B3B3BC9"}}>
                  Звездочками отмечены поля, обязательные для заполнения
                </span>
                <button 
                  className={styles.form_button}
                  onClick={() => {
                    createStudentAndProgram();
                  }}
                >
                  Создать
                </button>
                <span 
                  style={{display: succesMessage === "" ? "none" : "inline-block"}}  
                  className={styles.success_message}
                >
                  {succesMessage}
                </span>
                <CopyLink succesMessage={succesMessage} url={"oilan-classroom.com/cabinet/student/" + nickname + "/program/" + lessonProgramId}/>
                <span style={{color: "#3B3B3BC9", display: succesMessage === "" ? "none" : "inline-block"}}>
                Поделитесь со студентом ссылкой на его личный кабинет
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

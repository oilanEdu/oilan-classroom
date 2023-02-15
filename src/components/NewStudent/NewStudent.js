import styles from "./NewStudent.module.css";
import React, { useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import globals from "../../globals";

const axios = require("axios").default;

export default function NewStudent({ show, setShow, programs } ) {
  const [showCreateStudent, setShowCreateStudent] = useState(false)

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

  const createStudentAndProgram = async () => {
    let result = await axios.post(`${globals.productionServerDomain}/getCourseByProgramId`, { programId: lessonProgramId });
    console.log('result', result.data.url)
    let courseURL = result.data.url
    const data = {
      studentSurname,
      studentName,
      studentPatronymic,
      nickname,
      programId: lessonProgramId
    };

    console.log(data);

    try {
      const response = await axios.post(`${globals.productionServerDomain}/createStudentAndProgram`, data);
      console.log(response);
      alert("Студент успешно создан. Скопируйте ссылку для доступа студента в личный кабинет и отправьте ученику: oilan-classroom.com/cabinet/student/" + nickname + "/course/" + courseURL);
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data);
      } else {
        alert("Произошла ошибка");
      }
    }
  };
  console.log(courseId);

  return (
    <div 
      className={styles.modal}
      style={{
        // display: show ? "block" : "none"
        transform: `translate(${show ? "-50%, -50%" : "-50%, -100%"})`,
        top: show ? "55%" : "0%",
        opacity: show ? 1 : 0
      }}
    >
      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>Создать студента</p>
          <p 
            className={styles.close}
            onClick={() => setShow(!show)}
          >
            X
          </p>
        </div>
        <div className={styles.showDetailInfoContain}>
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
              Логин: <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  /><br/>
               Программа: <select
                    onChange={(e) => {
                      setLessonProgramId(e.target.value)
                      console.log(e);
                    }}
                    value={lessonProgramId}>
                      <option value="0" disabled>Выберите программу</option>
                      {programs.map(program =>(
                        <option value={program.id}>{program.title}</option>
                          )
                        )}
                    </select><br/>
              <button 
                onClick={() => {
                  createStudentAndProgram();
                  setShow(false);
                }}
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

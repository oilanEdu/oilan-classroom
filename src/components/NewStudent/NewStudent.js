import styles from "./NewStudent.module.css";
import React, { useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import globals from "../../globals";
import ModalSuccess from "../ModalSuccess/ModalSuccess";
import CopyLink from "../CopyLink/CopyLink";

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

  const [showSucces, setShowSuccess] = useState(false);
  const [courseUrl, setCourseUrl] = useState("");

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

    console.log(data);

    await axios({
      method: "post",
      url: `${globals.productionServerDomain}/createStudentAndProgram`,
      data: data,
    })
      .then(function (res) {
        console.log(res);
        setShowSuccess(true);
      })
      .catch((err) => {
        alert("Произошла ошибка");
      });
  };
  console.log(courseId);

  return (
    <>
    <ModalSuccess 
        show={showSucces} 
        onClickNext={() => {
          setShowSuccess(false);
          window.location.reload();
        }} 
        headText={"Студент успешно создан."}
        text={"Скопируйте ссылку для доступа студента в личный кабинет и отправьте ученику: "}
        link={<CopyLink url={"oilan-classroom.com/cabinet/student/" + nickname + "/course/" + courseUrl}/>}
      />
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
    </>
  );
}

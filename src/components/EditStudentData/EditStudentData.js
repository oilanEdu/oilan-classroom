import styles from "./EditStudentData.module.css";
import React, { useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import globals from "../../globals";
const axios = require("axios").default;

export default function EditStudentData({ show, setShow, student } ) {
  const [showCreateStudent, setShowCreateStudent] = useState(false)
  console.log(student);

  const [studentSurname, setStudentSurname] = useState(student?.surname);
  const [studentName, setStudentName] = useState(student?.name);
  const [studentPatronymic, setStudentPatronymic] = useState(student?.patronymic);
  const [nickname, setNickname] = useState(student?.nickname);

  const [teachers, setTeachers] = useState([])
  const [categories, setCategories] = useState([])
  const [courses, setCourses] = useState([])
  const [programs, setPrograms] = useState([])
  const [lessons, setLessons] = useState([])
  const [students, setStudents] = useState([])
  const [roles, setRoles] = useState([])
  const [lessonProgramId, setLessonProgramId] = useState(0);

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

  // const getStudent = async () => {
  //   const data = {
  //     studentId
  //   };

  //   let result = await axios.get(`${globals.productionServerDomain}/getStudentById`, data)
  //     setStudent(result.data);
  //     console.log(student)
  // }

  useEffect(() => {
    getTeachers()
    getCategories()
    getCourses()
    getPrograms()
    getLessons()
    getStudents()
    getRoles()
  },[])

  const updateStudentData = async() => { 
    const data = {
      name: studentName, 
      surname: studentSurname, 
      patronymic: studentPatronymic,
      nickname, 
      id: student.student_id
    }; 

    console.log(data);
    await axios({
      method: "put",
      url: `${globals.productionServerDomain}/updateStudentData`, 
      data: data,
    })
      .then(function (res) {
        alert("Данные успешно изменены"); 
      })
      .catch((err) => {
        alert("Произошла ошибка");
      });
  };


  // useEffect(() => {
  //   getStudent();
  // },[studentId]);

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
          <p>Обновить личные данные студента</p>
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
                    required
                    value={studentSurname}
                    onChange={(e) => setStudentSurname(e.target.value)}
                  /><br/>
              Имя: <input
                    type="text"
                    required
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
                    required
                    onChange={(e) => setNickname(e.target.value)}
                  /><br/>
               {/* Программа: <select
                    onChange={(e) => setLessonProgramId(e.target.value)}
                    value={lessonProgramId}>
                      <option value="0" disabled>Выберите программу</option>
                      {programs.map(program =>(
                        <option value={program.id}>{program.title}</option>
                          )
                        )}
                    </select><br/> */}
              <button 
                onClick={() => {
                  updateStudentData();
                  setShow(false);
                }}
              >
                Обновить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

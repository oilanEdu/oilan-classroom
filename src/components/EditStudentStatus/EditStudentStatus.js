import styles from "./EditStudentStatus.module.css";
import React, { useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import globals from "../../globals";
import ProgramStatus from "../ProgramStatus/ProgramStatus";
import CopyLink from "../CopyLink/CopyLink";

const axios = require("axios").default;

export default function EditStudentStatus({ studentId, allStudentsLessons, show, setShow, student, programs } ) {
  console.log(student);

  const [studentSurname, setStudentSurname] = useState(student?.surname);
  const [studentName, setStudentName] = useState(student?.name);
  const [studentPatronymic, setStudentPatronymic] = useState(student?.patronymic);
  const [nickname, setNickname] = useState(student?.nickname);

  const [teachers, setTeachers] = useState([])
  const [categories, setCategories] = useState([])
  const [courses, setCourses] = useState([])
  const [programsall, setProgramsall] = useState([])
  const [lessons, setLessons] = useState([])
  const [students, setStudents] = useState([])
  const [roles, setRoles] = useState([])
  const [lessonProgramId, setLessonProgramId] = useState(0);
  const [studentPrograms, setStudentPrograms] = useState([]);
  const [editShow, setEditShow] = useState(false);

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
      setProgramsall(result.data);
      console.log(programsall)
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

  const getProgramsByStudentId = async () => {
    let result = await axios.post(`${globals.productionServerDomain}/getProgramsByStudentId/` + student?.student_id)
    setStudentPrograms(result.data);
      console.log(studentPrograms)
  }

  useEffect(() => {
    getTeachers()
    getCategories()
    getCourses()
    getPrograms()
    getLessons()
    getStudents()
    getRoles()
  }, [])

  useEffect(() => {
    getProgramsByStudentId();
  }, [student?.student_id]);

  console.log(studentPrograms);

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

  const newProgramForStudent = async () => {
    const data = {
      nickname: student.nickname, 
      courseId: student.course_id,
      programId: lessonProgramId
    };

    await axios({
      method: "post",
      url: `${globals.productionServerDomain}/addStudentProgram`,
      data: data,
    })
      .then(function (res) {
        alert("Программа успешно обновлена");
      })
      .catch((err) => {
        alert("Произошла ошибка");
      });

    window.location.reload();
  }

  return (
    <div 
      className={styles.modal}
      style={{
        transform: `translate(${show ? "-50%, -50%" : "-50%, -100%"})`,
        top: show ? "55%" : "0%",
        opacity: show ? 1 : 0
      }}
    >
      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>Профиль студента</p>
          <div className={styles.detailInfoHeader_right}>
            <span className={styles.profile_edit} onClick={() => setEditShow(!editShow)}></span>
            <p 
              className={styles.close}
              onClick={() => setShow(!show)}
            >
              X
            </p>
          </div>
          
        </div>
        <div className={styles.profile}>
          <div className={styles.profile_info} style={{display: !editShow ? "flex" : "none"}}>
            <span>{studentName} {studentSurname} {studentPatronymic}</span>
            <p>{studentId} | <span>{nickname}</span></p>
          </div>
          <div className={styles.profile_edit_container} style={{display: editShow ? "flex" : "none"}}>
            <input value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Имя" />
            <input value={studentSurname} onChange={(e) => setStudentSurname(e.target.value)} placeholder="Фамилия" />
            <input value={studentPatronymic} onChange={(e) => setStudentPatronymic(e.target.value)} placeholder="Отчество" />
            <input value={nickname} onChange={() => setNickname} placeholder="Никнейм" />
            <button
              onClick={() => {
                updateStudentData();
                setEditShow(!editShow);
              }}
            >Изменить</button>
          </div>
          <div className={styles.profile_message}>
            <span>Здесь вы можете редактировать личные данные студента, добавлять уроки и программы</span>
          </div>
        </div>
        
        <div className={styles.showDetailInfoContain}>
          <div className={styles.dataBlock}>
            <div className={styles.formBlock}>
              {studentPrograms?.map((program, index) => {
                return <ProgramStatus allStudentsLessons={allStudentsLessons} student={student} index={index} program={program} />
              })}
              <p className={styles.formBlock_text}>Назначить студенту новую программу: </p>
              <div className={styles.new_program}>
                <select
                  onChange={(e) => setLessonProgramId(e.target.value)}
                  value={lessonProgramId}
                >
                  <option value="0" disabled>Выберите программу</option>
                  {programs.map(program =>(
                    <option value={program.id}>{program.title}</option>
                  ))}
                </select><br/>
                <button 
                  className={styles.save_button}
                  onClick={() => {
                    newProgramForStudent();
                    setShow(false);
                  }}
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

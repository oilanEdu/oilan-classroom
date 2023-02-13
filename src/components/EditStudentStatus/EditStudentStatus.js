import styles from "./EditStudentStatus.module.css";
import React, { useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import globals from "../../globals";
import ProgramStatus from "../ProgramStatus/ProgramStatus";

const axios = require("axios").default;

export default function EditStudentStatus({ show, setShow, student, programs } ) {
  const [showCreateStudent, setShowCreateStudent] = useState(false)
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
  const [studentPrograms, setStudentPrograms] = useState([])

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
  },[])

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

  console.log(student);

  const newProgramForStudent = async () => {
    const data = {
      studentId: student.student_id, 
      courseId: student.course_id,
      programId: lessonProgramId
    };

    await axios({
      method: "post",
      url: `${globals.productionServerDomain}/addStudentProgram`,
      data: data,
    })
      .then(function (res) {
        alert("Студент успешно создан");
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
          <p>Изменение программ студента</p>
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
              {studentPrograms?.map((program, index) => {
                return <ProgramStatus index={index} program={program} studentPrograms={studentPrograms} setStudentPrograms={setStudentPrograms} />
              })}
              <p>Назначить студенту новую программу: </p><select
                    onChange={(e) => setLessonProgramId(e.target.value)}
                    value={lessonProgramId}>
                      <option value="0" disabled>Выберите программу</option>
                      {programs.map(program =>(
                        <option value={program.id}>{program.title}</option>
                          )
                        )}
                    </select><br/>
              <button 
                onClick={() => {
                  newProgramForStudent();
                  setShow(false);
                }}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

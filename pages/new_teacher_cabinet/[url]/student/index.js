import styles from "./index.module.css";
import React, { useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import globals from "../../../../src/globals";
import { useRouter } from "next/router";
// // import ProgramStatus from "../ProgramStatus/ProgramStatus";
// import CopyLink from "../CopyLink/CopyLink";
import HeaderTeacher from "../../../../src/components/new_HeaderTeacher/new_HeaderTeacher";
import NewDateAndTimePickerForLesson from "../../../../src/components/NewDateAndTimePickerForLesson/NewDateAndTimePickerForLesson";
import HomeworksByTeacher from "../../../../src/components/HomeworksByTeacher/HomeworksByTeacher";
import pkg from 'react';
const { useCallback, useRef } = pkg;

const axios = require("axios").default;

export default function Student({ programs }) {
  const router = useRouter();
  const teacherUrl = router.query.url
  const [teacher, setTeacher] = useState([])
  const [saveIsClicked, setSaveIsClicked] = useState(false)
  const [closerLesson, setCloserLesson] = useState([])
  const [editData, setEditData] = useState(false);

  const [studentUrl, setStudentUrl] = useState(router.query.nick);
  const [student, setStudent] = useState([]);
  const [tabNum, setTabNum] = useState(0);

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
  const [allStudentsLessons, setAllStudentsLessons] = useState([])
  useEffect(() => {
    if (allStudentsLessons != undefined) {
      console.log(allStudentsLessons, "lessonsOfAllStudents");
      async function test() {
        let lessonsOfFuture = allStudentsLessons.filter(el => new Date(el.personal_time ? el.personal_time : el.start_time).getTime() - new Date().getTime() > 0)
        const dateDiffs = lessonsOfFuture.map((date) => Math.abs(new Date().getTime() - new Date(date.personal_time ? date.personal_time : date.start_time).getTime()));
        const closestDateIndex = dateDiffs.indexOf(Math.min(...dateDiffs));
        const closestDate = lessonsOfFuture[closestDateIndex];
        let lessonIsGoingHandler = allStudentsLessons.find(el => new Date(el.personal_time ? el.personal_time : el.start_time).getTime() - new Date().getTime() >= -(programs.find(el2 => el.program_id === el2.id).lesson_duration * 60 * 1000) && new Date(el.personal_time ? el.personal_time : el.start_time).getTime() - new Date().getTime() < 0)
        let test = lessonIsGoingHandler ? lessonIsGoingHandler : closestDate
        setCloserLesson(test)
      }
      test()
    }
  }, [allStudentsLessons])


  const loadTeacherData = async () => {
    let data = teacherUrl
    let getTeacherByUrl = await axios.post(`${globals.productionServerDomain}/getTeacherByUrl/` + data)
    setTeacher(getTeacherByUrl['data'][0])
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
    setProgramsall(result.data);
    console.log(programsall)
  }

  const getLessons = async () => {
    await axios.get(`${globals.productionServerDomain}/getLessonInfo?course_url=${studentPrograms[0]?.course_url}&program_id=${studentPrograms[0]?.program_id}&student_id=${studentPrograms[0]?.student_id}`).then(res => {
      setLessons(res.data);
      console.log(res.data);
    });
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
    let result = await axios.post(`${globals.productionServerDomain}/getProgramsByStudentId/` + student?.id)
    setStudentPrograms(result.data);
    console.log(studentPrograms)
  }

  useEffect(() => {
    getTeachers()
    getCategories()
    getCourses()
    getPrograms()
    loadTeacherData()
    getStudents()
    getRoles()
  }, [])

  const getStudent = async () => {
    console.log(studentUrl);
    const data = {
      studentUrl
    }
    const student = await axios.post(`${globals.productionServerDomain}/getStudentByUrl`, data)
    console.log(student);
    setStudent(student.data[0])
  }

  useEffect(() => {
    getProgramsByStudentId();
  }, [student]);

  useEffect(() => {
    getStudent();
  }, [studentUrl]);

  useEffect(() => {
    getLessons();
  }, [studentPrograms]);

  console.log(studentPrograms);

  const updateStudentData = async () => {
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

  const saveLessonDateAndTime = async (dateAndTimeMerger, lesson_id, course_id, student_id) => {
    if (dateAndTimeMerger.length > 10) {
      const dataForGetSchedule = {
        lesson_id,
        course_id,
        student_id
      };
      console.log("dataForGetSchedule", dataForGetSchedule)
      let schedule = await axios({
        method: "post",
        url: `${globals.productionServerDomain}/getScheduleByLessonIdAndCourseIdAndStudentId`,
        data: dataForGetSchedule,
      }).then(function (res) {
        let scheduleRes = res.data
        console.log("scheduleRes", scheduleRes);
        if (scheduleRes.length > 0) {
          return scheduleRes
        }
      })
        .catch((err) => {
          alert("Произошла ошибка");
        });
      console.log(schedule, "schedule1")
      if (schedule != undefined) {
        if (schedule.some(el => el.lesson_id == lesson_id) && schedule.some(el => el.course_id == course_id) && schedule.some(el => el.student_id == student_id)) {
          console.log("isscheduleRIGHT is RIGHT")
          const dataForUpdateSchedule = {
            dateAndTimeMerger,
            lesson_id,
            course_id,
            student_id
          };
          // console.log("dataForGetSchedule", dataForGetSchedule)
          let schedule = await axios({
            method: "put",
            url: `${globals.productionServerDomain}/updateSchedule`,
            data: dataForUpdateSchedule,
          })
        }
      }
      else {
        console.log("isscheduleRIGHT is NOT RIGHT");
        const dataForCreateSchedule = {
          dateAndTimeMerger,
          lesson_id,
          course_id,
          student_id
        };
        let schedule = await axios({
          method: "post",
          url: `${globals.productionServerDomain}/createSchedule`,
          data: dataForCreateSchedule,
        })
      }
    }
  }

  return (
    <div className={styles.container}>
      <HeaderTeacher
        white={true}
        url={teacherUrl}
        teacher={teacher}
      />
      <div className={styles.detailInfo}>
        <div className={styles.menu}>
          <div className={styles.menu_tabs}>
            <p onClick={() => setTabNum(0)}>Главная</p>
            <p onClick={() => setTabNum(1)}>Программа</p>
            <p onClick={() => setTabNum(2)}>Домашние задания</p>
          </div>
          <div>
            {tabNum === 0 && <p>Удалить студента</p>}
          </div>
        </div>
        {tabNum === 0 && <div className={styles.profile}>
          <div className={styles.profile_header}>
            <h3>Общая информация</h3>
            <button>Редактировать</button>
          </div>
          <div className={styles.profile_info}>
            <div>
              <p>{student.name} {student.surname}</p>
              <p>{student.nickname}</p>
            </div>
            <div>
              <div>
                <p>Ссылка на личный кабинет</p>
                <p>{"oilan-classroom.com/cabinet/student/" + student?.nickname + "/course/" + studentPrograms[0]?.course_url + "?program=" + studentPrograms[0]?.program_id}</p>
              </div>
              <div>
                <p>Курс</p>
                <p>{studentPrograms[0]?.course_title}</p>
              </div>
              <div>
                <p>Программа</p>
                <p>{studentPrograms[0]?.title}</p>
              </div>
            </div>
            <div>
              <h5>Прохождение курса</h5>
            </div>
            <div>
              {lessons.map(lesson => {
                return <>
                  <div>
                    <span className={+lesson.score > 0 ? styles.lesson_item_done : styles.lesson_item}>{lesson.lesson_order}</span>
                    <p className={styles.lesson_date}>{+lesson.score > 0 ? "Пройден" : lesson.personal_time ? new Date(lesson.personal_time).toLocaleDateString() : new Date(lesson.start_time).toLocaleDateString()}</p>
                    <p>{new Date(lesson.start_time).getHours().toString().padStart(2, "0")}:{new Date(lesson.start_time).getMinutes().toString().padStart(2, "0")}-{(new Date(lesson.start_time).getHours() + 1).toString().padStart(2, "0")}:{new Date(lesson.start_time).getMinutes().toString().padStart(2, "0")} </p>
                  </div>
                </>
              })}
            </div>
          </div>

        </div>}

        {tabNum === 1 && <div>
          <div className={styles.program_header}>
            <h3>Программа занятий</h3>
            {editData
              ? <button
                onClick={() => {
                  setSaveIsClicked(!saveIsClicked)
                  setEditData(false)
                }}
              >
                Сохранить
              </button>
              : <button onClick={() => setEditData(true)}>Редактировать</button>
            }
          </div>
          <div className={styles.studentPrograms_wrapper}>
            <label>
              Программа
              <input value={studentPrograms[0]?.title} />
            </label>
            <div>
              <div className={styles.lessonsWrapper}>
                <h6>Список уроков</h6>
                {lessons?.map(lesson =>
                  <NewDateAndTimePickerForLesson
                    lessons2={lessons}
                    setLessons2={setLessons}
                    lesson={lesson}
                    lesson_id={lesson.id}
                    lesson_order={lesson.lesson_order}
                    student={student}
                    saveLessonDateAndTime={saveLessonDateAndTime}
                    saveIsClicked={saveIsClicked}
                    editData={editData}
                  />
                )}
              </div>
            </div>
          </div>
        </div>}
        {tabNum === 2 && <HomeworksByTeacher student={student} />}
      </div>
    </div>
  );
}

Student.getInitialProps = async (ctx) => {
  debugger
  if (ctx.query.nick !== undefined) {
    return {
      nick: ctx.query.nick,
    }
  } else {
    return {};
  }
}

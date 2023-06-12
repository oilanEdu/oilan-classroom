import styles from "./index.module.css";
import React, { useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import globals from "../../../../../src/globals";
import { useRouter } from "next/router";
// // import ProgramStatus from "../ProgramStatus/ProgramStatus";
// import CopyLink from "../CopyLink/CopyLink";
import HeaderTeacher from "../../../../../src/components/new_HeaderTeacher/new_HeaderTeacher";
import NewDateAndTimePickerForLesson from "../../../../../src/components/NewDateAndTimePickerForLesson/NewDateAndTimePickerForLesson";
import HomeworksByTeacher from "../../../../../src/components/HomeworksByTeacher/HomeworksByTeacher";
import pkg from 'react';
import { useClipboard } from "use-clipboard-copy";
import Footer from "../../../../../src/components/Footer/Footer";
const { useCallback, useRef } = pkg;

const axios = require("axios").default;

export default function Student({ programs }) {
  const clipboard = useClipboard()
  const router = useRouter();
  const teacherUrl = router.query.url
  const [teacher, setTeacher] = useState([])
  const [saveIsClicked, setSaveIsClicked] = useState(false)
  const [closerLesson, setCloserLesson] = useState([])
  const [editData, setEditData] = useState(false);
  const [editProgramData, setEditProgramData] = useState()

  const [studentUrl, setStudentUrl] = useState(router.query.nick);
  const [student, setStudent] = useState([]);
  const [tabNum, setTabNum] = useState(0);

  console.log(student);

  const [studentSurname, setStudentSurname] = useState(student?.surname);
  const [studentName, setStudentName] = useState(student?.name);
  const [studentPatronymic, setStudentPatronymic] = useState(student?.patronymic);
  const [nickname, setNickname] = useState(student?.nickname);

  const [courseId, setCourseId] = useState(0);
  const [teachers, setTeachers] = useState([])
  const [categories, setCategories] = useState([])
  const [courses, setCourses] = useState([])
  const [programsAll, setProgramsAll] = useState([])
  const [lessons, setLessons] = useState([])
  const [students, setStudents] = useState([])
  const [roles, setRoles] = useState([])
  const [lessonProgramId, setLessonProgramId] = useState(0);
  const [studentPrograms, setStudentPrograms] = useState([]);
  const [closedPrograms, setClosedPrograms] = useState([])
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
    console.log(teacher);
    let result = await axios.post(`${globals.productionServerDomain}/getCoursesByTeacherId/${teacher?.id}`)
    setCourses(result.data);
    console.log(courses)
  }

  const getPrograms = async () => {
    console.log(courseId);
    let result = await axios.post(`${globals.productionServerDomain}/getProgramsByCourseId/${courseId}`)
    setProgramsAll(result.data);
    console.log(result.data);
  }
  const getLessons = async () => {
    let programLessons = await axios.post(`${globals.productionServerDomain}/getLessonsByProgramId/` + studentPrograms?.program_id)
    await axios.get(`${globals.productionServerDomain}/getLessonInfo_v2?course_url=${studentPrograms?.course_url}&program_id=${studentPrograms?.program_id}&student_id=${studentPrograms?.student_id}`).then(res => {
      let array = res.data
      const uniqueLessons = array.filter((item, index, self) => 
        index === self.findIndex((t) => (
          t.id === item.id
        ))
      );
      const newArray = [];

      uniqueLessons.forEach(element => {
        newArray.push(element);
      });

      programLessons['data'].forEach(element => {
        const found = newArray.some(el => el.id === element.id);
        if (!found) {
          newArray.push(element);
        }
      });
      setLessons(newArray);
      console.log(newArray);
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
    let result2 = await axios.post(`${globals.productionServerDomain}/getProgramsByStudentIdGroup/` + student?.id)
    console.log('ee', student)
    let findProgram = result.data.find(el => el.course_id === +router.query.courseId && el.program_id === +router.query.programId)
    setStudentPrograms(findProgram); 
    setClosedPrograms(result.data)
    debugger
    console.log(studentPrograms)
  }

  useEffect(() => {
    getTeachers()
    getCategories()
    loadTeacherData()
    getStudents()
    getRoles()
    router
  }, [])

  useEffect(() => {
    getPrograms();

  }, [courseId]);
  useEffect(() => {
    getCourses();

  }, [teacher]);

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
      courseId: courseId,
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
          }).then(response => {
            getTeachers()
            getCategories()
            loadTeacherData()
            getStudents()
            getRoles()
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
        }).then(response => {
          getTeachers()
          getCategories()
          loadTeacherData()
          getStudents()
          getRoles()
        })
      }
    }
  }

  const deletestudent = async (id) => {
    const data = {
      id
    }; 

    await axios({ 
      method: "delete",
      url: `${globals.productionServerDomain}/deleteStudent`,
      data: data,
    })
      .then(function (res) {
        alert("Студент успешно удален");
      })
      .catch((err) => {
        alert("Произошла ошибка"); 
      });
  }

  const addressUndefinedFixer = async () => {
    await router.push(`/cabinet/teacher/${localStorage.login}`)
    window.location.reload()
  }
  useEffect(() => {
    if (router.query.url === "undefined") {
      addressUndefinedFixer()
    }
  }, [router])

  
  return (
    <>
          <HeaderTeacher
        white={true}
        url={teacherUrl}
        teacher={teacher}
      />
        <div className={styles.container}>

      <div className={styles.detailInfo}>
        <div className={styles.menu}>
          <div className={styles.menu_tabs}>
            <p style={{color: tabNum === 0 ? "#2E8CF2" : "#000"}} onClick={() => setTabNum(0)}>Главная</p>
            <p style={{color: tabNum === 1 ? "#2E8CF2" : "#000"}}  onClick={() => setTabNum(1)}>Программа</p>
            <p style={{color: tabNum === 2 ? "#2E8CF2" : "#000"}}  onClick={() => setTabNum(2)}>Домашние задания</p>
          </div>
          <div>
            {tabNum === 0 && <p 
              className={styles.studentDelete}
              onClick={() => {
                deletestudent(student?.id)
                router.push(`/cabinet/teacher/${teacherUrl}/myStudents`)
              }}
            >Удалить студента</p>}
          </div>
        </div>
        {tabNum === 0 && <div className={styles.profile}>
          <div className={styles.profile_header}>
            <h3>Общая информация</h3>
            {editProgramData
              ? <button
                onClick={() => {
                  newProgramForStudent()
                  setEditProgramData(false)
                }}
              >
                Сохранить
              </button>
              : <button onClick={() => setEditProgramData(true)}>Редактировать</button>
            }
          </div>
          <div className={styles.profile_info}>
            <div className={styles.student_info__wrapper}>
              <div className={styles.student__image}>
                <img src="https://realibi.kz/file/185698.svg" alt="" />
              </div>
              <div className={styles.student__info}>
                <p>{student?.name} {student?.surname}</p>
                <p>{student?.nickname}</p>
              </div>
            </div>
            <div className={styles.input_wrapper}>
              <div className={styles.input_container}>
                <p>Ссылка на личный кабинет</p>
                <div className={styles.input_inner_container}>
                  <input value={"www.oilan-classroom.com/cabinet/student/" + student?.nickname + "/course/" + studentPrograms?.course_url + "?program=" + studentPrograms?.program_id} 
                  ref={clipboard.target}
                  />
                  <span 
                    className={styles.generate_pass_copy} 
                    onClick={clipboard.copy}
                  ></span>
                </div>
              </div>
              <div className={styles.input_container}>
                <p>Курс</p>
                {editProgramData
                  ? <select
                    className={styles.input_block}
                    onChange={(e) => {
                      setCourseId(e.target.value)
                      console.log(e);
                    }}
                    value={courseId}
                  >
                    <option value="0" disabled>Выберите курс</option>
                    {courses.map(course => (
                      <option value={course.id}>{course.title}</option>
                    ))}
                  </select>
                  : <input value={studentPrograms?.course_title} />
                }
              </div>
              <div className={styles.input_container}>
                <p>Программа</p>
                {editProgramData
                  ? <select
                    className={styles.input_block}
                    onChange={(e) => {
                      setLessonProgramId(e.target.value)
                      console.log(e);
                    }}
                    value={lessonProgramId}
                  >
                    <option value="0" disabled>Выберите программу</option>
                    {programsAll.filter(el => el.type === 'individual').map(program => (
                      <option disabled={closedPrograms.some(el => el.program_id === program.id)} value={program.id}>{program.title}</option>
                    ))}
                  </select>
                  : <input value={studentPrograms?.title} />
                }
              </div>
            </div>
            <div className={styles.course_success_wrapper}>
              <div>
                <h5>Прохождение курса</h5>
              </div>
              <div className={styles.course_success}>
                {lessons.map(lesson => {
                  return <>
                    <div className={styles.lesson_complete_wrapper}>
                      <div className={styles.lesson_complete}>
                        <span className={+lesson.score > 0 ? styles.lesson_item_done : styles.lesson_item}>{lesson.lesson_order}</span>
                        {/* <p className={styles.lesson_date}>{+lesson.score > 0 ? "Пройден" : lesson.personal_time ? new Date(lesson.personal_time).toLocaleDateString() : new Date(lesson.start_time).toLocaleDateString()}</p> */}
                      </div>
                      {new Date(lesson.personal_time ? lesson.personal_time : lesson.start_time).toLocaleDateString() ===
                        "01.01.1970" ? (
                          <>
                            <p>Дата не задана</p>{" "}
                            <p
                              style={{ color: "#2E8CF2", cursor: "pointer" }}
                              onClick={() => setTabNum(1)}
                            >
                              Задать
                            </p>
                          </>
                        ) : (
                          <>
                          <p className={styles.lesson_date}>
                        {lesson.personal_time ? new Date(lesson.personal_time).toLocaleDateString() : new Date(lesson.start_time).toLocaleDateString()}
                      </p>    
                      <p>{new Date(lesson.personal_time ? lesson.personal_time : lesson.start_time).getHours().toString().padStart(2, "0")}:{new Date(lesson.personal_time ? lesson.personal_time : lesson.start_time).getMinutes().toString().padStart(2, "0")}-{(new Date(lesson.personal_time ? lesson.personal_time : lesson.start_time).getHours() + 1).toString().padStart(2, "0")}:{new Date(lesson.personal_time ? lesson.personal_time : lesson.start_time).getMinutes().toString().padStart(2, "0")} </p>
                          </>
                        )}     
                    </div>
                  </>
                })}
              </div>
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
            <span>Программа</span>
            <input className={styles.input_programm} value={studentPrograms?.title} />
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
    <Footer />
    </>

  );
}

Student.getInitialProps = async (ctx) => {
  if (ctx.query.nick !== undefined) {
    return {
      nick: ctx.query.nick,
    }
  } else {
    return {};
  }
}

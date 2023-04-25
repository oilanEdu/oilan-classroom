import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import styles from './index.module.css'
import globals from "../../../../../../src/globals";
import axios from "axios";
import HeaderTeacher from "../../../../../../src/components/new_HeaderTeacher/new_HeaderTeacher";
import { ClickAwayListener } from "@mui/base";
import Link from "next/link";
import GoToLessonWithTimerComponent from "../../../../../../src/components/GoToLessonWithTimerComponent/GoToLessonWithTimerComponent";

const Group = () => {
  const router = useRouter();
  const teacherUrl = router.query.url
  const [teacher, setTeacher] = useState([])
  const [baseDataLoaded, setBaseDataLoaded] = useState(false)
  const [isStudents, setIsStudents] = useState(true);
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [sortType, setSortType] = useState("");
  const [lessonsLoaded, setLessonsLoaded] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [showSort, setShowSort] = useState(false);
  const [sortMode, setSortMode] = useState(false)
  const [currentGroup, setCurrentGroup] = useState()

  const isInMainPage = true;

  const loadStudentLessons = async (studentId, programId) => {
    setLessonsLoaded(true)
    const data = {
      studentId,
      programId
    };
    await axios({
      method: "post",
      url: `${globals.productionServerDomain}/getStudentLessonsByProgramId`,
      data: data,
    })
      .then(function (res) {
        let lessons = res.data
        let lesson_number = 0
        res.data.forEach(lesson => {
          lesson_number += 1
          lesson.lesson_number = lesson_number
        })
        setLessons(lessons => [...lessons, ...res.data])
      })
      .catch((err) => {
        alert("Произошла ошибка");
      });
  }

  const loadTeacherData = async () => {
    let data = teacherUrl
    let getTeacherByUrl = await axios.post(`${globals.productionServerDomain}/getTeacherByUrl/` + data)
    setTeacher(getTeacherByUrl['data'][0])
    const teacherIdLocal = getTeacherByUrl['data'][0]?.id
    let lessonsOfAllStudents = []
    const dataStudents = {
      id: teacherIdLocal
    }
    // let teacherStudents = await axios.post(`${globals.productionServerDomain}/getStudentsByTeacherId/`, dataStudents)
    let teacherGroups = await axios.post(`${globals.productionServerDomain}/getStudentsGroupsByTeacherId/`, dataStudents)
    await teacherGroups['data'].forEach(async student => {
      // debugger
      student.check = 0
      let diff = 604800000 * 7
      // if (!lessonsLoaded) { loadStudentLessons(student.student_id, student.program_id) }
      let answersCount = 0
      let studentCheck = 0
      let studentLessons = await axios.get(`${globals.productionServerDomain}/getLessonInfo?course_url=${student.course_url}&program_id=${student.program_id}&student_id=${student.student_id}`).then(async res => {
        let lessons = res.data
        console.log(lessons, "lessonsOfAllStudents");
        lessonsOfAllStudents.push(...lessons);
        await res.data.forEach(async lesson => {
          if (+lesson.all_exer !== 0 && +lesson.all_exer === +lesson.done_exer) {
            studentCheck += 1
            student.check = studentCheck
            student.progress = 100 / student.lessons_count * student.check
          };
          let currentDate = new Date().toLocaleDateString()
          let lessonDate
          if (lesson.personal_time) {
            lesson.fact_time = lesson.personal_time
            lessonDate = new Date(lesson.fact_time).toLocaleDateString()
          } else {
            lesson.fact_time = lesson.start_time
            lessonDate = new Date(lesson.fact_time).toLocaleDateString()
          }
          let dateStr = new Date(lesson.personal_time ? lesson.personal_time : lesson.start_time);
          let closerDate
          if ((Date.parse(dateStr) > Date.parse(new Date())) && (Date.parse(dateStr) - Date.parse(new Date()) < diff)) {
            // debugger
            closerDate = lessonDate
            let closerLesson
            if (closerLesson) {
              if (closerDate < new Date(closerLesson.fact_time).toLocaleDateString()) {
                // setCloserLesson(lesson)
              }
            } else {
              // setCloserLesson(lesson)
            }
            let curr_hours = dateStr.getHours();
            let curr_minutes = dateStr.getMinutes();
            student.lesson_date = lesson.fact_time
            // student.closer_date = closerDate 
            // student.curr_hours = curr_hours 
            // student.curr_minutes = curr_minutes 
            // debugger
          }
          let lessonExercises = await axios.post(`${globals.productionServerDomain}/getExercisesByLessonId/` + lesson.id).then(res => {
            let exercises = res.data
            if (exercises) {
              exercises.forEach(async exercise => {
                let studentId = student.student_id
                let exerciseId = exercise.id
                const data = {
                  studentId,
                  exerciseId
                };
                let exerciseAnswers = await axios({
                  method: "post",
                  url: `${globals.productionServerDomain}/getAnswersByStudExId`,
                  data: data,
                }).then(res => {
                  // let answers = res.data
                  // answersCount = answers.length
                  // if ((exercises.length > 0) && (exercises.length == answersCount)){
                  //     student.check += 1 
                  //     studentCheck += 1
                  //     console.log('studentCheck', studentCheck)
                  //     setCheck(student.check)
                  //     student.check = studentCheck 
                  //     student.progress = 100/student.lessons_count*student.check
                  // }  
                  // else{ 
                  //     console.log('')
                  //     setCheck(0)
                  //     studentCheck = 0
                  //     student.check = 0
                  //     student.progress = 0
                  // }
                })
              })
            }
          })
        })
        var lessonsFuture = lessons.filter(el => (new Date() - new Date(el.personal_time ? el.personal_time : el.start_time).getTime() < 0))
        var temp = lessonsFuture.map(d => Math.abs(new Date() - new Date(d.personal_time ? d.personal_time : d.start_time).getTime()));
        var withoutNan = temp.filter(function (n) { return !isNaN(n) })
        var idx = withoutNan.indexOf(Math.min(...withoutNan));
        if (lessonsFuture[idx] != undefined) {
          let curr_hours = new Date(lessonsFuture[idx]?.personal_time ? lessonsFuture[idx]?.personal_time : lessonsFuture[idx]?.start_time).getHours();
          let curr_minutes = new Date(lessonsFuture[idx]?.personal_time ? lessonsFuture[idx]?.personal_time : lessonsFuture[idx]?.start_time).getMinutes();
          student.closer_date = new Date(lessonsFuture[idx]?.personal_time ? lessonsFuture[idx]?.personal_time : lessonsFuture[idx]?.start_time).toLocaleDateString()
          student.closer_date_witout_local = lessonsFuture[idx]?.personal_time ? lessonsFuture[idx]?.personal_time : lessonsFuture[idx]?.start_time
          student.curr_hours = curr_hours
          student.curr_minutes = curr_minutes
          student.lesson_date = new Date(lessonsFuture[idx]?.personal_time ? lessonsFuture[idx]?.personal_time : lessonsFuture[idx]?.start_time).toLocaleDateString()
        } else {
          let curr_hours = undefined
          let curr_minutes = undefined
          student.closer_date = undefined
          student.closer_date_witout_local = undefined
          student.curr_hours = undefined
          student.curr_minutes = undefined
          student.lesson_date = undefined
        }

      })
    }
    );

    // setStudents(teacherGroups['data'])
    setGroups(teacherGroups['data'])

    let currentGroupLocal = teacherGroups['data'].find(el => el.id === +router.query.groupId)
    setCurrentGroup(currentGroupLocal)
    console.log(teacherGroups['data']);

    let groupId = router.query.groupId
    // debugger
    let getStudentsByGroupId = await axios.post(`${globals.productionServerDomain}/getStudentsByGroupId/` + groupId)

    let filteredStudents = teacherGroups['data'].filter(el => getStudentsByGroupId['data'].some(el2 => el.student_id === el2.student_id && el.course_id === el2.course_id && el.program_id === el2.program_id && el.title === currentGroupLocal.title))
    setStudents(filteredStudents)

    let programLessons = await axios.post(`${globals.productionServerDomain}/getLessonsByProgramId/` + currentGroupLocal?.program_id)
    // setLessons(programLessons['data'])
    debugger

    await axios.get(`${globals.productionServerDomain}/getLessonInfo_v2?course_url=${currentGroupLocal?.course_url}&program_id=${currentGroupLocal?.program_id}&student_id=${currentGroupLocal?.student_id}`).then(res => {
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

  useEffect(() => {
    loadTeacherData();

  }, [teacherUrl]);

  const loadBaseData = async () => {
    let data = teacherUrl
    let getTeacherByUrl = await axios.post(`${globals.productionServerDomain}/getTeacherByUrl/` + data)
    const teacherIdLocal = getTeacherByUrl['data'][0]?.id
    console.log('teacherIdLocal', teacherIdLocal)
    setTeacher(getTeacherByUrl['data'][0])
    // let teacherCourses = await axios.post(`${globals.productionServerDomain}/getCoursesByTeacherId/` + teacherIdLocal)
    // console.log('teacherCourses', teacherCourses)
    // setCourses(teacherCourses['data'])
  }

  console.log(students);

  const ultimateSort = async (field) => {
    setSortMode(true)
    students.sort(byField(field));
    // loadTeacherData()
  }

  function byField(field) {
    return (a, b) => a[field] > b[field] ? 1 : -1;
  }

  return <>
    <div className={styles.container}>
      <HeaderTeacher
        white={true}
        url={teacherUrl}
        teacher={teacher}
        isInMainPage={isInMainPage}
      />
       <GoToLessonWithTimerComponent isTeacher={true} url={router.query.url} />
      <div className={styles.contentWrapper}>
        <div className={styles.groupClicker}>
          <span onClick={() => router.push(`/cabinet/teacher/${encodeURIComponent(teacherUrl)}/myStudents`)}>Студенты</span>
          <span onClick={() => setIsStudents(false)}>Группы</span>
        </div>
        <div>
          <div>
              <div className={styles.students_head}>
                <h4>{currentGroup?.title}</h4>
                <button
                onClick={() => router.push(`/cabinet/teacher/${encodeURIComponent(teacherUrl)}/myStudents/edit_group?groupId=${router.query.groupId}`)}
                >Редактировать</button>
                <ClickAwayListener onClickAway={() => setShowSort(false)}>
                  <div className={styles.sortContainer}>
                    <div
                      onClick={() => setShowSort(!showSort)}
                      className={styles.sortTitle}
                    >
                      <span
                        className={showSort ? styles.sortShow : styles.sortHide}
                      >
                        Сортировать
                      </span>
                    </div>
                    <div
                      className={styles.sortOptions}
                      style={{ display: showSort ? "flex" : "none" }}
                    >
                      <span onClick={() => ultimateSort("lesson_date")}>
                        Следующие занятие
                      </span>
                      <span onClick={() => ultimateSort("surname")}>
                        По алфавиту
                      </span>
                      <span onClick={() => ultimateSort("course_title")}>
                        По курсам
                      </span>
                      <span onClick={() => ultimateSort("program_title")}>
                        По программам
                      </span>
                    </div>
                  </div>
                </ClickAwayListener>
              </div>
              <div className={styles.groupDesc}>
                <p>
                Курс - {currentGroup.program_title}
                </p>
                <p>
                Программа - {currentGroup.course_title}
                </p>
              </div>

              {students
                ? <div className={styles.my_students}>
                  {students.map(student => (
                    <div className={styles.student_item}>
                      <div className={styles.student_name_wrapper}>
                        <div className={styles.student__name}>
                          <div className={styles.student_image}>
                            <img src="https://realibi.kz/file/185698.svg" alt="" />
                          </div>
                          <span>{student.surname} {student.name}</span>
                        </div>
                      </div>
                      <div className={styles.student_item__info_wrapper}>
                        <p>Курс: {student?.course_title} </p>
                        <p>Программа: {student?.program_title}</p>
                        <p>
                          Следующий урок:
                          <span>
                            {student?.curr_hours != undefined ? (
                              <>
                                {student?.curr_hours < 10
                                  ? "0" + student?.curr_hours
                                  : student?.curr_hours}
                                :
                                {student.curr_minutes < 10
                                  ? "0" + student?.curr_minutes
                                  : student?.curr_minutes}
                                -
                                {/*formattedTime*/}
                              </>
                            ) : (
                              "Не запланировано"
                            )}
                          </span>
                        </p>
                      </div>
                      <div className={styles.student_btn_obman}><span></span></div>
                      <div className={styles.student_btn}><img src="https://realibi.kz/file/897616.svg" alt="" /></div>
                    </div>
                  ))}
                </div>
                : <></>
              }
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
        </div>
      </div>
    </div>
  </>;
};

export default Group;
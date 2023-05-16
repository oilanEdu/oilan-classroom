import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import styles from './index.module.css'
import globals from "../../../../../src/globals";
import axios from "axios";
import { Image } from "react-bootstrap";
import HeaderTeacher from "../../../../../src/components/new_HeaderTeacher/new_HeaderTeacher";
import { ClickAwayListener } from "@mui/base";
import GoToLessonWithTimerComponent from "../../../../../src/components/GoToLessonWithTimerComponent/GoToLessonWithTimerComponent";
import GuideModal from "../../../../../src/components/GuideModal/GuideModal";
import Footer from "../../../../../src/components/Footer/Footer";

const myStudents = () => {
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
  const [showGuide, setShowGuide] = useState(false)
  const [guide, setGuide] = useState()

  const isInMainPage = true;
  
  useEffect(() => {
    
    let test = router.asPath.includes("#groups")
    if (test) {
    setIsStudents(false)  
    }
    router
    // debugger
  }, [])

  const loadGuide = async (id) => {
    let getGuideById = await axios.post(`${globals.productionServerDomain}/getGuideById/` + id)
    setGuide(getGuideById['data'][0])
    console.log('guide', getGuideById, guide)
  }

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
      id: teacherIdLocal,
      sort: sortType
    }
    let teacherStudents = await axios.post(`${globals.productionServerDomain}/getStudentsByTeacherId/`, dataStudents)
    let teacherStudentsGroup = await axios.post(`${globals.productionServerDomain}/getStudentsByTeacherIdGroup/`, dataStudents)
    debugger
    let teacherGroups = await axios.post(`${globals.productionServerDomain}/getGroupsByTeacherId/`, dataStudents)
    await teacherStudents['data'].forEach(async student => {
      // debugger
      student.check = 0
      let diff = 604800000 * 7
      if (!lessonsLoaded) { loadStudentLessons(student.student_id, student.program_id) }
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

    setStudents(teacherStudents['data'])
    setGroups(teacherGroups['data'])
    debugger
    console.log(teacherStudents['data']);
  }

  useEffect(() => {
    // if (!baseDataLoaded || !teacher) {
    // loadBaseData()
    // setBaseDataLoaded(true)
    loadTeacherData();
    // }
    console.log('teacherUrl', teacherUrl)
    // console.log('teacher', teacher)

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
        <HeaderTeacher
        white={true}
        url={teacherUrl}
        teacher={teacher}
        isInMainPage={isInMainPage}
      />
    <div className={styles.container}>

       <GoToLessonWithTimerComponent isTeacher={true} url={router.query.url} />
      <div className={styles.contentWrapper}>
        <GuideModal showGuide={showGuide} setShowGuide={setShowGuide} guide={guide}/>
        <div className={styles.groupClicker}>
          <span className={isStudents?styles.blueSpan:styles.whiteSpan} onClick={() => setIsStudents(true)}>Студенты</span>
          <span className={!isStudents?styles.blueSpan:styles.whiteSpan} onClick={() => setIsStudents(false)}>Группы</span>
        </div>
        <div>
          {isStudents
            ? <div>
              <div className={styles.students_head}>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                  <h4>Список студентов</h4>
                  <Image 
                    src="https://realibi.kz/file/628410.png"
                    style={{marginLeft: '10px', width: '20px', height: '20px'}}
                    onClick={() => {
                      loadGuide(11)
                      setShowGuide(true)
                    }}
                  />
                </div>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                  <button onClick={() => router.push(`/cabinet/teacher/${teacherUrl}/myStudents/add_new_student`)}>Создать студента</button>
                  <Image 
                    src="https://realibi.kz/file/628410.png"
                    style={{marginLeft: '10px', width: '20px', height: '20px'}}
                    onClick={() => {
                      loadGuide(10)
                      setShowGuide(true)
                    }}
                  />
                </div>
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
                      <div className={styles.student_btn} onClick={() => router.push(`/cabinet/teacher/${teacherUrl}/student?nick=${student?.nickname}&programId=${student?.program_id}&courseId=${student.course_id}&studentId=${student.student_id}`)}><img src="https://realibi.kz/file/897616.svg" alt="" /></div>
                    </div>
                  ))}
                </div>
                : <></>
              }
            </div>
            : <div>
              <div className={styles.students_head}>
                <h4>Список групп</h4>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                  <button onClick={() => router.push(`/cabinet/teacher/${encodeURIComponent(teacherUrl)}/myStudents/new_group`)}>Создать группу</button>
                  <Image 
                    src="https://realibi.kz/file/628410.png"
                    style={{marginLeft: '10px', width: '20px', height: '20px'}}
                    onClick={() => {
                      loadGuide(12)
                      setShowGuide(true)
                    }}
                  />
                </div>
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

              {groups
                ? <div className={styles.my_students}>
                  {groups.map(group => (
                    <div className={styles.student_item}>
                      <div className={styles.student_name_wrapper}>
                        <div className={styles.student__name}>
                          <div className={styles.student_image}>
                            <img src="https://realibi.kz/file/293737.svg" alt="" />
                          </div>
                          <span>{group.title}</span>
                        </div>
                      </div>
                      <div className={styles.student_item__info_wrapper}>
                        <p>Курс: {group?.course_title} </p>
                        <p>Программа: {group?.program_title}</p>
                        <p>
                          Следующий урок:
                          <span>
                            {group?.curr_hours != undefined ? (
                              <>
                                {group?.curr_hours < 10
                                  ? "0" + group?.curr_hours
                                  : group?.curr_hours}
                                :
                                {group.curr_minutes < 10
                                  ? "0" + group?.curr_minutes
                                  : group?.curr_minutes}
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
                      <div 
                      // onClick={() => router.push(`/cabinet/teacher/${teacherUrl}/student?nick=${student?.nickname}&programId=${student?.program_id}`)} 
                      onClick={() => router.push(`/cabinet/teacher/${encodeURIComponent(teacherUrl)}/myStudents/group?groupId=${group.id}&isGroup=${true}`)} className={styles.student_btn}><img src="https://realibi.kz/file/897616.svg" alt="" /></div>
                    </div>
                  ))}
                </div>
                : <></>
              }
            </div>
          }
        </div>
      </div>
    </div>
    <Footer />
  </>;
};

export default myStudents;
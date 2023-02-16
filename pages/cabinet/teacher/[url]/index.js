import { useRouter } from "next/router";
import React, {useEffect, useRef, useState} from "react";
import globals from "../../../../src/globals";
import styles from "./styles.module.css";
import axios from "axios";
import Link from "next/link";
import Footer from "../../../../src/components/Footer/Footer";
import HeaderTeacher from "../../../../src/components/HeaderTeacher/HeaderTeacher";
import Calendar2 from "../../../../src/components/Calendar_2/CalendarComponent_2";
import { Image } from "react-bootstrap";
import ModalForLessonConfiguration from "../../../../src/components/ModalForLessonConfiguration/ModalForLessonConfiguration";
import classnames from "classnames";
import Pagination from "../../../../src/components/Pagination/Pagination";
import GoToLessonWithTimerComponent from "../../../../src/components/GoToLessonWithTimerComponent/GoToLessonWithTimerComponent";
import ClickAwayListener from '@mui/base/ClickAwayListener';
import ProgramItem from "../../../../src/components/ProgramItem/ProgramItem";
import CourseItem from "../../../../src/components/CourseItem/CourseItem";
import NewCourse from "../../../../src/components/NewCourse/NewCourse";
import NewStudent from "../../../../src/components/NewStudent/NewStudent";
import StudentItem from "../../../../src/components/StudentItem/StudentItem";

function TeacherCabinet(props) {
    const [teacher, setTeacher] = useState([])
    const [programs, setPrograms] = useState([])
    const [students, setStudents] = useState([])
    const [check, setCheck] = useState(0) 
    const [closerLesson, setCloserLesson] = useState([]) 
    useEffect(() => {
      console.log(closerLesson, "closerLesson");
    }, [closerLesson])
    const [days, setDays] = useState('');
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [dataLoaded, setDataLoaded] = useState(false)
    const [lessonsLoaded, setLessonsLoaded] = useState(false)
    const [studentsLoaded, setStudentsLoaded] = useState(false)
    const [allStudentsLessons, setAllStudentsLessons] = useState([])
    useEffect(() => {
      if (allStudentsLessons != undefined && dataLoaded === true) {
        console.log(allStudentsLessons, "lessonsOfAllStudents");
        // var lessonsFuture = allStudentsLessons.filter(el => (new Date() - new Date(el.personal_time).getTime() < 0)) 
        // var temp = lessonsFuture.map(d => Math.abs(new Date() - new Date(d.personal_time).getTime()));
        // var withoutNan = temp.filter(function(n) { return !isNaN(n)}) 
        // var idx = withoutNan.indexOf(Math.min(...withoutNan)); 
        let lessonsOfFuture = allStudentsLessons.filter(el => new Date(el.personal_time).getTime() - new Date().getTime() > 0)
        const dateDiffs = lessonsOfFuture.map((date) => Math.abs(new Date().getTime() - new Date(date.personal_time).getTime()));
        const closestDateIndex = dateDiffs.indexOf(Math.min(...dateDiffs));
        const closestDate = lessonsOfFuture[closestDateIndex];

        let lessonIsGoingHandler = allStudentsLessons.find(el => new Date(el.personal_time).getTime() - new Date().getTime() >= -3600000 && new Date(el.personal_time).getTime() - new Date().getTime() < 0)    
        let test = lessonIsGoingHandler ? lessonIsGoingHandler : closestDate
        setCloserLesson(test)
        // let test2 = allStudentsLessons.map(el => new Date(el.personal_time).getTime() - new Date().getTime()  ) 
      }  
    }, [allStudentsLessons])
    
    const [emptyProgramCourseId, setEmptyProgramCourseId] = useState(0)
    const [emptyProgramTeacherId, setEmptyProgramTeacherId] = useState(0)
    
    const [lessons, setLessons] = useState([''])
    const [showModalLesson, setShowModalLesson] = useState(false)
    const [studentForModal, setStudentForModal] = useState()

    const [showSort, setShowSort] = useState(false);
    const [sortType, setSortType] = useState("");
    const [sortMode, setSortMode] = useState(false)
    
    const [showSetting, setShowSetting] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [cardsPerPage] = useState(10);
    const indexOfLastPost = currentPage * cardsPerPage;
    const indexOfFirstPost = indexOfLastPost - cardsPerPage;
    const currentPosts = students?.slice(indexOfFirstPost, indexOfLastPost)

    const [disableButton, setDisableButton]= useState(true)

    const [studentsList, setStudentsList] = useState(currentPosts)
    const [closerStudent, setCloserStudent] = useState();
    const [courses, setCourses] = useState([]);
    const [showAllCourses, setShowAllCourses] = useState(false);
    const [showAllPrograms, setShowAllPrograms] = useState(false);
    const [showAllStudents, setShowAllStudents] = useState(false) 

    const [addCourseModalShow, setAddCourseModalShow] = useState(false);
    const [addStudentModalShow, setAddStudentModalShow] = useState(false);

    const [currentCourse, setCurrentCourse] = useState(0);

    useEffect(() => {
      console.log(closerLesson, "closerLesson");
      if (closerLesson != undefined && students != undefined) {
        let closerStudentLocal = students.find(el => el.student_id === closerLesson.student_id)
        setCloserStudent(closerStudentLocal)
        console.log(closerStudentLocal, "closerStudentLocal", students, closerLesson);
      }
    }, [students, closerLesson])
    useEffect(() => {
        console.log(studentsList, "studentsList");
    }, [studentsList])
 
    const howManyPages = Math.ceil(students?.length/cardsPerPage)

    const isInMainPage = true;
    
    const updateTimer = () => {
        const future = Date.parse(closerLesson?.personal_time);
        const now = new Date();
        const diff = future - now;
        
        const y = Math.floor( diff / (1000*60*60*24*365) );
        const d = Math.floor( diff / (1000*60*60*24) );
        const h = Math.floor( diff / (1000*60*60) );
        const m = Math.floor( diff / (1000*60) );
        const s = Math.floor( diff / 1000 );


        // const hour = (h - d  * 24) + (days * 24);
        
        setDays(d  - y * 365);
        setHours(h + d  * 24);
        setMinutes(m  - h * 60);
        setSeconds(s  - m  * 60);
      };

      useEffect(() => {
        if ((hours * 60 + minutes) * 60 + seconds >= 600 && hours != NaN && minutes != NaN && seconds != NaN) {
          setDisableButton(true)
        }
        if ((hours * 60 + minutes) * 60 + seconds < 600 && hours != NaN && minutes != NaN && seconds != NaN) {
          setDisableButton(false)
        }
        if (closerLesson?.length === 0) {
          setDisableButton(true)
        }
      }, [seconds])
    //ниже 11 строк кода сделаны чтобы предотвратить конвулсьсии таймера. Автор кода - Ануар.
    // const prevCountRefDays = useRef(0);
    // const prevCountRefHours = useRef(0);
    // const prevCountRefMinutes = useRef(0);
    // const prevCountRefSeconds = useRef(0);
    // useEffect(() => {
    //   //assign the ref's current value to the count Hook
    //   if (seconds != NaN) {
    //     prevCountRefSeconds.current = seconds
    //   }
    //   if (minutes != NaN) {
    //     prevCountRefMinutes.current = minutes
    //   }
    //   if (hours != NaN) {
    //     prevCountRefHours.current = hours
    //   }
    //   prevCountRefDays.current = days;




    //   console.log(prevCountRefHours.current, prevCountRefMinutes.current, prevCountRefSeconds.current, "hours.current, minutes.current, seconds.current");
    // }, [seconds]); //run this code when the value of count changes

      
     
    const router = useRouter() 

    useEffect(() => {
        loadTeacherData()
        console.log('router', router)
    }, []) 
    
    setInterval(() => {updateTimer()}, 1000);  

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
        setStudentsList(currentPosts) 
        let data = props.url 
        let getTeacherByUrl = await axios.post(`${globals.productionServerDomain}/getTeacherByUrl/` + data)
        const teacherIdLocal = getTeacherByUrl['data'][0]?.id
        setEmptyProgramTeacherId(teacherIdLocal)
        let teacherCourses = await axios.post(`${globals.productionServerDomain}/getCoursesByTeacherId/` + teacherIdLocal)
        setCourses(teacherCourses['data'])
        teacherCourses['data'].forEach(async course => { 
          setEmptyProgramCourseId(course.id)
          const allStudents = await axios.post(`${globals.productionServerDomain}/getAllStudents/` + course.id)
          course.all_students = allStudents.data[0].all_students;
          const passedStudents = await axios.post(`${globals.productionServerDomain}/getPassedStudents/` + course.id)
          console.log('passedStudents', passedStudents, router)
          course.passed_students = passedStudents.data[0].passed_students;
        }); 
        let teacherPrograms = await axios.post(`${globals.productionServerDomain}/getProgramsByTeacherId/` + teacherIdLocal)
        let count = 0
          teacherPrograms['data'].forEach(async program => {
            console.log(program);
            let qtyStudentsInProgram
            try {
              qtyStudentsInProgram = await axios.post(`${globals.productionServerDomain}/getQtyStudentsInProgram`, program.id);
            } catch (error) {
              
            }
            console.log(qtyStudentsInProgram);

            count += 1
            program.number = count
              setEmptyProgramCourseId(program.course_id)
            }
           ); 
        const dataStudents = {
            id: teacherIdLocal,
            sort: sortType
        }
        setTeacher(getTeacherByUrl['data'][0])
        setPrograms(teacherPrograms['data'])
        let lessonsOfAllStudents = []
        let teacherStudents = await axios.post(`${globals.productionServerDomain}/getStudentsByTeacherId/`, dataStudents)
        await teacherStudents['data'].forEach(async student => {
            // debugger
            student.check = 0
            let diff = 604800000*7
            if (!lessonsLoaded) {loadStudentLessons(student.student_id, student.program_id)}
            let answersCount = 0 
            let studentCheck = 0
            let studentLessons = await axios.get(`${globals.productionServerDomain}/getLessonInfo?course_url=${student.course_url}&program_id=${student.program_id}&student_id=${student.student_id}`).then(async res => {
                let lessons = res.data
                lessonsOfAllStudents.push(...lessons);
                await res.data.forEach(async lesson => {
                    if (+lesson.all_exer !== 0 && +lesson.all_exer === +lesson.done_exer) {
                        studentCheck += 1
                        student.check = studentCheck 
                        student.progress = 100/student.lessons_count*student.check
                      };
                    let currentDate = new Date().toLocaleDateString()
                    let lessonDate 
                    if (lesson.personal_time){
                        lesson.fact_time = lesson.personal_time
                        lessonDate = new Date(lesson.fact_time).toLocaleDateString()
                    }else{
                        lesson.fact_time = lesson.start_time
                        lessonDate = new Date(lesson.fact_time).toLocaleDateString()
                    }
                    let dateStr = new Date(lesson.personal_time ? lesson.personal_time : lesson.start_time);
                    let closerDate 
                    if ((Date.parse(dateStr) > Date.parse(new Date())) && (Date.parse(dateStr) - Date.parse(new Date()) < diff)){ 
                      // debugger
                        closerDate = lessonDate
                        if (closerLesson){
                            if (closerDate < new Date(closerLesson.fact_time).toLocaleDateString()){
                                // setCloserLesson(lesson)
                            }
                        }else{
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
                                }).then(res =>{
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
                var lessonsFuture = lessons.filter(el => (new Date() - new Date(el.personal_time).getTime() < 0)) 
                var temp = lessonsFuture.map(d => Math.abs(new Date() - new Date(d.personal_time).getTime()));
                var withoutNan = temp.filter(function(n) { return !isNaN(n)}) 
                var idx = withoutNan.indexOf(Math.min(...withoutNan)); 
                if (lessonsFuture[idx] != undefined) {
                  let curr_hours = new Date(lessonsFuture[idx]?.personal_time).getHours();
                  let curr_minutes = new Date(lessonsFuture[idx]?.personal_time).getMinutes();
                  student.closer_date = new Date(lessonsFuture[idx]?.personal_time).toLocaleDateString()
                  student.curr_hours = curr_hours 
                  student.curr_minutes = curr_minutes 
                  student.lesson_date = new Date(lessonsFuture[idx]?.personal_time).toLocaleDateString() 
                } else {
                  let curr_hours = undefined
                  let curr_minutes = undefined
                  student.closer_date = undefined
                  student.curr_hours = undefined
                  student.curr_minutes = undefined
                  student.lesson_date = undefined
                }
                 
                // setCloserLesson(lessonsFuture[idx]) 
                // let lessonIsGoingHandler = lessons.find(el => new Date().getTime() - new Date(el.personal_time ? el.personal_time : el.start_time).getTime() <= 3600000)
                 
                // setCloserLesson(lessonIsGoingHandler ? lessonIsGoingHandler : lessonsFuture[idx]) 
            })
            setAllStudentsLessons(lessonsOfAllStudents)
            }
           );
        if (!studentsLoaded) {
            setStudents(teacherStudents['data'])
            setStudentsLoaded(true)
        }
        setDataLoaded(true) 
        console.log('programs', programs)
        console.log('students', students)
                // setCheckIsLoaded(true)
      }

    const createEmptyProgram = async () => { 
        const emptyProgramTitle = 'emptyProgram'
        const data = {
          emptyProgramTitle,
          emptyProgramCourseId,
          emptyProgramTeacherId, 
        }; 

        await axios({
          method: "post",
          url: `${globals.productionServerDomain}/createEmptyProgram`,
          data: data,
        })
          .then(function (res) {
            alert("Программа успешно создана"); 
          })
          .catch((err) => {
            alert("Произошла ошибка");
          });
      };

    const updateStudentProgram = async (studentId, courseId, programId) => { 
        const data = {
          studentId,
          courseId,
          programId
        }; 

        await axios({
          method: "put",
          url: `${globals.productionServerDomain}/updateStudentProgram`, 
          data: data,
        })
          .then(function (res) {
            alert("Программа успешно изменена"); 
          })
          .catch((err) => {
            alert("Произошла ошибка");
          });
      };

    const personalLink = async (studentId, prigramId) => {
        const redirectUrl = `${encodeURIComponent(props.url)}/homeworks?programId=${encodeURIComponent(prigramId)}&studentId=${encodeURIComponent(studentId)}`
        
        await router.push(redirectUrl)
    }

    const startLessonLink = async (translationLink) => {
        loadTeacherData()
        const role = 'teacher'
        const redirectUrl = `/lesson?room=${encodeURIComponent(translationLink)}&role=${role}`
        
        await router.push(redirectUrl)
    }

    const startNewLesson = async () => {
        let alphabet = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789";
        let roomKey = "";
        while (roomKey.length < 12) {
            roomKey += alphabet[Math.floor(Math.random() * alphabet.length)];
        }
        if (closerLesson.personal_time){
            let data = {
                lessonId: closerLesson.id,
                lessonKey: roomKey,
                studentId: closerLesson.student_id
            }
            await axios({
              method: "put",
              url: `${globals.productionServerDomain}/createPersonalRoom`, 
              data: data,
            })
              .then(function (res) {
                 startLessonLink(roomKey) 
              })
              .catch((err) => {
                alert("Произошла ошибка"); 
              });
        }else{
            let data = {
                lessonId: closerLesson.id,
                lessonKey: roomKey
            }
            await axios({
              method: "put",
              url: `${globals.productionServerDomain}/createDefaultRoom`, 
              data: data,
            })
              .then(function (res) {
                 startLessonLink(roomKey)
              })
              .catch((err) => {
                alert("Произошла ошибка");
              });
        }
    }

    const ultimateSort = async (field) => {
        setSortMode(true)
        currentPosts.sort(byField(field)); 
        loadTeacherData()
    }

    console.log(courses);

    const ultimateSortDate = async (day, hours) => {
      setSortMode(true)
      currentPosts.sort(byFieldDate(day, hours)); 
      loadTeacherData()
  }

    function byField(field) {
      return (a, b) => {
        console.log(a[field], b[field]);
        a[field] > b[field] ? 1 : -1
      };
    }

    function byFieldDate(day, hours) {
      return (a, b) => {
        if (a[day] === b[day]) {
          if (a[hours] > b[hours]) {
            return 1;
          } else {
            return 2;
          }
        } else if (a[day] > b[day]) {
          return 1;
        } else {
          return -1;
        }
        // console.log(a[field], b[field]);
        // a[field] > b[field] ? 1 : -1
      };}
    console.log(programs);

    const getCorrectDeclension = (num) => {
        if (num % 10 === 1 && num % 100 !== 11) {
            return "курс";
        } else if ([2, 3, 4].includes(num % 10) && ![12, 13, 14].includes(num % 100)) {
            return "курса";
        } else {
            return "курсов";
        }
    };

    const getCorrectDeclensionP = (num) => {
        if (num % 10 === 1 && num % 100 !== 11) {
            return "программа";
        } else if ([2, 3, 4].includes(num % 10) && ![12, 13, 14].includes(num % 100)) {
            return "программы";
        } else {
            return "программ";
        }
    };

    const [width, setWidth] = useState();
    const [height, setHeight] = useState();
    useEffect(() => {
      console.log(width, "width");
    }, [width])
  
    useEffect(() => {
      function handleResize() {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
      }
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
    if (typeof localStorage !== "undefined") {
    return (localStorage && teacher.url == localStorage.login ?
      <>
        {showModalLesson ? (
          <>
            <ModalForLessonConfiguration
              showModalLesson={showModalLesson}
              setShowModalLesson={setShowModalLesson}
              student={studentForModal}
              updateStudentProgram={updateStudentProgram}
              loadTeacherData={loadTeacherData}
              programs={programs}
            />
          </>
        ) : (
          ""
        )}

        <div style={{ backgroundColor: "#f1faff" }}>
          <HeaderTeacher
            white={true}
            url={props.url}
            teacher={teacher}
            isInMainPage={isInMainPage}
          />
          <div className={styles.cantainer}>
            <GoToLessonWithTimerComponent isTeacher={true} url={props.url} />
            <div className={styles.topBlock}>
              <div className={styles.greetings}>
                <span>Преподаватель</span>
                <h1>
                  {teacher.surname} {teacher.name} {teacher.patronymic}
                </h1>
                <p>
                  Смотрите запланированные занятия в календаре. Персонально
                  отредактируйте программы студентов наблюдайте за их прогрессом
                  по вашей программе. Удобно проводите занятие по
                  запланированной программе и проверяйтя домашние задания
                  студентов.
                </p>
                {/* <p>Занятие №{closerLesson.lesson_number} {closerLesson.title}</p> */}
                <button
                  // onClick={() => {
                  //   closerLesson.personal_lesson_link ||
                  //   closerLesson.default_lesson_link
                  //     ? startLessonLink(
                  //         closerLesson.personal_lesson_link
                  //           ? closerLesson.personal_lesson_link
                  //           : closerLesson.default_lesson_link
                  //       )
                  //     : startNewLesson();
                  // }}
                  className={styles.goToLessonButton}
                  disabled={disableButton}
                  onClick={() => {
                    closerLesson.personal_lesson_link ||
                    closerLesson.default_lesson_link
                    ? startLessonLink(
                        closerLesson.personal_lesson_link
                          ? closerLesson.personal_lesson_link
                          : closerLesson.default_lesson_link
                      )
                    : startNewLesson()
                  }}
                >
                  Перейти к занятию
                </button>
                {closerLesson !== undefined && students.length > 0 && closerStudent != undefined ? 
                <>
                  <p className={styles.closerLessonInfo}>Занятие №{closerLesson.lesson_order} Тема - {closerLesson.title}  </p>
                  <p className={styles.closerLessonInfo}>Студент - {closerStudent?.name} {closerStudent?.surname}</p>
                </>
                : ''}
              </div>
              <div className={styles.calendarBlock}>
                <Calendar2 lessons={lessons} />
              </div>
            </div>

            <div className={styles.programsBlock}>
              <h1>ОБРАЗОВАТЕЛЬНЫЕ КУРСЫ</h1>
              <div className={styles.programsHeader}>
                <span
                  className={classnames(styles.pNumber, styles.pNumberHead)}

                >
                  <input style={{marginRight: '5px'}} type="checkbox" checked={currentCourse === 0 ? true : false} onChange={() => setCurrentCourse(0)}/>
                  №
                </span>
                <span
                  className={classnames(styles.pCourse, styles.pCourseHead)}
                >
                  Название
                </span>
                <span
                  className={classnames(styles.pProgram, styles.pProgramHead)}
                >
                  <Image
                    src="https://realibi.kz/file/846025.png"
                    style={{ marginRight: "8px" }}
                  />
                  Количество программ
                </span>
                <span
                  className={classnames(
                    styles.pLessCount,
                    styles.pLessCountHead
                  )}
                >
                  Прошли курс
                </span>
                <span className={classnames(styles.pDates, styles.pDatesHead)}>
                  Сейчас на курсе
                </span>
                <span className={styles.pEditTitle}>Курс</span>
              </div>
              {courses.length > 0 && (
                  showAllCourses 
                    ? courses.map((course, index) => (
                        <CourseItem 
                          key={course.id}
                          index={index} 
                          course={course} 
                          url={props.url} 
                          onCheck={() => setCurrentCourse(course.id)}
                          checked={currentCourse === course.id}
                        />
                      )) 
                    : <CourseItem 
                        index={0} 
                        course={courses[0]} 
                        url={props.url} 
                        onCheck={() => setCurrentCourse(courses[0].id)} 
                        checked={currentCourse === courses[0]?.id}
                      />
                )}
              <div className={styles.addProgramContainer}>
                {courses.length > 1 && (
                  <div className={styles.moreCourses}>
                    <p>
                      {showAllCourses
                        ? ""
                        : `+ еще ${courses.length - 1} ${getCorrectDeclension(courses.length - 1)}`}
                    </p>
                    <button
                      className={
                        showAllCourses ? styles.settingTitleShow : styles.settingTitleHide
                      }
                      onClick={() => setShowAllCourses(!showAllCourses)}
                    ></button>
                  </div>
                )}
                <button
                  onClick={() => {
                    setAddCourseModalShow(!addCourseModalShow)
                  }}
                  className={styles.addProgram}
                >
                  <Image
                    src="https://realibi.kz/file/316050.png"
                    style={{ marginRight: "8px" }}
                  />
                  Добавить курс
                </button>
              </div>
              <NewCourse show={addCourseModalShow} setShow={setAddCourseModalShow} teacher={teacher} />
              <div style={{marginBottom: '20px'}}></div>
            </div>

            {courses.length > 0 && (
              <div className={styles.programsBlock}>
                <h1>ПРОГРАММЫ ДЛЯ СТУДЕНТОВ</h1>
                <div className={styles.programsHeader}>
                  <span className={classnames(styles.pNumber, styles.pNumberHead)}>
                    №
                  </span>
                  <span className={classnames(styles.pCourse, styles.pCourseHead)}>
                    Курсы
                  </span>
                  <span
                    className={classnames(styles.pProgram, styles.pProgramHead)}
                  >
                    <Image
                      src="https://realibi.kz/file/846025.png"
                      style={{ marginRight: "8px" }}
                    />
                    Учебная программа
                  </span>
                  <span
                    className={classnames(styles.pLessCount, styles.pLessCountHead)}
                  >
                    Кол-во занятий
                  </span>
                  <span className={classnames(styles.pDates, styles.pDatesHead)}>
                    Количество студентов
                  </span>
                  <span className={styles.pEditTitle}>Программа</span>
                </div>
                {programs.length > 0 && (
                  showAllPrograms ? (
                    programs.map((program, index) =>
                      currentCourse === 0 ||
                      currentCourse === program.course_id ? (
                        <ProgramItem
                          key={program.id}
                          index={index}
                          program={program}
                          url={props.url}
                        />
                      ) : null
                    )
                  ) : (
                    <ProgramItem
                      index={0}
                      program={programs[0]}
                      url={props.url}
                    />
                  )
                )}
                <div className={styles.addProgramContainer}>
                  {programs.length > 1 && (
                      <div className={styles.morePrograms}>
                        <p>
                          {showAllPrograms
                            ? ""
                            : `+ еще ${programs.length - 1} ${getCorrectDeclensionP(programs.length - 1)}`}
                        </p>
                        <button
                          className={showAllPrograms ? styles.settingTitleShow : styles.settingTitleHide}
                          onClick={() => setShowAllPrograms(!showAllPrograms)}
                        ></button>
                      </div>
                    )}
                  <button
                    onClick={() => {
                      createEmptyProgram();
                      loadTeacherData();
                    }}
                    className={styles.addProgram}
                  >
                    <Image
                      src="https://realibi.kz/file/316050.png"
                      style={{ marginRight: "8px" }}
                    />
                    Добавить программу
                  </button>
                </div>
                <div style={{marginBottom: '20px'}}></div>
              </div>
            )}

            {programs.length > 0 && (
                <div className={styles.studentsBlock} id={"students"}>
                  <div className={styles.titleContainer}>
                    <h1>СПИСОК СТУДЕНТОВ</h1>
                    <div className={styles.addProgramContainer}>
                  
                      <button
                        onClick={() => {
                          setAddStudentModalShow(!addStudentModalShow)
                        }}
                        className={styles.addProgram}
                      >
                        <Image
                          src="https://realibi.kz/file/316050.png"
                          style={{ marginRight: "8px" }}
                        />
                        Добавить студента
                      </button>
                    </div>
                    <NewStudent show={addStudentModalShow} setShow={setAddStudentModalShow} programs={programs} />
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
                  <div className={styles.studentsHeader}>
                    <span
                      className={classnames(styles.sCourse, styles.sCourseHead)}
                    >
                      Индивидуальная программа
                    </span>
                    <span
                      className={classnames(styles.sFullname, styles.sFullnameHead)}
                    >
                      <Image
                        src="https://realibi.kz/file/51803.png"
                        style={{ marginRight: "8px" }}
                      />
                      Студенты
                    </span>
                    <span
                      className={classnames(
                        styles.sComplietedLessons,
                        styles.sComplietedLessonsHead
                      )}
                    >
                      Пройдено занятий
                    </span>
                    <span
                      className={classnames(
                        styles.sNextLesson,
                        styles.sNextLessonHead
                      )}
                    >
                      Следующее занятие
                    </span>
                    <span className={styles.sProgram}>Настройки</span>
                  </div>
                  {students.length > 0 &&
                      (showAllStudents 
                        ? (sortMode ? studentsList : currentPosts).map((student) => (
                             <StudentItem 
                              student={student} 
                              showModalLesson={showModalLesson} 
                              setShowModalLesson={setShowModalLesson} 
                              setStudentForModal={setStudentForModal} 
                              programs={programs}
                              route={router.query.url}
                            />
                          )) 
                        : <StudentItem 
                            student={sortMode ? studentsList[0] : currentPosts[0]} 
                            showModalLesson={showModalLesson} 
                            setShowModalLesson={setShowModalLesson} 
                            setStudentForModal={setStudentForModal} 
                            programs={programs}
                            route={router.query.url}
                          />
                      )
                    }
                  {students.length <= 0 ? (
                    <div style={{marginBottom: '20px'}}></div>
                  ) : (
                    <Pagination
                      pages={howManyPages}
                      setCurrentPage={setCurrentPage}
                      more={showAllStudents}
                      setMore={setShowAllStudents}
                    />
                  )}
                </div>  
                )}
              </div>

          <Footer />
        </div>
        </>:<></>
    )} else {return <></>}
}


TeacherCabinet.getInitialProps = async (ctx) => { 
  if(ctx.query.url !== undefined) {
      return {
            url: ctx.query.url,
        }
    }else{
        return {};
  }
}


export default TeacherCabinet
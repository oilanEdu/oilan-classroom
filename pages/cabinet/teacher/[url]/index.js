import { useRouter } from "next/router";
import React, {useEffect, useState} from "react";
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

function TeacherCabinet(props) {
    const [teacher, setTeacher] = useState([])
    const [programs, setPrograms] = useState([])
    const [students, setStudents] = useState([])
    const [check, setCheck] = useState(0) 
    const [closerLesson, setCloserLesson] = useState([]) 
    const [days, setDays] = useState('');
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [dataLoaded, setDataLoaded] = useState(false)
    const [lessonsLoaded, setLessonsLoaded] = useState(false)
    const [studentsLoaded, setStudentsLoaded] = useState(false)
    
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

    const [studentsList, setStudentsList] = useState(currentPosts)
    useEffect(() => {
        console.log(studentsList, "studentsList");
    }, [studentsList])
 
    const howManyPages = Math.ceil(students?.length/cardsPerPage)

    const isInMainPage = true
    
    const updateTimer = () => {
        const future = Date.parse(closerLesson.personal_time);
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

      
     
    const router = useRouter() 

    useEffect(() => {
        loadTeacherData()
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
                alert("?????????????????? ????????????");
            });
    }
    
    const loadTeacherData = async () => {
        setStudentsList(currentPosts) 
        let data = props.url 
        let getTeacherByUrl = await axios.post(`${globals.productionServerDomain}/getTeacherByUrl/` + data)
        const teacherIdLocal = getTeacherByUrl['data'][0]?.id
        setEmptyProgramTeacherId(teacherIdLocal)
        let teacherCourses = await axios.post(`${globals.productionServerDomain}/getCoursesByTeacherId/` + teacherIdLocal)
          teacherCourses['data'].forEach(course => { 
            setEmptyProgramCourseId(course.id)
            }
          ); 
        let teacherPrograms = await axios.post(`${globals.productionServerDomain}/getProgramsByTeacherId/` + teacherIdLocal)
        let count = 0
          teacherPrograms['data'].forEach(async program => {
            console.log(program);
            const qtyStudentsInProgram = await axios.post(`${globals.productionServerDomain}/getQtyStudentsInProgram`, program.id);
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
        let teacherStudents = await axios.post(`${globals.productionServerDomain}/getStudentsByTeacherId/`, dataStudents)
        teacherStudents['data'].forEach(async student => {
            // debugger
            student.check = 0
            let diff = 604800000*7
            if (!lessonsLoaded) {loadStudentLessons(student.student_id, student.program_id)}
            let answersCount = 0 
            let studentCheck = 0
            let studentLessons = await axios.get(`${globals.productionServerDomain}/getLessonInfo?course_url=${student.course_url}&program_id=${student.program_id}&student_id=${student.student_id}`).then(res => {
                let lessons = res.data
                res.data.forEach(async lesson => {
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
                let curr_hours = new Date(lessonsFuture[idx].personal_time).getHours();
                let curr_minutes = new Date(lessonsFuture[idx].personal_time).getMinutes();
                student.closer_date = new Date(lessonsFuture[idx].personal_time).toLocaleDateString()
                student.curr_hours = curr_hours 
                student.curr_minutes = curr_minutes 
                student.lesson_date = new Date(lessonsFuture[idx].personal_time).toLocaleDateString()
                if (new Date(lessonsFuture[idx].personal_time).getTime() > new Date(closerLesson.personal_time).getTime()) {
                  setCloserLesson(lessonsFuture[idx]) 
                }
            })
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
            alert("?????????????????? ?????????????? ??????????????"); 
          })
          .catch((err) => {
            alert("?????????????????? ????????????");
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
            alert("?????????????????? ?????????????? ????????????????"); 
          })
          .catch((err) => {
            alert("?????????????????? ????????????");
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
                alert("?????????????????? ????????????"); 
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
                alert("?????????????????? ????????????");
              });
        }
    }

    const ultimateSort = async (field) => {
        setSortMode(true)
        currentPosts.sort(byField(field)); 
        loadTeacherData()
    }

    function byField(field) {
      return (a, b) => a[field] > b[field] ? 1 : -1;
    }

    console.log(programs);

    return (
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
                <span>??????????????????????????</span>
                <h1>
                  {teacher.surname} {teacher.name} {teacher.patronymic}
                </h1>
                <p>
                  ???????????????? ?????????????????????????????? ?????????????? ?? ??????????????????. ??????????????????????
                  ???????????????????????????? ?????????????????? ?????????????????? ???????????????????? ???? ???? ????????????????????
                  ???? ?????????? ??????????????????. ???????????? ?????????????????? ?????????????? ????
                  ?????????????????????????????? ?????????????????? ?? ???????????????????? ???????????????? ??????????????
                  ??????????????????.
                </p>
                {/* <p>?????????????? ???{closerLesson.lesson_number} {closerLesson.title}</p> */}
                <button
                  onClick={() => {
                    closerLesson.personal_lesson_link ||
                    closerLesson.default_lesson_link
                      ? startLessonLink(
                          closerLesson.personal_lesson_link
                            ? closerLesson.personal_lesson_link
                            : closerLesson.default_lesson_link
                        )
                      : startNewLesson();
                  }}
                >
                  ?????????????? ?? ??????????????
                </button>
              </div>
              <div className={styles.calendarBlock}>
                <Calendar2 lessons={lessons} />
              </div>
            </div>

            <div className={styles.programsBlock}>
              <h1>?????????????????? ?????? ??????????????????</h1>
              <div className={styles.programsHeader}>
                <span
                  className={classnames(styles.pNumber, styles.pNumberHead)}
                >
                  ???
                </span>
                <span
                  className={classnames(styles.pCourse, styles.pCourseHead)}
                >
                  ??????????
                </span>
                <span
                  className={classnames(styles.pProgram, styles.pProgramHead)}
                >
                  <Image
                    src="https://realibi.kz/file/846025.png"
                    style={{ marginRight: "8px" }}
                  />
                  ?????????????? ??????????????????
                </span>
                <span
                  className={classnames(
                    styles.pLessCount,
                    styles.pLessCountHead
                  )}
                >
                  ??????-???? ??????????????
                </span>
                <span className={classnames(styles.pDates, styles.pDatesHead)}>
                  ???????????????????? ??????????????????
                </span>
                <span className={styles.pEditTitle}>??????????????????</span>
              </div>
              {programs.map((program, index) => (
                <>
                  <ProgramItem index={index} program={program} url={props.url} />
                </>
              ))}
              <div className={styles.addProgramContainer}>
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
                  ???????????????? ??????????????????
                </button>
              </div>
            </div>

            <div className={styles.studentsBlock} id={"students"}>
              <div className={styles.titleContainer}>
                <h1>???????????? ??????????????????</h1>
                <ClickAwayListener onClickAway={() => setShowSort(false)}>
                  <div className={styles.sortContainer}>
                    <div
                      onClick={() => setShowSort(!showSort)}
                      className={styles.sortTitle}
                    >
                      <span
                        className={showSort ? styles.sortShow : styles.sortHide}
                      >
                        ??????????????????????
                      </span>
                    </div>
                    <div
                      className={styles.sortOptions}
                      style={{ display: showSort ? "flex" : "none" }}
                    >
                      <span onClick={() => ultimateSort("lesson_date")}>
                        ?????????????????? ??????????????
                      </span>
                      <span onClick={() => ultimateSort("surname")}>
                        ???? ????????????????
                      </span>
                      <span onClick={() => ultimateSort("course_title")}>
                        ???? ????????????
                      </span>
                      <span onClick={() => ultimateSort("program_title")}>
                        ???? ????????????????????
                      </span>
                    </div>
                  </div>
                </ClickAwayListener>
              </div>
              <div className={styles.studentsHeader}>
                <span
                  className={classnames(styles.sCourse, styles.sCourseHead)}
                >
                  ???????????????????????????? ??????????????????
                </span>
                <span
                  className={classnames(styles.sFullname, styles.sFullnameHead)}
                >
                  <Image
                    src="https://realibi.kz/file/51803.png"
                    style={{ marginRight: "8px" }}
                  />
                  ????????????????
                </span>
                <span
                  className={classnames(
                    styles.sComplietedLessons,
                    styles.sComplietedLessonsHead
                  )}
                >
                  ???????????????? ??????????????
                </span>
                <span
                  className={classnames(
                    styles.sNextLesson,
                    styles.sNextLessonHead
                  )}
                >
                  ?????????????????? ??????????????
                </span>
                <span className={styles.sProgram}>????????????????????</span>
              </div>
              {(sortMode ? studentsList : currentPosts).map((student) => (
                <div className={styles.student}>
                  <span className={styles.sCourse}>
                    {student.course_title} ({student.program_title})
                  </span>
                  <span
                    className={styles.sFullname}
                    onClick={() => {
                      personalLink(student.student_id, student.program_id);
                    }}
                  >
                    <div className={styles.studentCage}>
                      <span>
                        <Image
                          src="https://realibi.kz/file/142617.png"
                          style={{ marginRight: "8px", width: "40px" }}
                        />
                      </span>
                      <div className={styles.idAndName}>
                        <span className={styles.name}>
                          {student.surname} {student.name} {student.patronymic}
                        </span>
                        <span className={styles.id}>
                          id:{" "}
                          {"0".repeat(7 - String(student.student_id).length) +
                            student.student_id}
                        </span>
                      </div>
                    </div>
                  </span>
                  <span className={styles.sComplietedLessons}>
                    <div className={styles.progressLine}>
                      <div
                        className={styles.studentProgress}
                        style={{
                          width: student.progress
                            ? student.progress + "%"
                            : "0" + "%",
                        }}
                      ></div>
                    </div>
                    {student.check ? student.check : "0"} ????{" "}
                    {student.lessons_count ? student.lessons_count : ""}
                  </span>
                  <span className={styles.sNextLesson}>
                    <span>{student.closer_date}</span>
                    <span>
                      {student.curr_hours != undefined ? (
                        <>
                          {student.curr_hours < 10
                            ? "0" + student.curr_hours
                            : student.curr_hours}
                          :
                          {student.curr_minutes < 10
                            ? "0" + student.curr_minutes
                            : student.curr_minutes}
                          -
                          {student.curr_hours == 23
                            ? "00"
                            : student.curr_hours + 1 < 10
                            ? "0" + (student.curr_hours + 1)
                            : student.curr_hours + 1}
                          :
                          {student.curr_minutes < 10
                            ? "0" + student.curr_minutes
                            : student.curr_minutes}
                        </>
                      ) : (
                        "?????????????????? ?????????????? ???? ??????????????????????????"
                      )}
                    </span>
                  </span>
                  <div className={styles.sConfigureWrapper}>
                    <span
                      className={styles.sConfigure}
                      onClick={() => {
                        setShowModalLesson(!showModalLesson);
                        setStudentForModal(student);
                      }}
                    >
                      ??????????????????
                    </span>
                    <div className={styles.sConfigureGear}></div>
                  </div>
                </div>
              ))}
              {students.length <= 0 ? (
                <></>
              ) : (
                <Pagination
                  pages={howManyPages}
                  setCurrentPage={setCurrentPage}
                />
              )}
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
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
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
// import CalendarComponent from "../../../../src/components/Calendar/CalendarComponent.js";
import classnames from "classnames";
import Pagination from "../../../../src/components/Pagination/Pagination";

function TeacherCabinet(props) {
    const [teacher, setTeacher] = useState([])
    const [programs, setPrograms] = useState([])
    const [students, setStudents] = useState([])
    const [check, setCheck] = useState(0)
    const [closerLesson, setCloserLesson] = useState([])
    
    const [emptyProgramCourseId, setEmptyProgramCourseId] = useState(0)
    const [emptyProgramTeacherId, setEmptyProgramTeacherId] = useState(0)
    
    const [lessons, setLessons] = useState([''])
    const [showModalLesson, setShowModalLesson] = useState(false)
    const [studentForModal, setStudentForModal] = useState()

    const [showSort, setShowSort] = useState(false);
    const [sortType, setSortType] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [cardsPerPage] = useState(10);

    const indexOfLastPost = currentPage * cardsPerPage;
    const indexOfFirstPost = indexOfLastPost - cardsPerPage;
    const currentPosts = students?.slice(indexOfFirstPost, indexOfLastPost)
    const howManyPages = Math.ceil(students?.length/cardsPerPage)
    
     
    const router = useRouter() 

    useEffect(() => {
        console.log(router)
        console.log('PROPS', props)
        loadTeacherData()
    }, []) 
    
    const loadStudentLessons = async (studentId, programId) => {
        const data = {
            studentId,
            programId
        };
        console.log('studentId, programId', studentId, programId)
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
        console.log('lessonsURL', lessons)
    }
    
    
    const loadTeacherData = async () => {
        let data = props.url 
        let getTeacherByUrl = await axios.post(`${globals.productionServerDomain}/getTeacherByUrl/` + data)
        const teacherIdLocal = getTeacherByUrl['data'][0]?.id
        setEmptyProgramTeacherId(teacherIdLocal)
        let teacherCourses = await axios.post(`${globals.productionServerDomain}/getCoursesByTeacherId/` + teacherIdLocal)
        teacherCourses['data'].forEach(course => { 
            setEmptyProgramCourseId(course.id)
        }); 
        let teacherPrograms = await axios.post(`${globals.productionServerDomain}/getProgramsByTeacherId/` + teacherIdLocal)
        let count = 0
          teacherPrograms['data'].forEach(program => {  
            count += 1 
            program.number = count
             setEmptyProgramCourseId(program.course_id)
            }
           ); 
        const dataStudents = {
            id: teacherIdLocal,
            sort: sortType
        }
        let teacherStudents = await axios.post(`${globals.productionServerDomain}/getStudentsByTeacherId/`, dataStudents)
        setTeacher(getTeacherByUrl['data'][0])
        setPrograms(teacherPrograms['data'])
        teacherStudents['data'].forEach(student => {
        console.log('checks', student.check)
            loadStudentLessons(student.student_id, student.program_id) 
            let answersCount = 0 
            let studentCheck = 0
            let studentLessons = axios.post(`${globals.productionServerDomain}/getLessonsByProgramId/` + student.program_id).then(res => {
                let lessons = res.data
                lessons.forEach(lesson => {
                    // student.check = 0 
                    let currentDate = new Date().toLocaleDateString()
                    let lessonDate = new Date(lesson.personal_time ? lesson.personal_time : lesson.start_time).toLocaleDateString()
                    let dateStr = new Date(lesson.start_time);
                    let closerDate
                    let diff = 604800000
                    if ((lessonDate > currentDate) && (Date.parse(new Date(lesson.personal_time ? lesson.personal_time : lesson.start_time)) - Date.parse(new Date()) < diff)){
                        diff = Date.parse(new Date()) - Date.parse(new Date(lesson.personal_time ? lesson.personal_time : lesson.start_time))
                        closerDate = lessonDate
                        let curr_hours = dateStr.getHours();
                        let curr_minutes = dateStr.getMinutes();
                        student.closer_date = closerDate 
                        student.curr_hours = curr_hours 
                        student.curr_minutes = curr_minutes 

                    }
                    let lessonExercises = axios.post(`${globals.productionServerDomain}/getExercisesByLessonId/` + lesson.id).then(res => {
                        let exercises = res.data
                        if (exercises) {
                            exercises.forEach(exercise => {
                                let studentId = student.student_id 
                                let exerciseId = exercise.id   
                                const data = {
                                  studentId, 
                                  exerciseId 
                                };
                                let exerciseAnswers = axios({ 
                                  method: "post",
                                  url: `${globals.productionServerDomain}/getAnswersByStudExId`,
                                  data: data,
                                }).then(res =>{
                                    let answers = res.data
                                    answers.forEach(answer => {
                                        answersCount += 1 
                                    })
                                    if ((exercises.length > 0) && (exercises.length == answersCount)){
                                        student.check += 1 
                                        studentCheck += 1
                                        console.log('studentCheck', studentCheck)
                                        setCheck(student.check)
                                        student.check = studentCheck  
                                        student.progress = 100/student.lessons_count*student.check
                                    }  
                                    else{ 
                                        setCheck(0) 
                                        studentCheck = 0
                                        student.check = 0
                                        student.progress = '0'
                                    }
                                })
                            })
                        }
                    })
                })   
            })
            }
           );  
        console.log('try', teacherStudents['data'])
        setStudents(teacherStudents['data'])
        console.log('programs', programs)
        console.log('students', students) 
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

    const sortABC = async () => {
        const dataStudents = {
            id: emptyProgramTeacherId,
            sort: "oc_students.surname"
        }
        let teacherStudents = await axios.post(`${globals.productionServerDomain}/getStudentsByTeacherId/`,  dataStudents)
        setStudents(teacherStudents['data'])
    }

    const sortCourse = async () => {
        const dataStudents = {
            id: emptyProgramTeacherId,
            sort: "oc_programs.title"
        }
        let teacherStudents = await axios.post(`${globals.productionServerDomain}/getStudentsByTeacherId/`,  dataStudents)
        setStudents(teacherStudents['data'])
    };

    return ( 
        <>
                {showModalLesson ? <>
          <ModalForLessonConfiguration showModalLesson={showModalLesson} 
                                       setShowModalLesson={setShowModalLesson}
                                         student={studentForModal} 
                                         updateStudentProgram={updateStudentProgram} 
                                         loadTeacherData={loadTeacherData}
                                         programs={programs}
            /> 
        </> : ''}
            
            <div style={{backgroundColor: "#f1faff"}}>
              <HeaderTeacher white={true} url={props.url} teacher={teacher} />
              <div className={styles.cantainer}>
                
                <div className={styles.topBlock}>
                    <div className={styles.greetings}>
                        <span>Преподаватель</span>
                        <h1>{teacher.surname} {teacher.name} {teacher.patronymic}</h1>
                        <p>Смотрите запланированные занятия в календаре. Персонально отредактируйте программы студентов наблюдайте за их прогрессом по вашей программе. Удобно проводите занятие по запланированной программе и проверяйтя домашние задания студентов.</p>
                        <button>Перейти к занятию</button>
                    </div>
                    <div className={styles.calendarBlock}>
                         <Calendar2 lessons={lessons}/> 
                    </div>
                </div>

                <div className={styles.programsBlock}>
                    <h1>ПРОГРАММЫ ДЛЯ СТУДЕНТОВ</h1>
                    <div className={styles.programsHeader}>
                        <span className={classnames(styles.pNumber, styles.pNumberHead)}>№</span>
                        <span className={classnames(styles.pCourse, styles.pCourseHead)}>Курсы</span>
                        <span className={classnames(styles.pProgram, styles.pProgramHead)}>
                            <Image 
                                src='https://realibi.kz/file/846025.png'
                                style={{marginRight: '8px'}}
                            />
                            Индивидуальная программа
                        </span>
                        <span className={classnames(styles.pLessCount, styles.pLessCountHead)}>Кол-во занятий</span>
                        <span className={classnames(styles.pDates, styles.pDatesHead)}>Даты начала и конца</span>
                        <span className={styles.pEditTitle}>Программа</span>  
                    </div>
                    {programs.map(program => (
                    <div className={styles.program}>
                        <span className={styles.pNumber}>№{program.number}</span>
                        <span className={styles.pCourse}>{program.course_title}</span>
                        <span className={styles.pProgram}>
                            <Image 
                                src='https://realibi.kz/file/846025.png'
                                style={{marginRight: '8px'}}
                            />
                            {program.title}
                        </span>
                        <span className={styles.pLessCount}>{program.lessons_count} занятий</span>
                        <span className={styles.pDates}>
                            <span>{new Date(program.start_date).toLocaleDateString()}</span> 
                            <span>{new Date(program.end_date).toLocaleDateString()}</span>
                        </span>
                        <span className={styles.pEdit}>
                            <Link
                                href={`${encodeURIComponent(props.url)}/editProgram/?programId=${encodeURIComponent(program.id)}`}
                                target="_blank"
                            >
                            Редактировать
                            </Link>
                            <Image 
                                src='https://realibi.kz/file/109637.png'
                                style={{marginLeft: '8px'}}
                            />
                        </span> 
                    </div>
                    ))} 
                    <div className={styles.addProgramContainer}>  
                        <button    
                            onClick={() => {
                                createEmptyProgram()
                                loadTeacherData()
                                }
                            }
                            className={styles.addProgram}
                        >
                            <Image 
                                src='https://realibi.kz/file/316050.png'
                                style={{marginRight: '8px'}}
                            />
                            Добавить программу
                        </button>
                    </div>
                </div>

                <div className={styles.studentsBlock} id={"students"}>
                    <div className={styles.titleContainer}>
                        <h1>СПИСОК СТУДЕНТОВ</h1>
                        <div>
                            <div 
                                onClick={() => setShowSort(!showSort)}
                                className={styles.sortTitle}
                            >
                                <span className={showSort ? styles.sortShow : styles.sortHide}>
                                   Сортировать 
                                </span>
                            </div>
                            <div className={styles.sortOptions} style={{display: showSort ? "flex" : "none"}}>    
                                <span>Следующие занятие</span>
                                <span onClick={() => sortABC()}>По алфавиту</span>
                                <span onClick={() => sortCourse()}>По курсам</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.studentsHeader}>
                        <span className={classnames(styles.sCourse, styles.sCourseHead)}>Индивидуальная программа</span>
                        <span className={classnames(styles.sFullname, styles.sFullnameHead)}>
                            <Image 
                                src='https://realibi.kz/file/51803.png'
                                style={{marginRight: '8px'}}
                            />
                            Студенты
                        </span>
                        <span className={classnames(styles.sComplietedLessons, styles.sComplietedLessonsHead)}>Пройдено занятий</span>
                        <span className={classnames(styles.sNextLesson, styles.sNextLessonHead)}>Следующее занятие</span>
                        <span className={styles.sProgram}>Программа</span>
                    </div>
                    {currentPosts.map(student => ( 
                        <div className={styles.student}>
                            <span className={styles.sCourse}>{student.course_title} ({student.program_title})</span>
                            <span 
                                className={styles.sFullname}
                                onClick={() => {
                                    personalLink(student.student_id, student.program_id)
                                }}
                            >
                                <div className={styles.studentCage}>
                                    <span>
                                        <Image 
                                            src='https://realibi.kz/file/142617.png'
                                            style={{marginRight: '8px', width: "40px"}}
                                        /> 
                                    </span>
                                    <div className={styles.idAndName}>
                                        <span className={styles.name}>{student.surname} {student.name} {student.patronymic}</span>
                                        <span className={styles.id}>id: {"0".repeat(7 - String(student.student_id).length) + student.student_id}</span>
                                    </div>
                                </div>
                            </span>
                            <span className={styles.sComplietedLessons}>
                                <div className={styles.progressLine}>
                                    <div className={styles.studentProgress} 
                                        style={{width: student.progress + '%'}}  
                                    >
                                    </div>
                                </div>
                                {student.check} из {student.lessons_count} 
                            </span>
                            <span className={styles.sNextLesson}>
                                <span>{student.closer_date}</span>
                                <span>{student.curr_hours}:{student.curr_minutes}-{(student.curr_hours == 23)?'00':student.curr_hours + 1}:{student.curr_minutes}</span>
                            </span>
                            <div className={styles.sConfigureWrapper}>
                            <span className={styles.sConfigure}
                                  onClick={() => {setShowModalLesson(!showModalLesson)
                                                  setStudentForModal(student)}}>
                              {/* вот это должно быть в модалке */}
                                {/* <select
                                onChange={(e) => {
                                    updateStudentProgram(student.student_id, student.course_id, e.target.value)
                                    loadTeacherData()
                                 }
                                }
                                value="0">
                                  <option value="0" disabled>Выбрать</option>
                                  {programs.map(program => program.course_id == student.course_id?(
                                    <option value={program.id}>{program.title}</option>
                                      ):(<></>)
                                    )}
                                </select> */}
                                Настроить
                            </span>
                            <div className={styles.sConfigureGear}>

                            </div>
                            </div>
                        </div>
                    ))} 
                    <Pagination pages = {howManyPages} setCurrentPage={setCurrentPage}/>
                </div>
              </div>
              <Footer />
            </div>
        </>
    )
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
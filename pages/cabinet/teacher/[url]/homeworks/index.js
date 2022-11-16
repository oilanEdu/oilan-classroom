import { useRouter } from "next/router";
import React, {useEffect, useState} from "react";
import globals from "../../../../../src/globals";
import styles from "./styles.module.css";
import axios from "axios";
import { Image } from "react-bootstrap";
import Footer from "../../../../../src/components/Footer/Footer";
import HeaderTeacher from "../../../../../src/components/HeaderTeacher/HeaderTeacher";
import classnames from 'classnames';

function Homeworks(props) {
	
	const router = useRouter()
	const teacherUrl = router.query.url
    const studentId = router.query.studentId
    const programId = router.query.programId
    const [teacher, setTeacher] = useState([])
    const [students, setStudents] = useState([])
    const [selectedStudentId, setSelectedStudentId] = useState(studentId)
    const [selectedProgramId, setSelectedProgramId] = useState(programId)
    const [selectedExerciseId, setSelectedExerciseId] = useState(0)
    const [selectedExerciseNumber, setSelectedExerciseNumber] = useState(0)
    const [selectedExerciseText, setSelectedExerciseText] = useState('')
    const [selectedExerciseCorrectAnswer, setSelectedExerciseCorrectAnswer] = useState('')
    const [answer, setAnswer] = useState([])
    const [programs, setPrograms] = useState([])
    const [lessons, setLessons] = useState([])
    const [exercises, setExercises] = useState([])
    const [showCheck, setShowCheck] = useState(0)
    const [teacherComment, setTeacherComment] = useState('')
    console.log('teacherUrl',teacherUrl)
    console.log('studentId',studentId)
    console.log('programId',programId)

    console.log(teacher);

    useEffect(() => {
        loadBaseData()
        loadPrograms(selectedStudentId)
        loadStudentLessons(selectedStudentId, selectedProgramId)
    }, []) 

    const loadBaseData = async () => {
    	let data = props.url 
        let getTeacherByUrl = await axios.post(`${globals.productionServerDomain}/getTeacherByUrl/` + data).then(async res => {
            // const teacherIdLocal = res.data[0]?.id
            let teacherStudents = await axios.post(`${globals.productionServerDomain}/getStudentsByTeacherId/` + {id: res.data[0]?.id});
            setTeacher(res.data[0])
            setStudents(teacherStudents.data)
        })
        const teacherIdLocal = getTeacherByUrl['data'][0]?.id
        // let teacherStudents = await axios.post(`${globals.productionServerDomain}/getStudentsByTeacherId/` + teacherIdLocal)
        // setTeacher(getTeacherByUrl['data'][0])
        // setStudents(teacherStudents['data'])
        console.log('teacher', teacher)
        console.log('students', students)
    }

    const loadPrograms = async (studentId) => {
        const studentPrograms = await axios.post(`${globals.productionServerDomain}/getProgramsByStudentId/` + studentId)
        setPrograms(studentPrograms['data'])
        if (studentPrograms['data'].length == 1){
            programs.forEach(program => {
                setSelectedProgramId(program.id)
            })
            loadStudentLessons(selectedStudentId, selectedProgramId)
        }
        console.log('programs', programs)
    }

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
                if (lesson.personal_time){
                    lesson.fact_time = lesson.personal_time
                }else{
                    lesson.fact_time = lesson.start_time
                }
                let strDate = new Date(lesson.fact_time)
                let curr_hours = strDate.getHours();
                let curr_minutes = strDate.getMinutes(); 
                lesson.out_date = new Date(strDate).toLocaleDateString() 
                lesson.out_hours = curr_hours
                lesson.out_minutes = curr_minutes
            })
            setLessons(res.data)
          })
          .catch((err) => {
            alert("Произошла ошибка");
          });
        console.log('lessons', lessons) 
    }

    const getLessonExercises = async (selectedLesson) => {
        let exer_number = 0
        let lessonExercises = axios.post(`${globals.productionServerDomain}/getExercisesByLessonId/` + selectedLesson).then(res => {
            res.data.forEach(exercise => {
                let studentId = selectedStudentId
                let exerciseId = exercise.id
                let data = {
                  studentId,
                  exerciseId
                };
                console.log('data',data)
                let exerciseAnswer = axios({ 
                  method: "post",
                  url: `${globals.productionServerDomain}/getAnswersByStudExId`,
                  data: data,
                })
                  .then(function (res) {
                    if (res.data[0]){
                        console.log('EXE', res.data[0].status)
                        exercise.answer_status = res.data[0].status
                    }else{
                        console.log('ответов нет')
                    }
                  })
                  .catch((err) => {
                    alert("Произошла ошибка");
                  });
                exer_number += 1
                exercise.exer_number = exer_number
            })
            setExercises(res.data)
            console.log('exercises', exercises)
        }
        )
    }

    const getAnswer = async (studentId, exerciseId) => {
        const data = {
          studentId,
          exerciseId
        };
        await axios({
          method: "post",
          url: `${globals.productionServerDomain}/getAnswersByStudExId`,
          data: data,
        })
          .then(function (res) {
            setAnswer(res.data[0])
          })
          .catch((err) => {
            alert("Произошла ошибка");
          });
        console.log('answer', answer)
    }

    const updateAnswerStatus = async (id, status) => {
        const data = {
          id,
          status
        }; 

        await axios({
          method: "put",
          url: `${globals.productionServerDomain}/updateAnswerStatus`,
          data: data,
        })
          .then(function (res) {
            alert("Отметка о выполнении изменена"); 
          })
          .catch((err) => {
            alert("Произошла ошибка"); 
          });
    }

    const updateAnswerComment = async (id, comment) => {
        const data = {
          id,
          comment
        }; 

        await axios({
          method: "put",
          url: `${globals.productionServerDomain}/updateAnswerComment`,
          data: data,
        })
          .then(function (res) {
            alert("Комментарий отправлен"); 
          })
          .catch((err) => {
            alert("Произошла ошибка"); 
          });
    }

    console.log(students);

	return ( 
        <>
            <div style={{backgroundColor: "#f1faff", width: '120%'}}>
                <HeaderTeacher white={true} teacher={teacher}/>

              	<div className={styles.cantainer}>
              		<div className={styles.selectBlock}>
              		    <h1>Домашние задания</h1>
                        <div>
                            <div>
                                {selectedStudentId}
                            </div> 
                            <div>
                                {students.map(student => (
                                    <option value={student.student_id}>
                                        {student.surname} {student.name} {student.patronymic}
                                    </option>
                                ))}
                            </div>
                        </div>

                        <select
                            value={selectedStudentId} 
                            onChange={(e) => {
                                setSelectedStudentId(e.target.value)
                                loadPrograms(selectedStudentId)
                                console.log('selectedStudentId', selectedStudentId)
                            }}
                        >
                            <option className={styles.studentOptions} value="0" selected>
                                Студенты
                            </option>
                            {students.map(student => (
                                <option value={student.student_id}>
                                    {student.surname} {student.name} {student.patronymic}
                                </option>
                            ))}
                        </select>
                        <select 
                            value={selectedProgramId}
                            onChange={(e) => {
                                setSelectedProgramId(e.target.value)
                                value={programId}
                                loadStudentLessons(selectedStudentId, selectedProgramId)
                                console.log('selectedProgramId', selectedProgramId)
                                }
                            }
                        >
                            <option value="0" disabled selected>
                                Программы
                            </option>
                            {programs.map(program => (
                                <option value={program.id}>
                                    {program.course_title} ({program.title})
                                </option>
                                ))}
                        </select>
                        <button 
                            className={styles.reloadButton}
                                onClick={() => {
                                loadBaseData()
                                loadPrograms(selectedStudentId)
                                loadStudentLessons(selectedStudentId, selectedProgramId)
                        }}>
                            &#128472;
                        </button>
              		</div>

                    <div className={styles.lessons}>
                        {lessons.map(lesson => (
                            <div className={styles.lesson}>
                                <div className={styles.lessonTopRow}>
                                    <div className={styles.primeLessonInfo}>
                                        <span className={styles.lessonNumber}>№{lesson.lesson_number}</span>
                                        <span className={styles.lessonDatetime}>
                                            <span>{lesson.out_date}</span>
                                            <span>
                                                {lesson.out_hours>9?lesson.out_hours:'0'+lesson.out_hours}:{lesson.out_minutes>9?lesson.out_minutes:'0'+lesson.out_minutes}-{(lesson.out_hours == 23)?'00':lesson.out_hours>9?lesson.out_hours + 1:'0'+(lesson.out_hours+1)}:{lesson.out_minutes>9?lesson.out_minutes:'0'+lesson.out_minutes}
                                                <Image 
                                                    src='https://realibi.kz/file/109637.png'
                                                    style={{marginLeft: '8px'}}
                                                />
                                            </span>
                                        </span>
                                        <span className={styles.lessonTitle}>
                                            <Image 
                                                src='https://realibi.kz/file/846025.png'
                                                style={{marginRight: '8px'}}
                                            />
                                            {lesson.title}
                                        </span>
                                    </div>
                                    <div 
                                        className={classnames(styles.plusButton, (showCheck === lesson.id) ? styles.minus : styles.plus)}
                                        onClick={() => {
                                            getLessonExercises(lesson.id)
                                            setShowCheck(lesson.id)
                                            setSelectedExerciseId(0)
                                            setAnswer(null)
                                            setTeacherComment(null)
                                        }}
                                    ></div>
                                </div>
                                <div 
                                    className={styles.detailInfo}
                                    style={(showCheck == lesson.id)?{display: 'flex'}:{display: 'none'}}
                                >
                                    <div className={styles.bricksRow}>
                                        <span> {exercises.length > 0 ? "Задание" : ""}</span>
                                        {exercises.map(exercise => (
                                            <div style={exercise.id == selectedExerciseId?{display:'flex', padding: '2px', border: '3px solid #007AFF', borderRadius: '8px', marginRight: '20px', marginBottom: '5px', marginTop: '5px'}:{display:'flex', padding: '2px', border: '3px solid white', borderRadius: '8px', marginRight: '20px', marginBottom: '5px', marginTop: '5px'}}>
                                                <div 
                                                    className={exercise.answer_status?exercise.answer_status == 'not verified'?styles.exerBrickWhite:exercise.answer_status == 'correct'?styles.exerBrickGreen:styles.exerBrickRed:styles.exerBrickWhite}
                                                    onClick={() => {
                                                        setSelectedExerciseId(exercise.id)
                                                        setSelectedExerciseNumber(exercise.exer_number)
                                                        setSelectedExerciseText(exercise.text)
                                                        setSelectedExerciseCorrectAnswer(exercise.correct_answer)
                                                        getAnswer(selectedStudentId, exercise.id)
                                                    }}
                                                >
                                                    {exercise.exer_number}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {(selectedExerciseId > 0)&&
                                    <div className={styles.answerBlock}>
                                        <span className={styles.exerciseText}>{selectedExerciseNumber}) {selectedExerciseText}</span>
                                        <div className={styles.checkRow}>
                                            <span className={styles.studentsAnswer}>
                                                {answer?'Ответ студента: ' + answer.text:<i>(студент еще не дал ответа на текущее задание)</i>}
                                            </span>    
                                            <button 
                                                style={answer?{display: 'flex'}:{display: 'none'}} 
                                                className={answer?answer.status == 'correct'?styles.disabledButton:styles.correctButton:styles.correctButton}
                                                onClick={() => {
                                                    updateAnswerStatus(answer.id, 'correct')
                                                }}
                                                disabled={answer?answer.status == 'correct'?true:false:false}
                                            >
                                                &#10003;
                                            </button>
                                            <button 
                                                className={answer?answer.status == 'uncorrect'?styles.disabledButton:styles.uncorrectButton:styles.uncorrectButton}
                                                style={answer?{display: 'flex'}:{display: 'none'}} 
                                                onClick={() => {
                                                    updateAnswerStatus(answer.id, 'uncorrect')
                                                }}
                                                disabled={answer?answer.status == 'uncorrect'?true:false:false}
                                            >
                                                &#10008;
                                            </button>
                                        </div>   
                                        <span className={styles.correctAnswer}>
                                            <Image 
                                                src='https://realibi.kz/file/108886.png'
                                                style={{marginRight: '10px'}}
                                            />
                                            Правильный ответ - {selectedExerciseCorrectAnswer}
                                        </span>     
                                    </div>
                                    }
                                    <div style={answer?{display: 'flex'}:{display: 'none'}} className={styles.commentBlock}>
                                        <span>Оставить комментарий</span>
                                        <textarea 
                                            className={styles.teacherComment}
                                            placeholder="Оставьте краткое пояснение по домашнему заданию студента"
                                            onChange={e => {
                                                setTeacherComment(e.target.value)
                                            }}
                                        >
                                        </textarea>
                                        <button
                                            className={styles.sendButton}
                                            onClick={() => {
                                                updateAnswerComment(answer.id, teacherComment)
                                            }}
                                            disabled={teacherComment == '' ? true : false}
                                        >
                                            Отправить
                                        </button>
                                    </div>
                                </div>
                            </div>
                            )
                        )}
                    </div>
              	</div>
              	
              	<Footer />
            </div>
        </>
       )
}

Homeworks.getInitialProps = async (ctx) => {
	console.log('lol',ctx)
    if(ctx.query.url !== undefined) {
        return {
            url: ctx.query.url,
        }
    }else{
        return {};
    }
}

export default Homeworks
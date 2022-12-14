import { useRouter } from "next/router";
import React, {useEffect, useState, useRef} from "react";
import globals from "../../src/globals";
import styles from "./lesson.module.css";
import axios from "axios";
import { Image } from "react-bootstrap";
import Footer from "../../src/components/Footer/Footer";
import HeaderTeacher from "../../src/components/HeaderTeacher/HeaderTeacher";
import classnames from 'classnames';
// import socket from "../../src/socket";
// import ACTIONS from "../../src/socket/actions";
// import useWebRTC, {LOCAL_VIDEO} from '../../src/hooks/useWebRTC';

function Lesson(props) {
  
  const router = useRouter()
  const teacherUrl = router.query.url
    const room = router.query.room
    const role = router.query.role
    const [teacher, setTeacher] = useState([])
    const [student, setStudent] = useState([])
    const [lesson, setLesson] = useState([])
    const [rooms, updateRooms] = useState([])
    const [exercises, setExercises] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [numberOfEx, setNumberOfEx] = useState(0)
    const [selectedExerciseId, setSelectedExerciseId] = useState(0)
    const [selectedExerciseNumber, setSelectedExerciseNumber] = useState(0)
    const [selectedExerciseText, setSelectedExerciseText] = useState('')
    const [selectedExerciseCorrectAnswer, setSelectedExerciseCorrectAnswer] = useState('')
    const [answer, setAnswer] = useState('') 
    const [teacherComment, setTeacherComment] = useState('')
    // const {clients, provideMediaRef} = useWebRTC(room)
    // const rootNode = useRef();
    
    // console.log('teacherUrl',teacherUrl)
    // console.log('room',room)
    // console.log('clients',clients)

    // useWebRTC(room)

    useEffect(() => {
        loadBaseData() 
        if (role == 'teacher'){
          loadTeacherData()
        }
        if (role == 'student'){
          loadStudentData()
        }
        // socket.on(ACTIONS.SHARE_ROOMS, ({rooms = []} = {}) => {
        //     if (rootNode.current){
        //         updateRooms(rooms);
        //     }
        // }) 
    }, []) 

    const loadBaseData = async () => {
        let data = room
        let getLessonByRoomKey = await axios.post(`${globals.productionServerDomain}/getLessonByRoomKey/` + data)
        setLesson(getLessonByRoomKey['data'][0])
        console.log('LESSON',lesson)
        getLessonExercises()
    }

    const loadTeacherData = async () => {
      let data = room
      let getStudentByLessonKey = await axios.post(`${globals.productionServerDomain}/getStudentByLessonKey/` + data)
        setStudent(getStudentByLessonKey['data'][0])
        console.log('student',student)  
    }

    const loadStudentData = async () => {
      let data = room
      let getTeacherByLessonKey = await axios.post(`${globals.productionServerDomain}/getTeacherByLessonKey/` + data)
        setTeacher(getTeacherByLessonKey['data'][0])
        console.log('teacher',teacher)
    }

    const getLessonExercises = async (selectedLesson) => {
        let exer_number = 0
        let lessonExercises = await axios.post(`${globals.productionServerDomain}/getExercisesByLessonId/` + lesson.lesson_id).then(res => {
            res.data.forEach(async exercise => {
                let studentId = student.student_id
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
                setNumberOfEx(exer_number)
                setIsLoaded(true)
            })
            setExercises(res.data) 
            console.log('exercises', exercises)
        }
        )
        setIsLoaded(true) 
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

  return ( 
        <>
            <div style={{backgroundColor: "#f1faff", width: '120%'}} 
            // ref={rootNode}
            >
                <HeaderTeacher white={true} teacher={teacher}/>

                <div className={styles.cantainer}>
                  Room: {room} / Role: {role}
                    {/* <div className={styles.translationBlock}>
                        {clients.map((clientID) => {
                            return (
                                <div key={clientID} className={styles.personVideo}>
                                    <video
                                        className={styles.video}
                                        ref={instance => {
                                            provideMediaRef(clientID, instance);
                                        }}
                                        autoPlay
                                        playsInline
                                        muted={clientID === LOCAL_VIDEO}
                                    />
                                </div>
                                )
                        })}   
                    </div> */}
                    <div>  
                      {(role == 'teacher')?
                        (<>
                          <div>
                            Студент - {student.name} {student.surname}
                          </div>
                          <div>
                            Занятие №{lesson.lesson_order} {lesson.title}
                          </div>
                          <div>
                            <h1>О занятии</h1>
                            <p>{lesson.tesis}</p>
                          </div>
                          <div className={styles.bricksRow}>
                            <span> {exercises.length > 0 ? "Домашние задания" : ""}</span>
                            {numberOfEx == exercises.length ? <> {exercises.map(exercise => (
                                <div style={exercise.id == selectedExerciseId?{display:'flex', padding: '2px', border: '3px solid #007AFF', borderRadius: '8px', marginRight: '20px', marginBottom: '5px', marginTop: '5px'}:{display:'flex', padding: '2px', border: '3px solid #f1faff', borderRadius: '8px', marginRight: '20px', marginBottom: '5px', marginTop: '5px'}}>
                                    <div 
                                        className={exercise.answer_status?exercise.answer_status == 'not verified'?styles.exerBrickWhite:exercise.answer_status == 'correct'?styles.exerBrickGreen:styles.exerBrickRed:styles.exerBrickWhite}
                                        onClick={async () => {
                                            await getAnswer(student.student_id, exercise.id)
                                            setSelectedExerciseId(exercise.id)
                                            setSelectedExerciseNumber(exercise.exer_number)
                                            setSelectedExerciseText(exercise.text)
                                            setSelectedExerciseCorrectAnswer(exercise.correct_answer)
                                            
                                        }}
                                    >
                                        {exercise.exer_number}
                                    </div>
                                </div>
                            ))}</> : ''}
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
                                          onClick={async() => {
                                              await updateAnswerStatus(answer.id, 'correct')
                                              await getAnswer(student.student_id, selectedExerciseId)
                                              await getLessonExercises(lesson.lesson_id)
                                          }}
                                          disabled={answer?answer.status == 'correct'?true:false:false}
                                      >
                                          &#10003;
                                      </button> 
                                      <button 
                                          className={answer?answer.status == 'uncorrect'?styles.disabledButton:styles.uncorrectButton:styles.uncorrectButton}
                                          style={answer?{display: 'flex'}:{display: 'none'}} 
                                          onClick={async() => {
                                              await updateAnswerStatus(answer.id, 'uncorrect')
                                              await getAnswer(student.student_id, selectedExerciseId)
                                              await getLessonExercises(lesson.lesson_id)
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
                        </>):
                        (role == 'student')?
                          (<>
                            <div>
                              Преподаватель - {teacher.name} {teacher.surname}
                            </div>
                            <div>
                              Занятие №{lesson.lesson_order} {lesson.title}
                            </div>
                            <div>
                              <h1>О занятии</h1>
                              <p>{lesson.tesis}</p>
                            </div>
                          </>):
                          (<></>)
                      }
                    </div>
                </div>
                
                <Footer />
            </div>
        </>
       )
}

Lesson.getInitialProps = async (ctx) => {
  console.log('lol',ctx)
    if(ctx.query.url !== undefined) {
        return {
            url: ctx.query.url,
        }
    }else{
        return {};
    }
}

export default Lesson
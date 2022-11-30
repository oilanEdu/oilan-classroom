import { useRouter } from "next/router";
import React, {useEffect, useState, useRef} from "react";
import globals from "../../src/globals";
import styles from "./lesson.module.css";
import axios from "axios";
import { Image } from "react-bootstrap";
import Footer from "../../src/components/Footer/Footer";
import HeaderTeacher from "../../src/components/HeaderTeacher/HeaderTeacher";
import classnames from 'classnames';
import socket from "../../src/socket";
import ACTIONS from "../../src/socket/actions";
import useWebRTC, {LOCAL_VIDEO} from '../../src/hooks/useWebRTC';

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
    const {clients, provideMediaRef} = useWebRTC(room)
    const rootNode = useRef();
    
    console.log('teacherUrl',teacherUrl)
    console.log('room',room)
    console.log('clients',clients)

    useWebRTC(room)

    useEffect(() => {
        loadBaseData()
        if (role == 'teacher'){
          loadTeacherData()
        }
        if (role == 'student'){
          loadStudentData()
        }
        socket.on(ACTIONS.SHARE_ROOMS, ({rooms = []} = {}) => {
            if (rootNode.current){
                updateRooms(rooms);
            }
        }) 
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
                let studentId = student.id
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

  return ( 
        <>
            <div style={{backgroundColor: "#f1faff", width: '120%'}} ref={rootNode}>
                <HeaderTeacher white={true} teacher={teacher}/>

                <div className={styles.cantainer}>
                  Room: {room} / Role: {role}
                    <div className={styles.translationBlock}>
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
                    </div>
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
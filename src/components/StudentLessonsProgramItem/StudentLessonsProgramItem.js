import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./StudentLessonsProgramItem.module.css";
import axios from "axios";
import globals from "../../../src/globals";

const StudentLessonsProgramItem = ({lesson, courseUrl, nickname}) => {
  const [showTesis, setShowTesis] = useState(false);
  const [exercises, setExercises] = useState([])
  const [answers, setAnswers] = useState([])
  const [teacherComments, setTeacherComments] = useState([])
  let isActive = (new Date(lesson.start_time).getTime()) <= (new Date().getTime());
  const router = useRouter() 

  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
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

  const getLessonExercises = async (selectedLesson) => {
        let exer_number = 0
        let counter = 0
        let lessonExercises = axios.post(`${globals.productionServerDomain}/getExercisesByLessonId/` + selectedLesson).then(res => {
            res.data.forEach(exercise => {

                let studentId = lesson.student_id
                let exerciseId = exercise.id
                let data = {
                  studentId,
                  exerciseId
                };
                console.log('data',data)
                let exerciseAnswer = axios({
                  method: "post",
                  url: `${globals.productionServerDomain}/getTeacherCommentsByStudExId`,
                  data: data,
                })
                  .then(function (res) {
                    if (res.data[0]){
                        counter += 1
                        res.data.forEach(item => { 
                          item.exer_number = counter
                         })
                        
                        // setTeacherComments(res.data)
                        setTeacherComments(teacherComments => [...teacherComments, ...res.data])
                        // setLessons(lessons => [...lessons, ...res.data])
                        // console.log('EXE', res.data[0].status)
                        // exercise.answer_status = res.data[0].status
                        // exercise.teacher_comment = res.data[0].comment 
                    }else{
                        console.log('ответов нет')
                    }
                  })
                  .catch((err) => {
                    alert("Произошла ошибка");   
                  });
                // exer_number += 1
                // exercise.exer_number = exer_number
            })
            setExercises(res.data)
            console.log('exercises', exercises)
        }
        )
    }

  useEffect(() => { 
    getLessonExercises(lesson.id)
  }, []);
  
  return <div key={lesson.id} className={styles.lesson}> 
    <div>
      <div className={styles.lesson_content}>
        <p className={styles.lesson_order}>№ {lesson.number}</p>
        <p className={styles.lesson_date} style={{display: width >= 480 ? "block" : "none"}}>{new Date(lesson.personal_time?lesson.personal_time:lesson.start_time).toLocaleDateString()}</p>
        <p className={styles.lesson_time} style={{display: width >= 480 ? "block" : "none"}}>{new Date(lesson.personal_time?lesson.personal_time:lesson.start_time).toLocaleTimeString().slice(0, 5)}</p>
        <p className={styles.lesson_content_title}>{lesson.title}</p>
        <p 
          style={{
            display: width >= 480 ? "block" : "none",  background: +lesson.score === 0 ? "#CAE3FF" : +lesson.score < 50 ? "#EA6756" : +lesson.score < 80 ? "#F8D576" : "#74C87D"
          }}
          className={styles.lesson_grade}
        >
          Оценка - {lesson.score} ({lesson.done_exer}/{lesson.all_exer})
        </p>
        {isActive
          ? <span 
            style={{display: width >= 480 ? "none" : "block"}}
            className={styles.open} 
            onClick={() => {
              setShowTesis(!showTesis)
              }
            }
          ></span>
          : <span
            className={styles.block} 
          ></span>
        }
        {/* <p 
          style={{
            background: +lesson.score === 0 ? "#CAE3FF" : +lesson.score < 50 ? "#EA6756" : +lesson.score < 80 ? "#F8D576" : "#74C87D"
          }}
          className={styles.lesson_score}
        >
          + {lesson.score * 10} ₸
        </p> */}
      </div>
      <div className={styles.lesson_tesis} style={{display: showTesis ? "block" : "none"}}>
        <div className={styles.mobileDatesWrapper}>
          <p className={styles.lesson_date} style={{display: width >= 480 ? "none" : "block"}}>{new Date(lesson.personal_time?lesson.personal_time:lesson.start_time).toLocaleDateString()}</p>
          <p className={styles.lesson_time} style={{display: width >= 480 ? "none" : "block"}}>{new Date(lesson.personal_time?lesson.personal_time:lesson.start_time).toLocaleTimeString().slice(0, 5)}</p>

        </div>
        <p 
          style={{
            display: width >= 480 ? "none" : "block",  background: +lesson.score === 0 ? "#CAE3FF" : +lesson.score < 50 ? "#EA6756" : +lesson.score < 80 ? "#F8D576" : "#74C87D"
          }}
          className={styles.lesson_grade}
        >
          Оценка - {lesson.score} ({lesson.done_exer}/{lesson.all_exer})
        </p>
        <span>{lesson.tesis}</span>
        <span>Задания:{
          exercises.map(exercise => {
            return <>
              <span>{exercise.text}</span>
            </>
          })
        }</span>
        <span style={{marginBottom: "0px"}}>Обратная связь:</span>{
          teacherComments.map(comment => {
            return <div className={styles.comment}>
              <span>{comment.exer_number}) {comment.text}</span>
              <span className={styles.commentDate}>{comment.date?.toLocaleString().substring(0, 10)} {comment.date?.toLocaleString('ru', { hour12: false }).substring(11, 16)}</span>  
            </div> 
          })
        }
        <button 
          onClick={() => {
            router.push(`/cabinet/student/${nickname}/course/${courseUrl}/homeworks`);
          }} 
          className={styles.resendButton}
        >{+lesson.done_exer === 0 || lesson.done_exer === "0"? "Сдать тему" : "Пересдать тему"}</button>
      </div>
    </div>
    {isActive
      ? <span 
        style={{display: width >= 480 ? "block" : "none"}}
        className={styles.open} 
        onClick={() => {
          setShowTesis(!showTesis)
        }
      }
      ></span>
      : <span
        className={styles.block} 
      ></span>
    }
  </div>
};

export default StudentLessonsProgramItem;
import { useEffect, useState } from "react";
import StudentLessonsProgramItem from "../StudentLessonsProgramItem/StudentLessonsProgramItem";
import styles from "./NewStudentLessonsProgram.module.css";

const NewStudentLessonsProgram = ({ lessons, courseUrl, nickname }) => {

  const [doneLessons, setDoneLessons] = useState([]);
  const [done, setDone] = useState(0);
  let lessonsCount = 0

  useEffect(() => {
    setDoneLessons([]);
    lessons.forEach(lesson => {
      lessonsCount += 1
      lesson.number = lessonsCount
      if (+lesson.score > 0) {
        setDoneLessons(prevState => {
          return [
            ...prevState,
            lesson
          ]
        });
      }
    });
    console.log(lessons, "lessonsStudentLessonsProgram");
  }, []);

  useEffect(() => {
    setDone((100 * doneLessons.length) / lessons.length);
  }, [doneLessons]);

  useEffect(() => {
    lessons.map((el) => {
      console.log(Number.isInteger(el.number / 3), "lessons.map StudentsLessonsProgramRounds");
    })
  }, [])

  return <div className={styles.container}>

    <h2 id="programs">Программа курса</h2>
    <div className={styles.programWrapper}>
      {lessons.map(lesson => {
        return <div key={lesson.id} className={styles.programms_uploaded}>
          <div className={styles.programRow}>
            <div className={styles.programTitle}>
              <p className={styles.lesson_order}>
                Урок {lesson.number}:
                <span> {lesson.title}</span>
              </p>
            </div>
            <div className={styles.programSchedule}>
              <p className={styles.lesson_content_title}>{lesson.tesis}</p>
            </div>

            <div className={styles.programStatistics}>
              <p className={styles.lesson_date} >
                {new Date(lesson.personal_time ? lesson.personal_time : lesson.start_time).toLocaleDateString()}
              </p>
              <p>
                {new Date(lesson.personal_time ? lesson.personal_time : lesson.start_time).toLocaleTimeString().slice(0, 5)}-{(new Date(lesson.personal_time ? lesson.personal_time : lesson.start_time).getHours() + 1).toString().padStart(2, "0")}:{new Date(lesson.personal_time ? lesson.personal_time : lesson.start_time).getMinutes().toString().padStart(2, "0")}
              </p>
            </div>


            {/* <p 
            // style={{
            //   display: width >= 480 ? "block" : "none",  background: +lesson.score === 0 ? "#CAE3FF" : +lesson.score < 50 ? "#EA6756" : +lesson.score < 80 ? "#F8D576" : "#74C87D"
            // }}
            className={styles.lesson_grade}
          >
            Оценка - {lesson.score} ({lesson.done_exer}/{lesson.all_exer})
          </p> */}
            {/* {isActive
            ? <span 
              className={styles.open} 
              onClick={() => {
                setShowTesis(!showTesis)
                }
              }
            ></span>
            : <span
              style={{display: width >= 480 ? "none" : "block"}}
              className={styles.block} 
            ></span>
          } */}
            {/* <p 
            style={{
              background: +lesson.score === 0 ? "#CAE3FF" : +lesson.score < 50 ? "#EA6756" : +lesson.score < 80 ? "#F8D576" : "#74C87D"
            }}
            className={styles.lesson_score}
          >
            + {lesson.score * 10} ₸
          </p> */}
          </div>
          {/* <div className={styles.lesson_tesis} style={{display: showTesis ? "block" : "none"}}>
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
        </div> */}
          {/* {isActive
        ? <span 
          style={{display: width >= 480 ? "block" : "none"}}
          className={styles.open} 
          onClick={() => {
            setShowTesis(!showTesis)
          }
        }
        ></span>
        : <span
          style={{display: width >= 480 ? "block" : "none"}}
          className={styles.block} 
        ></span>
      } */}
        </div>
      })}
    </div>
  </div >
};

export default NewStudentLessonsProgram;
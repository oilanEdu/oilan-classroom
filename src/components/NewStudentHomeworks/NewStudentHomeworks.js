import { useEffect, useState } from "react";
import NewLessonExercisesForStudent from "../NewLessonExercisesForStudent/NewLessonExercisesForStudent";
import styles from "./NewStudentHomeworks.module.css";
import axios from "axios";
import globals from "../../globals";

const NewStudentHomeworks = ({index, lesson, student}) => {
  const [showTesis, setShowTesis] = useState(false);
  let isActive = (new Date(lesson.start_time).getTime()) <= (new Date().getTime());

  const [exercises, setExercises] = useState([])

  const fetchData = async () => {
    let counter = 0
    await axios.get(`${globals.productionServerDomain}/getLessonExercises?lesson_id=${lesson.id}&student_id=${student}`).then(res3 => {
      
      res3.data.forEach(item => {
        counter += 1
        item.exer_number = counter
      })
      setExercises(res3.data);
    });
  };

  useEffect(() => {
    fetchData();
    if (index === 0) {
      setShowTesis(true)
    }
    console.log(exercises)
  }, []);

  return <div key={lesson.id} className={styles.lesson}>
    <h2>Домашние задания</h2>
    <div>
      <div className={styles.lesson_content}>
        <p className={styles.lesson_order}>Урок {lesson.lesson_order}:
          <span> {lesson.title}</span>
        </p>
        {/* <p className={styles.lesson_date}>{new Date(lesson.personal_time).toLocaleDateString()}</p>
        <p className={styles.lesson_time}>{new Date(lesson.personal_time).toLocaleTimeString().slice(0, 5)}</p> */}
        {/* <p className={styles.lesson_content_title}>{lesson.title}</p> */}
        <p className={styles.lesson_grade} >
          Оценка - {lesson.teacher_mark?lesson.teacher_mark:'0'} ({lesson.done_exer}/{lesson.all_exer})
        </p>
        {isActive
          ? <button 
            className={showTesis ? styles.close : styles.open} 
            onClick={() => setShowTesis(!showTesis)}
          >{showTesis ? "-" : "+"} </button>
          : <span
            className={styles.block} 
          ></span>
        }
      </div>
      <p className={styles.lesson_tesis} style={{display: showTesis ? "block" : "none"}}>
        {exercises.length > 0 ? <NewLessonExercisesForStudent exercises={exercises} student={student} fetchData={fetchData}/> : ''}
      </p>
    </div>
  </div>
};

export default NewStudentHomeworks;
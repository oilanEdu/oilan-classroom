import { useEffect, useState } from "react";
import LessonExercisesForStudent from "../LessonExercisesForStudent/LessonExercisesForStudent";
import styles from "./StudentHomeworks.module.css";
import axios from "axios";
import globals from "../../globals";

const StudentHomeworks = ({lesson, student}) => {
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
    console.log(exercises)
  }, []);

  return <div key={lesson.id} className={styles.lesson}>
    <div>
      <div className={styles.lesson_content}>
        <p className={styles.lesson_order}>№ {lesson.lesson_order}</p>
        <p className={styles.lesson_date}>{new Date(lesson.start_time).toLocaleDateString()}</p>
        <p className={styles.lesson_time}>{new Date(lesson.start_time).toLocaleTimeString().slice(0, 5)}</p>
        <p className={styles.lesson_content_title}>{lesson.title}</p>
        <p 
          style={{
            background: +lesson.score === 0 ? "#CAE3FF" : +lesson.score < 50 ? "#EA6756" : +lesson.score < 80 ? "#F8D576" : "#74C87D"
          }}
          className={styles.lesson_grade}
        >
          Оценка - {lesson.score} ({lesson.done_exer}/{lesson.all_exer})
        </p>
        <p 
          style={{
            background: +lesson.score === 0 ? "#CAE3FF" : +lesson.score < 50 ? "#EA6756" : +lesson.score < 80 ? "#F8D576" : "#74C87D"
          }}
          className={styles.lesson_score}
        >
          + {lesson.score * 10} ₸
        </p>
      </div>
      <p className={styles.lesson_tesis} style={{display: showTesis ? "block" : "none"}}>
        <LessonExercisesForStudent exercises={exercises} student={student}/>
      </p>

    </div>
    {isActive
      ? <span 
        className={showTesis ? styles.close : styles.open} 
        onClick={() => setShowTesis(!showTesis)}
      ></span>
      : <span
        className={styles.block} 
      ></span>
    }
  </div>
};

export default StudentHomeworks;
import { useEffect, useState } from "react";
import NewLessonExercisesForStudent from "../NewLessonExercisesForStudent/NewLessonExercisesForStudent";
import styles from "./NewStudentHomeworks.module.css";
import axios from "axios";
import globals from "../../globals";

const NewStudentHomeworks = ({ index, lesson, student }) => {
  const [showTesis, setShowTesis] = useState(false);
  let isActive = lesson.personal_time ? (new Date(lesson.personal_time).getTime()) <= (new Date().getTime())  : (new Date(lesson.start_time).getTime()) <= (new Date().getTime());

  const [exercises, setExercises] = useState([])

  const fetchData = async () => {
    let counter = 0
    await axios.get(`${globals.productionServerDomain}/getLessonExercises?lesson_id=${lesson.id}&student_id=${student}`).then(res3 => {

      res3.data.forEach(item => {
        counter += 1
        item.exer_number = counter
      })
      setExercises(res3.data);
      debugger
    });
  };

  useEffect(() => {
    fetchData();
    if (index === 0) {
      setShowTesis(true)
    }
    console.log(exercises)
  }, []);

  return <div className={styles.wrapperAll}>
    <div key={lesson.id} className={styles.lesson}>
      <div>
        <div className={styles.lesson_content}>
          <div className={styles.lesson_order_wrapper}>
            <p className={styles.lesson_order}>Урок {lesson.lesson_order}:
              <span> {lesson.title}</span>
            </p>
          </div>
          <div className={styles.lesson_grade_wrapper}>
            <p className={styles.lesson_grade} >
              Оценка - {lesson.teacher_mark ? lesson.teacher_mark : '0'} ({lesson.done_exer}/{lesson.all_exer})
            </p>
          </div>
        </div>
        <p className={styles.lesson_tesis} style={{ display: showTesis ? "block" : "none" }}>
          {exercises.length > 0 ? <NewLessonExercisesForStudent lesson={lesson} exercises={exercises} student={student} fetchData={fetchData} /> : ''}
        </p>
      </div>
    </div>
    {isActive
      ? <button
        id={styles.plusButton}
        className={showTesis ? styles.close : styles.open}
        onClick={() => setShowTesis(!showTesis)}
      >{showTesis ? "-" : "+"} </button>
      : <span
        className={styles.block}
      ></span>
    }
  </div>
};

export default NewStudentHomeworks;
import { useEffect, useState } from "react";
import StudentLessonsProgramItem from "../StudentLessonsProgramItem/StudentLessonsProgramItem";
import styles from "./StudentLessonsProgram.module.css";

const StudentLessonsProgram = ({lessons, courseUrl, nickname}) => {

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
    <h2>Пройдено {+done.toFixed(2)} % курса</h2>
    <div className={styles.course_lessons}>
      {lessons.map(lesson => {
        return <>
          <div>
            <span className={+lesson.score > 0 ? styles.lesson_item_done : styles.lesson_item}>{+lesson.score > 0 ? null : lesson.number}</span>
            <p className={styles.lesson_date}>{+lesson.score > 0 ? "Пройден" : lesson.personal_time?new Date(lesson.personal_time).toLocaleDateString():new Date(lesson.start_time).toLocaleDateString()}</p>
          </div>
          {/* {Number.isInteger(lesson.number / 3) ? null :  */}
          <p className={styles.order_line}></p>
          {/* } */} 
        </>
      })}
    </div>
    
    <h2 id="programs">Программа курса</h2>

    {lessons.map(lesson => {
      return <StudentLessonsProgramItem courseUrl={courseUrl} nickname={nickname} lesson={lesson}/>
    })}
  </div>
};

export default StudentLessonsProgram;
import styles from "./LessonContain.module.css";

const LessonContain = ({student, lessons}) => {
  return <div className={styles.container}>
    <p className={styles.teach}>Преподаватель - <b>{student.teach_name} {student.teach_surname}</b></p>
    <p className={styles.lesson}>Занятие №{lessons[0]?.lesson_order}  <b>{lessons[0]?.title}</b></p>
    <h3 className={styles.lesson_title}>О занятие</h3>
    <p className={styles.lesson_text}>{lessons[0]?.tesis}</p>
  </div>
};

export default LessonContain;
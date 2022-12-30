import styles from "./LessonContain.module.css";

const LessonContain = ({role, user, lesson}) => {
  return <div className={styles.container}>
    <p className={styles.teach}>{role === "teacher" ? "Студент" : "Преподаватель"} - {user?.name} {user?.surname}</p>
    <p className={styles.lesson}>Занятие №{lesson?.lesson_order} {lesson?.title}</p>
    <h3 className={styles.lesson_title}>О занятии</h3>
    <p className={styles.lesson_text}>{lesson?.tesis}</p>
  </div>
};

export default LessonContain;
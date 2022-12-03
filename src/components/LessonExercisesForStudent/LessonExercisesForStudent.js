import { useEffect, useState } from "react";
import styles from "./LessonExercisesForStudent.module.css";
import axios from "axios";
import globals from "../../globals";

const LessonExercisesForStudent = ({exercises, student, bg}) => {
  const [ active, setActive ] = useState(null);
  const [ answer, setAnswer ] = useState('')
  const [ editMode, setEditMode ] = useState(false)
  const [ teacherComments, setTeacherComments ] = useState([])

  console.log(exercises)
  console.log(student)
  const openExer = e => setActive(+e.target.dataset.index);
  useEffect(() => {
    if (active != null) {
      let studentId = student
      let exerciseId = exercises[active].id
      let data = {
        studentId,
        exerciseId
      };
      let exerciseAnswer = axios({
        method: "post",
        url: `${globals.productionServerDomain}/getTeacherCommentsByStudExId`,
        data: data,
      })
        .then(function (res) {
          if (res.data[0]){
              setTeacherComments(res.data)
              // console.log('EXE', res.data[0].status)
              // exercise.answer_status = res.data[0].status
              // exercise.teacher_comment = res.data[0].comment 
          }else{
              console.log('ответов нет')
              setTeacherComments([])
          }
        })
        .catch((err) => {
          alert("Произошла ошибка");   
        });
    }
  }, [active])
  
  const sendAnswer = async (answerText, lessonId, exerciseId, studentId, status) => {
    const data = {
          answerText,
          lessonId,
          exerciseId,
          studentId,
          status
        };
        console.log(data)
        await axios({
          method: "post",
          url: `${globals.productionServerDomain}/createAnswer`,
          data: data,
        })
          .then(function (res) {
            alert("Ответ на задание успешно отправлен"); 
          })
          .catch((err) => {
            alert("Произошла ошибка");
          });
  }

  const sendEditedAnswer = async (answerText, answerId, status) => {
    const data = {
          answerText,
          answerId,
          status
        };
        console.log(data)
        await axios({
          method: "put",
          url: `${globals.productionServerDomain}/updateStudentAnswer`,
          data: data,
        })
          .then(function (res) {
            alert("Ответ на задание успешно изменен"); 
            setEditMode(false)
          })
          .catch((err) => {
            alert("Произошла ошибка");
          });
  }

  return <div styles={{ backgroundColor: bg}} className={styles.container}>
    <div className={styles.exercises}>
      <h3 className={styles.exercises_title}>Домашние задания</h3>
      {exercises.map((exer, i) => {
        return <div className={exercises[active]?.id == exer.id?styles.blueBrickBorder:styles.whiteBrickBorder}>
          <div 
            className={exer.answer_status == 'correct'?styles.correctExercise:exer.answer_status == 'uncorrect'?styles.uncorrectExercise:styles.emptyExercise} 
            onClick={openExer}
            data-index={i}
          >
            {exer.exer_number}
          </div>
        </div>
      })}
    </div>
    {exercises[active] && <div>
      {!exercises[active].answer_text?
      (
        <>
          <p className={styles.answer_text}>
            {exercises[active].exer_number}) {exercises[active].text} 
          </p>
          <div>
            <input 
              type="text" 
              className={styles.answer} 
              placeholder="Ответ"
              onChange={e => {
                setAnswer(e.target.value)
                console.log(answer)
              }}
            />
            <button 
              className={styles.answer_btn}
              onClick={() => {
                sendAnswer(answer, exercises[active].lesson_id, exercises[active].id, student, 'not verified')
              }}
            >
              Ответить
            </button>
          </div>
        </>
      ):
      (<>
          <div className={styles.reTryBlock}>
            <span>Задание: {exercises[active].text}</span>
            <span>Ваш ответ: {exercises[active].answer_text}</span>
            <div className={styles.advice}>{exercises[active].answer_status == 'correct'?<><div className={styles.correctAdvice}></div>Сдано на отлично</>:exercises[active].answer_status == 'uncorrect'?<><><div className={styles.uncorrectAdvice}></div>Есть ошибки попробуйте снова</></>:''}</div>
            <button 
              className={styles.reanswer_btn}
              onClick={() => {
                setEditMode(true)
              }}
            >
              Изменить ответ
            </button>
            {editMode?
              (
              <>
                <div className={styles.editAnswerBlock}>
                  <div>
                    <input 
                      type="text" 
                      className={styles.answer} 
                      placeholder="Ответ"
                      onChange={e => {
                        setAnswer(e.target.value)
                        console.log(answer)
                      }}
                    />
                    <button 
                      className={styles.answer_btn}
                      onClick={() => {
                        sendEditedAnswer(answer, exercises[active].answer_id, 'not verified')
                      }}
                    >
                      Ответить
                    </button>
                  </div>
                </div>
              </>):(<></>)
            }
            <div>
              <div className={styles.teacherComment}><img src="https://realibi.kz/file/108886.png" className={styles.mailLogo}/><span>Комментарий преподователя:</span></div>
              {teacherComments.map(comment => {
              return <div className={styles.comment}>
              <span>{comment.text}</span>
              <span className={styles.commentDate}>{comment.date?.toLocaleString().substring(0, 10)} {comment.date?.toLocaleString('ru', { hour12: false }).substring(11, 16)}</span>  
            </div> 
          })}
            </div>
          </div>
      </>)
    }
    </div>}
  </div>
};

export default LessonExercisesForStudent;
import { useEffect, useState } from "react";
import styles from "./NewLessonExercisesForStudent.module.css";
import axios from "axios";
import globals from "../../globals";

const NewLessonExercisesForStudent = ({ fetchData, exercises, student, bg, padding, brickBorder, lesson }) => {
  const [active, setActive] = useState(0);
  const [answer, setAnswer] = useState('')
  const [comment, setComment] = useState('');
  const [editMode, setEditMode] = useState(false)
  const [teacherComments, setTeacherComments] = useState([])
  const [symbols, setSymbols] = useState(1500);
  const [exerciseText, setExerciseText] = useState([])
  function linkify(text) {
    var url_pattern = /(https?:\/\/\S+)/g;
    let test = text?.split(url_pattern)
    setExerciseText(test)
  }

  const openExer = e => setActive(+e.target.dataset.index);
  useEffect(() => {

    if (active != null) {
      let studentId = student
      let exerciseId = exercises[active]?.id
      let data = {
        studentId,
        exerciseId
      };
      debugger
      let exerciseAnswer = axios({
        method: "post",
        url: `${globals.productionServerDomain}/getTeacherCommentsByStudExId`,
        data: data,
      })
        .then(function (res) {
          if (res.data[0]) {
            setTeacherComments(res.data)
            debugger
          } else {
            console.log('ответов нет')
            setTeacherComments([])
            debugger
          }
        })
        .catch((err) => {
          alert("Произошла ошибка");
        });

      linkify(exercises[active]?.text)
    }
    setAnswer('')
    setComment('')
  }, [active])

  const sendAnswer = async (answerText, lessonId, exerciseId, studentId, status, comment) => {
    const data = {
      answerText,
      lessonId,
      exerciseId,
      studentId,
      status,
      comment
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

  const sendEditedAnswer = async (answerText, answerId, status, comment) => {
    const data = {
      answerText,
      answerId,
      status, 
      comment
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

  const onKeyDownHandler = (e) => {
    if (e.keyCode === 8) {
      if (symbols === 1500) {

      } else if (answer.length >= 0 || answer !== "") {
        setSymbols(symbols + 1)
      }
    } else {
      if (answer.length < 1500 && symbols !== 0) {
        setSymbols(symbols - 1)
      }
    }
  }

  const [width, setWidth] = useState();
  const [height, setHeight] = useState();
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

  const saveLessonDateAndTime = async (dateAndTimeMerger, lesson_id, course_id, student_id) => {
    debugger 
    if (dateAndTimeMerger) {
      debugger
      const dataForGetSchedule = {
        lesson_id,
        course_id,
        student_id
      };
      console.log("dataForGetSchedule", dataForGetSchedule)
      let schedule = await axios({
        method: "post",
        url: `${globals.productionServerDomain}/getScheduleByLessonIdAndCourseIdAndStudentId`,
        data: dataForGetSchedule,
      }).then(function (res) {
        debugger
        let scheduleRes = res.data
        console.log("scheduleRes", scheduleRes);
        if (scheduleRes.length > 0) {
          return scheduleRes
        }
      })
        .catch((err) => {
          alert("Произошла ошибка");
        });
      console.log(schedule, "schedule1")
      if (schedule != undefined) {
        debugger
        if (schedule.some(el => el.lesson_id == lesson_id) && schedule.some(el => el.course_id == course_id) && schedule.some(el => el.student_id == student_id)) {
          console.log("isscheduleRIGHT is RIGHT")
          const dataForUpdateSchedule = {
            dateAndTimeMerger,
            lesson_id,
            course_id,
            student_id
          };
          // console.log("dataForGetSchedule", dataForGetSchedule)
          let schedule = await axios({
            method: "put",
            url: `${globals.productionServerDomain}/updateSchedule`,
            data: dataForUpdateSchedule,
          })
          debugger
        }
      }
      else {
        debugger
        console.log("isscheduleRIGHT is NOT RIGHT");
        const dataForCreateSchedule = {
          dateAndTimeMerger,
          lesson_id,
          course_id,
          student_id
        };
        debugger
        let schedule = await axios({
          method: "post",
          url: `${globals.productionServerDomain}/createSchedule`,
          data: dataForCreateSchedule,
        })
        debugger
      }
    }
  }
  useEffect(() => {
    exercises
    debugger
  }, [exercises])

  const ExerciseText = (props) => {
    return <>
      {props.exerciseText?.map((el, index) => index % 2 === 0 ? el : <a href={el}>{el}</a>)}
    </>
  }
  return <div style={{ backgroundColor: bg, padding: padding }} className={styles.container}>
    <div>
      <div className={styles.exercises}>
        {exercises.map((exer, i) => {
          return <div
            style={exercises[active]?.id == exer.id
              ? {}
              : { border: brickBorder }
            }
            className={exercises[active]?.id == exer.id
              ? styles.blueBrickBorder
              : styles.whiteBrickBorder
            }
            id={styles.exerItem}
          >
            <div
              className={styles.emptyExercise}
              onClick={openExer}
              data-index={i}
            >
              Задание {exer.exer_number}
            </div>
          </div>
        })}
      </div>
      {exercises[active] && <div>
        {!exercises[active].answer_text ?
          (
            <>
              <div className={styles.input_container}>
                <p className={styles.answer_text}>
                  Задание:
                </p>
                <input value={exerciseText} />
              </div>
              <div className={styles.input_container}>
                <p>Ваш ответ:</p>
                <div className={styles.answer_input}>
                  <textarea
                    className={styles.answer}
                    placeholder="Ответ"
                    value={answer}
                    onChange={e => {
                      if (symbols !== 0 && answer.length <= 1500) {
                        setAnswer(e.target.value)
                        console.log(answer)
                      }
                    }}
                    onKeyDown={(e) => onKeyDownHandler(e)}
                  ></textarea>
                </div>
              </div>
              <div className={styles.input_container}>
                <p>Комментарий для учителя:</p>
                <div className={styles.answer_input}>
                  <textarea
                    className={styles.answer}
                    placeholder="Если вам было что-то не понятно - напишите сюда, мы передадим :)"
                    value={comment}
                    onChange={e => {
                      if (symbols !== 0 && answer.length <= 1500) {
                        setComment(e.target.value)
                        console.log(comment)
                      }
                    }}
                  ></textarea>
                </div>
              </div>
              <button
                className={styles.answer_btn}
                onClick={async () => {
                  await sendAnswer(answer, exercises[active].lesson_id, exercises[active].id, student, 'not verified', comment)
                  await fetchData()
                  debugger
                  if (lesson.personal_time) {
                    
                  } else {
                    saveLessonDateAndTime(new Date(), lesson.id, lesson.course_id, student)
                  }
                  debugger
                }}
              >
                Сохранить и отправить
              </button>
            </>
          ) :
          (<>
            <div className={styles.reTryBlock}>
              {/* {exerciseText.map((el, index) => {
                
              })} */}
              <div className={styles.input_container}>
                Задание:
                <p className={styles.input_container_text_reTry}>
                  <ExerciseText exerciseText={exerciseText} />
                </p>
              </div>
              {/* <span>Задание: {exerciseText.map((el, index) => el)}</span> */}
              <div className={styles.input_container}>
                Ваш ответ:
                <p className={styles.input_container_text_reTry}>Ваш ответ: {exercises[active].answer_text}</p>
              </div>
              <div className={styles.advice}>
                {/* {exercises[active].answer_status == 'correct' ? 
                <><div className={styles.correctAdvice}></div>Сдано на отлично</> 
                : 
                exercises[active].answer_status == 'uncorrect' ? 
                  <><><div className={styles.uncorrectAdvice}></div>Есть ошибки попробуйте снова</></> 
                  : 
                  ''} */}
                  Оценка - {exercises[active].mark}
              </div>
              <button
                className={styles.reanswer_btn}
                onClick={() => {
                  setEditMode(true)
                }}
              >
                Изменить ответ
              </button>
              {editMode ?
                (
                  <>
                    <div className={styles.editAnswerBlock}>
                      <div>
                      <div className={styles.input_container}>
                          <p>Новый ответ</p>
                          <textarea
                            type="text"
                            className={styles.answer}
                            placeholder="Ответ"
                            value={answer}
                            onChange={e => {
                              if (symbols !== 0 && answer.length <= 1500) {
                                setAnswer(e.target.value)
                                console.log(answer)
                              }
                            }}
                            onKeyDown={(e) => onKeyDownHandler(e)}
                          />
                        </div>
                        
                        <div className={styles.input_container}>
                        <p>Комментарий для учителя:</p>
                        <textarea
                          className={styles.answer}
                          placeholder="Если вам было что-то не понятно - напишите сюда, мы передадим :)"
                          value={comment}
                          onChange={e => {
                            if (symbols !== 0 && answer.length <= 1500) {
                              setComment(e.target.value)
                              console.log(comment)
                            }
                          }}
                        ></textarea>
                        </div>
                        <button
                          className={styles.answer_btn}
                          onClick={async () => {
                            await sendEditedAnswer(answer, exercises[active].answer_id, 'not verified', comment)
                            await fetchData()
                            if (lesson.personal_time) {
                    
                            } else {
                              saveLessonDateAndTime(new Date(), lesson.id, lesson.course_id, student)
                            }
                          }}
                        >
                          Сохранить и отправить
                        </button>
                      </div>
                    </div>
                  </>) : (<></>)
              }
              <div>
                <div className={styles.teacherComment}><span>Комментарий преподавателя:</span></div>
                {teacherComments.filter(el => el.text != 0).map(comment => {
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
  </div >
};

export default NewLessonExercisesForStudent;
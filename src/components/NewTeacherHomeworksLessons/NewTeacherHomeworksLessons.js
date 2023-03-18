import React, { useEffect, useState } from "react";
import styles from "./NewTeacherHomeworksLessons.module.css";
import { Image } from "react-bootstrap";
import classnames from 'classnames';
import axios from "axios";
import globals from "../../globals";

const NewTeacherHomeworksLessons = ({ index, lesson, showCheck, selectedExerciseId, answer, setShowCheck, setSelectedExerciseId, setAnswer, setSelectedExerciseNumber, setSelectedExerciseText, setSelectedExerciseCorrectAnswer, getAnswer, selectedStudentId, selectedExerciseNumber, selectedExerciseCorrectAnswer, updateAnswerStatus, updateAnswerComment, student }) => {
  const [exercises, setExercises] = useState([])
  const [teacherComment, setTeacherComment] = useState('')
  const [exercises2, setExercises2] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoaded2, setIsLoaded2] = useState(false)
  const [numberOfEx, setNumberOfEx] = useState(0)
  const [symbols, setSymbols] = useState(1500)
  const [active, setActive] = useState(0);
  const [mark, setMark] = useState(0);
  const openExer = e => setActive(+e.target.dataset.index);

  useEffect(() => {
    console.log(exercises2, "exercises2");
  }, [exercises2])
  useEffect(() => {
    console.log(lesson, "lessonPROPS");
    if (index === 0) {
      setShowCheck(lesson.id)
      clickOnPlusHandler()
    }
  }, []);

  const [exerciseText, setExerciseText] = useState([])
  function linkify(text) {
    var url_pattern = /(https?:\/\/\S+)/g;
    let test = text?.split(url_pattern)

    console.log(test, "splitter");
    setExerciseText(test)
  }

  console.log(active);

  const ExerciseText = (props) => {
    return <>
      {props.exerciseText?.map((el, index) => index % 2 === 0 ? el : <a href={el}>{el}</a>)}
    </>
  }

  useEffect(() => {
    linkify(exercises2[active]?.text)
  }, [active])

  useEffect(() => {
    setExercises2(exercises)
    console.log("isLoaded", isLoaded);
  }, [isLoaded])
  useEffect(() => {
    setExercises2(exercises)
    console.log("isLoaded2", isLoaded2);
  }, [isLoaded2])
  useEffect(() => {
    console.log("exercises2 changed", exercises2);
  }, [exercises2])
  useEffect(() => {
    console.log("numberOfEx", numberOfEx);
  }, [numberOfEx])

  const onKeyDownHandler = (e) => {
    if (e.keyCode === 8) {
      if (symbols === 1500) { }
      else if (teacherComment?.length >= 0 || teacherComment !== "") {
        setSymbols(symbols + 1)
      }
    } else {
      if (teacherComment?.length < 1500 && symbols !== 0) {
        setSymbols(symbols - 1)
      }
    }
  }

  const getLessonExercises = async (selectedLesson) => {
    let exer_number = 0
    let lessonExercises = await axios.post(`${globals.productionServerDomain}/getExercisesByLessonId/` + selectedLesson).then(res => {
      res.data.forEach(async exercise => {
        let studentId = student.id
        let exerciseId = exercise.id
        let data = {
          studentId,
          exerciseId
        };
        console.log('data', data)
        let exerciseAnswer = axios({
          method: "post",
          url: `${globals.productionServerDomain}/getAnswersByStudExId`,
          data: data,
        })
          .then(function (res) {
            console.log("rees", res);
            if (res.data[0]) {
              console.log('EXEXEXEXE', res.data[0].status)
              exercise.answer_status = res.data[0].status
            } else {
              console.log('ответов нет')
            }
          })
          .catch((err) => {
            alert("Произошла ошибка");
          });
        exer_number += 1
        exercise.exer_number = exer_number
        setNumberOfEx(exer_number)
        setIsLoaded(true)
      })
      setExercises(res.data)
      console.log('exercises', exercises)
    })
    setIsLoaded2(true)
  }

  const getLessonExercises22 = async (selectedLesson) => {
    let exer_number = 0
    let lessonExercises = await axios.post(`${globals.productionServerDomain}/getExercisesByLessonId/` + selectedLesson).then(res => {
      res.data.forEach(async exercise => {
        let studentId = student.id
        let exerciseId = exercise.id
        let data = {
          studentId,
          exerciseId
        };
        console.log('data', data)
        let exerciseAnswer = await axios({
          method: "post",
          url: `${globals.productionServerDomain}/getAnswersByStudExId`,
          data: data,
        })
          .then(function (res) {
            console.log("reeeeees", res);
            if (res.data[0]) {
              console.log('EXE', res.data[0])
              exercise.answer_status = res.data[0].status
            } else {
              console.log('ответов нет')
            }
          })
          .catch((err) => {
            alert("Произошла ошибка");
          });
        exer_number += 1
        exercise.exer_number = exer_number
        setNumberOfEx(exer_number)
        setIsLoaded(!isLoaded)
      })
      setExercises(res.data)
      console.log('exercises', exercises)
    }
    )
    setIsLoaded2(!isLoaded2)
  }

  const getLessonExercises2 = async (selectedLesson) => {
    await getLessonExercises(selectedLesson)
  }

  const getLessonExercises4 = async (selectedLesson) => {
    await getLessonExercises(selectedLesson)
  }

  const clickOnPlusHandler = async () => {
    await getLessonExercises2(lesson.id)
    await getLessonExercises4(lesson.id)
    await getLessonExercises(lesson.id)
    setShowCheck(lesson.id)
    setSelectedExerciseId(0)
    setAnswer(null)
    setTeacherComment(null)
  }


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

  console.log(lesson);

  //<< HH:MM
  const [studentPrograms, setStudentPrograms] = useState()
  const getProgramsByStudentId = async () => {
    let result = await axios.post(`${globals.productionServerDomain}/getProgramsByStudentId/` + lesson?.student_id)
    setStudentPrograms(result.data);
  }
  useEffect(() => {
    getProgramsByStudentId();
  }, []);
  const [formattedTime, setFormattedTime] = useState()
  function getShiftedTime(date, minutes) {
    console.log("getShiftedTime", date, minutes);
    if (date != undefined) {
      const millisecondsShift = minutes * 60 * 1000;
      const dateOfPersonalTime = new Date(date)
      const shiftedTime = new Date(dateOfPersonalTime.getTime() + millisecondsShift);
      const hours = shiftedTime.getHours();
      const minutesFormatted = shiftedTime.getMinutes() < 10 ? `0${shiftedTime.getMinutes()}` : shiftedTime.getMinutes();

      const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutesFormatted}`;
      setFormattedTime(formattedTime)
    } else {
      setFormattedTime("Следующее занятие не запланировано")
    }
    return formattedTime;
  }
  useEffect(() => {
    if (studentPrograms != undefined) {
      getShiftedTime(lesson.personal_time ? lesson.personal_time : lesson.start_time, studentPrograms[0].lesson_duration)
    }
  }, [studentPrograms])

  console.log(answer);
  return <>
    <div className={styles.wrapperAll}>
      <div className={styles.container}>
        <div className={styles.lessons}>
          <div className={styles.lesson}>
            <div className={styles.lesson_info}>
              <div className={styles.lesson_title_wrapper}>
                <span className={styles.lessonNumber}>№{lesson.lesson_number}: {lesson.title}</span>
              </div>
              <div className={styles.lesson_tesis}>
                <span>{lesson.tesis}</span></div>
              <div className={styles.lesson_grade_wrapper}>
                <p
                  className={styles.lesson_grade}
                >
                  Оценка - {answer ? answer.teacher_mark : "0"}
                  {/* Оценка - {lesson.score?lesson.score:'0'} ({lesson.done_exer}/{lesson.all_exer}) */}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className={styles.detail_info}
          style={(showCheck == lesson.id) ? { display: 'flex' } : { display: 'none' }}
        >
          <div className={styles.bricksRow}>
            {numberOfEx == exercises2.length
              ? <> {exercises2.map((exercise, i) => (
                <div>
                  <div className={styles.lesson_work}
                    onClick={async (e) => {
                      await getAnswer(student.id, exercise.id)
                      setSelectedExerciseId(exercise.id)
                      setSelectedExerciseNumber(exercise.exer_number)
                      setSelectedExerciseText(exercise.text)
                      setSelectedExerciseCorrectAnswer(exercise.correct_answer)
                      openExer(e);
                    }}
                    data-index={i}
                  >
                    Задание {exercise.exer_number}
                  </div>
                </div>
              ))}</>
              : ''
            }
          </div>
          {(selectedExerciseId > 0) &&
            <div className={styles.answer_block}>
              <div className={styles.wrapper_block}>
                <span className={styles.work_headline}>Задание</span>
                <ExerciseText exerciseText={exerciseText} />
              </div>
              <div className={styles.checkRow}>
                <span className={styles.student_answer}>
                  {answer
                    ? <div className={styles.student_answer_text}>
                      <span className={styles.work_headline}>Ответ студента: </span>
                      <input className={styles.input_container} type="text" value={answer.text} />
                    </div>
                    : <i>студент еще не дал ответа на текущее задание</i>
                  }
                </span>
                <div className={styles.wrapper_block}>
                  <span className={styles.work_headline}>Оцените выполнение задания</span>
                  <div className={styles.grade_toMark}>
                    <span onClick={() => setMark(1)}>1</span>
                    <span onClick={() => setMark(2)}>2</span>
                    <span onClick={() => setMark(3)}>3</span>
                    <span onClick={() => setMark(4)}>4</span>
                    <span onClick={() => setMark(5)}>5</span>
                  </div>
                </div>
              </div>
            </div>
          }
          <div style={answer ? { display: 'flex' } : { display: 'none' }} className={styles.comment_block}>
            <span className={styles.work_headline}>Добавьте комментарий для ученика</span>
            <div className={styles.answer_input}>
              <textarea
                className={styles.teacherComment}
                value={teacherComment}
                onChange={e => {
                  if (symbols !== 0) {
                    setTeacherComment(e.target.value)
                    console.log(teacherComment)
                  }
                }}
                placeholder=""
                onKeyDown={(e) => onKeyDownHandler(e)}
              >
              </textarea>
            </div>

            <button
              className={styles.sendButton}
              onClick={async () => {
                updateAnswerComment(selectedStudentId, selectedExerciseId, teacherComment, new Date())
                await updateAnswerStatus(answer.id, 'correct', mark)
                await getAnswer(selectedStudentId, selectedExerciseId)
                await getLessonExercises(lesson.id)
                await getLessonExercises22(lesson.id)
              }}
              disabled={teacherComment == '' ? true : false}
            >
              Сохранить и отправить
            </button>
          </div>
        </div>
      </div>
      <button
        className={classnames(styles.plusButton, (showCheck === lesson.id) ? styles.minus : styles.plus)}
        onClick={async (e) => {
          await getLessonExercises2(lesson.id)
          await getLessonExercises4(lesson.id)
          await getLessonExercises(lesson.id)
          setShowCheck(lesson.id)
          setSelectedExerciseId(0)
          setAnswer(null)
          setTeacherComment(null)
        }}
      >{showCheck === lesson.id ? "-" : "+"}</button>
    </div>
  </>
}

export default NewTeacherHomeworksLessons
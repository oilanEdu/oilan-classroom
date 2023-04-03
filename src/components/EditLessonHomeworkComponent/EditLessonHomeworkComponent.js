import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import styles from '../../../pages/cabinet/teacher/[url]/editLesson/index.module.css'
import globals from "../../globals";
import axios from "axios";

const EditLessonHomeworkComponent = ({el, selectedExercise, firstExerPress, 
    handleSubmitIsClicked,
    setHandleSubmitIsClicked,
    lessonDesc,
    lessonTitle,
    lesson}) => {
    const router = useRouter();
    const teacherUrl = router.query.url
    const lessonId = router.query.lesson
    const [teacher, setTeacher] = useState([])
    const [baseDataLoaded, setBaseDataLoaded] = useState(false)
  
    // const [lesson, setLesson] = useState()
    // const [lessonTitle, setLessonTitle] = useState(lesson?.title)
    // const [lessonDesc, setLessonDesc] = useState(lesson?.tesis)
    const [exercises, setExercises] = useState([])
    // const [selectedExercise, setSelectedExercise] = useState([])
  
    const [exerciseText, setExerciseText] = useState('')
    const [exerciseAnswer, setExerciseAnswer] = useState('')
  
    // const [firstExerPress, setFirstExerPress] = useState(false)
  
    // useEffect(() => {
    //   if (lesson?.title) {
    //     setLessonTitle(lesson?.title)
    //   }
    //   if (lesson?.tesis) {
    //     setLessonDesc(lesson?.tesis)
    //   }
    // }, [lesson])
  
    const isInMainPage = true;
  
    // useEffect(() => {
    //   if (!baseDataLoaded || !teacher) {
    //     loadBaseDataFirst()
    //     setBaseDataLoaded(true)
    //   }
    //   console.log('teacherUrl', teacherUrl)
    //   console.log('teacher', teacher)
  
    // }, [teacherUrl, teacher]);
  
    const loadBaseDataFirst = async () => {
      let data = teacherUrl
      let getTeacherByUrl = await axios.post(`${globals.productionServerDomain}/getTeacherByUrl/` + data)
      const teacherIdLocal = getTeacherByUrl['data'][0]?.id
      console.log('teacherIdLocal', teacherIdLocal)
      setTeacher(getTeacherByUrl['data'][0])
      let lessonInfo = await axios.post(`${globals.productionServerDomain}/getLessonById/`, { lessonId })
      console.log(lessonInfo['data'][0])
      setLesson(lessonInfo['data'][0])
      let count = 0
      let getExercises = await axios.post(`${globals.productionServerDomain}/getExercisesByLessonId/` + lessonInfo['data'][0]?.id).then(res => {
        console.log('exercises', res.data)
        res.data.forEach(async row => {
          count += 1
          row.exercise_order = count
          const data = {
            new_order: count,
            exercise_id: row.id
          }
          await axios.put(`${globals.productionServerDomain}/updateExerNumber/`, data)
        })
        setExercises(res.data)
        // debugger
      })
  
    }
  
    const loadBaseDataSecond = async () => {
      let data = teacherUrl
      let getTeacherByUrl = await axios.post(`${globals.productionServerDomain}/getTeacherByUrl/` + data)
      const teacherIdLocal = getTeacherByUrl['data'][0]?.id
      console.log('teacherIdLocal', teacherIdLocal)
      setTeacher(getTeacherByUrl['data'][0])
      let lessonInfo = await axios.post(`${globals.productionServerDomain}/getLessonById/`, { lessonId })
      console.log(lessonInfo['data'][0])
      // setLesson(lessonInfo['data'][0])
      let count = 0
      let getExercises = await axios.post(`${globals.productionServerDomain}/getExercisesByLessonId/` + lessonInfo['data'][0]?.id).then(res => {
        console.log('exercises', res.data)
        res.data.forEach(async row => {
          count += 1
          row.exercise_order = count
          const data = {
            new_order: count,
            exercise_id: row.id
          }
          await axios.put(`${globals.productionServerDomain}/updateExerNumber/`, data)
        })
        setExercises(res.data)
      })
  
    }
  
    const handleSubmit = () => {
      updateLesson()
    }
  
    const updateLesson = async () => {
      const data = {
        lessonId,
        lessonTitle,
        lessonDesc,
        exerciseId: el?.id,
        exerciseText: exerciseText === undefined ? "Текст" : exerciseText,
        exerciseAnswer: exerciseAnswer === undefined ? "Ответ" : exerciseAnswer,
      };
      debugger
      console.log('data', data)
  
      if (!lessonId) {
        // alert("Урок не найден")
      } else {
        await axios({
          method: "put",
          url: `${globals.productionServerDomain}/updateNewLesson`,
          data: data,
        })
          .then(async function (res) {
            // alert("Урок успешно изменен");
            await router.push(`/cabinet/teacher/${teacherUrl}/myLessons?program=${lesson?.program_id}`)
            window.location.reload()
          })
          .catch((err) => {
            // alert("Произошла ошибка");
          });
        }
    }
  
    const deleteLesson = async (id) => {
      const data = {
        id
      };
  
      await axios({
        method: "delete",
        url: `${globals.productionServerDomain}/deleteLesson`,
        data: data,
      })
        .then(function (res) {
          router.push(`/cabinet/teacher/${teacherUrl}/myLessons?program=${lesson?.program_id}`)
        })
        .catch((err) => {
          alert("Произошла ошибка");
        });
    }
  
  
  
    const createEmptyExercise = async () => {
      const exerciseText = 'Текст'
      const exerciseLessonId = lesson?.id
      const correctlyAnswer = 'Ответ'
      const status = "not verified"
  
      const data = {
        exerciseText,
        exerciseLessonId,
        correctlyAnswer,
        status
      };
      console.log(data)
      if (!exerciseLessonId) {
        alert("Урок не найден")
      } else {
        await axios({
          method: "post",
          url: `${globals.productionServerDomain}/createExercise`,
          data: data,
        })
          .then(function (res) {
            // alert("Задание успешно создано");
            // let idOfNewExercise = res['data']
            // let localExercisesArray1 = exercises
            // const newExercise = {id: idOfNewExercise, text: exerciseText, lesson_id: exerciseLessonId, correct_answer: correctlyAnswer, status: status}
            // localExercisesArray1.push(newExercise)
            // setExercises(localExercisesArray1)
            // debugger
            // debugger
          })
          .catch((err) => {
            alert("Произошла ошибка");
          });
      }
    }
  
    const updateExercise = async (exerciseId, exerciseText, exerciseAnswer) => {
      const data = {
        exerciseId,
        exerciseText,
        exerciseAnswer
      };
  
      await axios({
        method: "put",
        url: `${globals.productionServerDomain}/updateExercise`,
        data: data,
      })
        .then(function (res) {
          // alert("Задание успешно изменено");
        })
        .catch((err) => {
          alert("Произошла ошибка");
        });
    }
  
    const deleteExercise = async (id) => {
      const data = {
        id
      };
  
      await axios({
        method: "delete",
        url: `${globals.productionServerDomain}/deleteExercise`,
        data: data,
      })
        .then(function (res) {
          // alert("Задание успешно удалено");
        })
        .catch((err) => {
          alert("Произошла ошибка");
        });
    }

    useEffect(() => {
        if (handleSubmitIsClicked) {
            handleSubmit()
        }
    }, [handleSubmitIsClicked])
    useEffect(() => {
      if (el.text === "Текст") {
        setExerciseText()
      } else {
        setExerciseText(el.text)
      } 

      if (el.correct_answer === "Ответ") {
        setExerciseAnswer()
      } else {
        setExerciseAnswer(el.correct_answer)
      } 
    }, [])
    return (<>
    {el.id === selectedExercise.id ?        <> <div className={styles.input_container}>
          <span>Домашнее задание</span>
          <textarea
            className={styles.exerciseText}
            type="text"
            value={exerciseText}
            placeholder="пр. в учебнике на странице 52 сделать задание 5, 6, 7А"
            disabled={!firstExerPress}
            onChange={(e) => setExerciseText(e.target.value)}>
          </textarea>
          {/* {exerciseText === "Текст" ?
                    <textarea
                    className={styles.exerciseText}
                    type="text"
                    // value={exerciseText}
                    placeholder="пр. в учебнике на странице 52 сделать задание 5, 6, 7А"
                    disabled={!firstExerPress}
                    onChange={(e) => setExerciseText(e.target.value)}>
                  </textarea>
          :
                    <textarea
                    className={styles.exerciseText}
                    type="text"
                    value={exerciseText}
                    placeholder="пр. в учебнике на странице 52 сделать задание 5, 6, 7А"
                    disabled={!firstExerPress}
                    onChange={(e) => setExerciseText(e.target.value)}>
                  </textarea>
          } */}
        </div>
        <div className={styles.input_container}>
          <div className={styles.inputBlock}>
            <input
              className={styles.exerciseAnswer}
              type="text"
              value={exerciseAnswer}
              disabled={!firstExerPress}
              placeholder="пр. 5 - A, D, B;"
              onChange={(e) => setExerciseAnswer(e.target.value)}
            />
          </div>
          <div className={styles.inputBlock}>
            <button
              style={{ display: 'flex' }}
              className={styles.saveButton}
              onClick={async () => {
                // handleSubmit()
                setHandleSubmitIsClicked(true)
              }}
            >Сохранить</button>
          </div>
        </div> </> : ''}
</>)
}

export default React.memo(EditLessonHomeworkComponent)
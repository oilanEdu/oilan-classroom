import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import styles from './index.module.css'
import globals from "../../../../../src/globals";
import axios from "axios";
import HeaderTeacher from "../../../../../src/components/new_HeaderTeacher/new_HeaderTeacher";
import { Image } from "react-bootstrap";
import GoToLessonWithTimerComponent from "../../../../../src/components/GoToLessonWithTimerComponent/GoToLessonWithTimerComponent";
import EditLessonHomeworkComponent from "../../../../../src/components/EditLessonHomeworkComponent/EditLessonHomeworkComponent";

const createCourse = () => {
  const router = useRouter();
  const teacherUrl = router.query.url
  const lessonId = router.query.lesson
  const [teacher, setTeacher] = useState([])
  const [baseDataLoaded, setBaseDataLoaded] = useState(false)

  const [lesson, setLesson] = useState()
  const [lessonTitle, setLessonTitle] = useState(lesson?.title)
  const [lessonDesc, setLessonDesc] = useState(lesson?.tesis)
  const [exercises, setExercises] = useState([])
  const [selectedExercise, setSelectedExercise] = useState([])

  const [exerciseText, setExerciseText] = useState('')
  const [exerciseAnswer, setExerciseAnswer] = useState('')

  const [firstExerPress, setFirstExerPress] = useState(false)

  useEffect(() => {
    if (lesson?.title) {
      setLessonTitle(lesson?.title)
    }
    if (lesson?.tesis) {
      setLessonDesc(lesson?.tesis)
    }
  }, [lesson])

  const isInMainPage = true;

  useEffect(() => {
    if (!baseDataLoaded || !teacher) {
      loadBaseDataFirst()
      setBaseDataLoaded(true)
    }
    console.log('teacherUrl', teacherUrl)
    console.log('teacher', teacher)

  }, [teacherUrl, teacher]);

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
      exerciseId: selectedExercise?.id,
      exerciseText,
      exerciseAnswer,
    };

    console.log('data', data)

    if (!lessonId) {
      alert("Урок не найден")
    } else {
      await axios({
        method: "put",
        url: `${globals.productionServerDomain}/updateNewLesson`,
        data: data,
      })
        .then(function (res) {
          alert("Урок успешно изменен");
        })
        .catch((err) => {
          alert("Произошла ошибка");
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
          alert("Задание успешно создано");
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
        alert("Задание успешно изменено");
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
        alert("Задание успешно удалено");
      })
      .catch((err) => {
        alert("Произошла ошибка");
      });
  }

  const [handleSubmitIsClicked, setHandleSubmitIsClicked] = useState(false)
  return <>
    <div className={styles.container}>
      <HeaderTeacher
        white={true}
        url={teacherUrl}
        teacher={teacher}
        isInMainPage={isInMainPage}
      />
      <GoToLessonWithTimerComponent isTeacher={true} url={router.query.url} />
      <div className={styles.editLesson}>
        <span className={styles.whichProgramm}>Программа {lesson?.program_title}</span>
        <div className={styles.row}>
          <h1>Изменение урока</h1>
          <span onClick={() => {
            deleteLesson(lessonId)
          }}>Удалить урок</span>
        </div>
        <div className={styles.input_container}>
          <span>Название урока</span>
          <input
            className={styles.lessonTitle}
            type="text"
            value={lessonTitle}
            placeholder="Текст"
            onChange={(e) => setLessonTitle(e.target.value)}
          />
          <span>Описание урока</span>
          <textarea
            className={styles.lessonContent}
            type="text"
            value={lessonDesc}
            placeholder="Текст"
            onChange={(e) => setLessonDesc(e.target.value)}>
          </textarea>
        </div>
        <div className={styles.exercisesData}>
          <div className={styles.exerciseSelectBlock}>
            {exercises.map(exercise => (
              <div className={styles.exerItem}
                style={exercise.id == selectedExercise.id ? { backgroundColor: '#2E8CF2' } : { backgroundColor: '#A3CEFD' }}
                onClick={async () => {
                  await setSelectedExercise(exercise)
                  await setExerciseText(exercise.text)
                  await setFirstExerPress(true)
                  await setExerciseAnswer(exercise.correct_answer)
                  await loadBaseDataSecond()
                }}
              >
                Задание {exercise.exer_order}
              </div>
            ))}
            <div className={styles.wrapperPlusMinus}>
              <div
                className={styles.plusMinusButton}
                onClick={async () => {
                  await createEmptyExercise()
                  await loadBaseDataSecond()
                  await setSelectedExercise('')
                  // await loadBaseDataSecond()
                  await loadBaseDataSecond()
                }}
              >+</div>
              <div
                className={styles.plusMinusButton}
                onClick={async () => {
                  await deleteExercise(selectedExercise.id)
                  await loadBaseDataSecond()
                  await setSelectedExercise('')
                }}
              >-</div>
            </div>
          </div>
          {exercises.map(el => (
            <EditLessonHomeworkComponent el={el} selectedExercise={selectedExercise} firstExerPress={firstExerPress}
            handleSubmitIsClicked={handleSubmitIsClicked}
            setHandleSubmitIsClicked={setHandleSubmitIsClicked}
            lessonTitle={lessonTitle}
            lessonDesc={lessonDesc}
            />
          ))}

        </div>
      </div>
    </div>
  </>;
};

export default createCourse;
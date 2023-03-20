import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import styles from './index.module.css'
import globals from "../../../../src/globals";
import axios from "axios";
import HeaderTeacher from "../../../../src/components/new_HeaderTeacher/new_HeaderTeacher";
import { Image } from "react-bootstrap";

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
      loadBaseData()
      setBaseDataLoaded(true)
    }
    console.log('teacherUrl', teacherUrl)
    console.log('teacher', teacher)

  }, [teacherUrl, teacher]);

  const loadBaseData = async () => {
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
        router.push(`/new_teacher_cabinet/${teacherUrl}/myLessons?program=${lesson?.program_id}`)
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

  return <>
    <div className={styles.container}>
      <HeaderTeacher
        white={true}
        url={teacherUrl}
        teacher={teacher}
        isInMainPage={isInMainPage}
      />
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
                // style={exercise.id == selectedExercise.id ? { display: 'flex', padding: '2px', border: '3px solid #007AFF', borderRadius: '8px', marginRight: '20px', marginBottom: '5px', marginTop: '5px' } : { display: 'flex', padding: '2px', border: '3px solid white', borderRadius: '8px', marginRight: '20px', marginBottom: '5px', marginTop: '5px' }}
                onClick={async () => {
                  await setSelectedExercise(exercise)
                  await setExerciseText(exercise.text)
                  await setFirstExerPress(true)
                  await setExerciseAnswer(exercise.correct_answer)
                  await loadBaseData()
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
                  await loadBaseData()
                  await setSelectedExercise('')
                  await loadBaseData()
                  await loadBaseData()
                }}
              >+</div>
              <div
                className={styles.plusMinusButton}
                onClick={async () => {
                  await deleteExercise(selectedExercise.id)
                  await loadBaseData()
                  await setSelectedExercise('')
                }}
              >-</div>
            </div>
          </div>
          <div className={styles.input_container}>
            <span>Домашнее задание</span>
            <textarea
              className={styles.exerciseText}
              type="text"
              value={exerciseText}
              placeholder="пр. в учебнике на странице 52 сделать задание 5, 6, 7А"
              disabled={!firstExerPress}
              onChange={(e) => setExerciseText(e.target.value)}>
            </textarea>
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
                  handleSubmit()
                }}
              >Сохранить</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>;
};

export default createCourse;
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import styles from './index.module.css'
import globals from "../../../../src/globals";
import axios from "axios";
import HeaderTeacher from "../../../../src/components/new_HeaderTeacher/new_HeaderTeacher";
import { Image } from "react-bootstrap";
import { Card } from "react-bootstrap";

const createLesson = () => {
  const router = useRouter();
  const programId = router.query.program
  const teacherUrl = router.query.url
  const [teacher, setTeacher] = useState([])
  const [program, setProgram] = useState([])
  const [baseDataLoaded, setBaseDataLoaded] = useState(false)
  const [exercises, setExercises] = useState([{description: '', answer: ''}]);
  const [selectedExercise, setSelectedExercise] = useState(0);
  const [lessonTitle, setLessonTitle] = useState('')
  const [lessonDesc, setLessonDesc] = useState('')

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
    let selectedProgram = await axios.post(`${globals.productionServerDomain}/getProgramById/`, { programId })
    console.log('selectedProgram', selectedProgram['data'][0])
    setProgram(selectedProgram['data'][0])
  }

  const handleSubmit = () => {
    if (lessonTitle && lessonDesc) {
      createNewLesson()
    }
  }

  const createNewLesson = () => {

    const lessonData = {
      title: lessonTitle,
      description: lessonDesc,
      program_id: programId,
      course_id: program?.course_id,
      exercises: exercises.map((exercise, index) => {
        return {
          index: index + 1,
          description: exercise.description,
          value: exercise.answer,
        }
      })
    };

    console.log('lessonData', lessonData)

    axios.post(`${globals.productionServerDomain}/createNewLessonAndExercises/`, lessonData)
      .then(response => {
        console.log(response.data);
        router.push(`/new_teacher_cabinet/${teacherUrl}/myLessons?program=${programId}`)
        // handle success
      })
      .catch(error => {
        console.log(error.response.data);
        // handle error
      });

  }

  function addExercise() {
    const newExercise = {
      description: '',
      answer: ''
    };
    setExercises([...exercises, newExercise]);
  }

  function removeExercise(index) {
    const newExercises = [...exercises];
    newExercises.splice(index, 1);
    setExercises(newExercises);
    if (index === selectedExercise) {
      setSelectedExercise(null);
    } else if (index < selectedExercise) {
      setSelectedExercise(selectedExercise - 1);
    }
  }

  function handleDescriptionChange(event) {
    const newExercises = [...exercises];
    newExercises[selectedExercise].description = event.target.value;
    setExercises(newExercises);
  }

  function handleAnswerChange(event) {
    const newExercises = [...exercises];
    newExercises[selectedExercise].answer = event.target.value;
    setExercises(newExercises);
  }

  function handleExerciseClick(index) {
    setSelectedExercise(index);
  }



  return <>
    <div className={styles.container}>
      <HeaderTeacher
        white={true}
        url={teacherUrl}
        teacher={teacher}
        isInMainPage={isInMainPage}
      />
      <div className={styles.createLesson}>
        <div className={styles.contentContainer}>
          <p>{program?.title}</p>
          <h1>Создание урока</h1>
          <div>
            <div className={styles.lessonData}>
              <p>Название урока</p>
              <input onChange={(e) => setLessonTitle(e.target.value)} placeholder='пр. Логарифмы'/>
              <p>Описание урока</p>
              <textarea onChange={(e) => setLessonDesc(e.target.value)} placeholder='пр. Проходим логарифмы и кайфуем от жизни полным ходом'></textarea>
            </div>
            <div className={styles.exerRow}>
              {exercises.map((exercise, index) => (
                <div className={styles.exerItem} key={index}>
                  <button onClick={() => handleExerciseClick(index)} className={selectedExercise === index ? styles.selectedExer : styles.notSelectedExer}>
                    {`Задание ${index + 1}`}
                  </button>
                </div>
              ))}
              <button onClick={addExercise}>+</button>
              <button onClick={() => removeExercise(selectedExercise)}>-</button>
            </div>
            <div className={styles.inputsRow}>
              <p>Описание домашнего задания</p>
              <textarea disabled={selectedExercise == null} value={exercises[selectedExercise]?.description} onChange={handleDescriptionChange} placeholder='пр. в учебнике на странице 52 сделать задание 5, 6, 7А'></textarea>
              <p>Правильный ответ на задание</p>
              <textarea disabled={selectedExercise == null} value={exercises[selectedExercise]?.answer} onChange={handleAnswerChange} placeholder='пр. 5 - A, D, B;'></textarea>
            </div>           
            <button onClick={() => {console.log('exercises', exercises)}}>Deselect</button>
          </div>
          <button onClick={() => {handleSubmit()}}>Создать урок</button>
        </div>
      </div>
    </div>
  </>;
};

export default createLesson;
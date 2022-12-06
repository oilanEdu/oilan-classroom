import { useRouter } from "next/router";
import React, {useEffect, useState} from "react";
import globals from "../../../../../src/globals";
import styles from "./styles.module.css";
import axios from "axios";
import Footer from "../../../../../src/components/Footer/Footer";
import HeaderTeacher from "../../../../../src/components/HeaderTeacher/HeaderTeacher";

function EditProgram(props) {
    
    const router = useRouter()
    const programId = router.query.programId
    const [program, setProgram] = useState([])
    const [courses, setCourses] = useState([])
    const [lessons, setLessons] = useState([])
    const [exercises, setExercises] = useState([])
    const [selectedCourseId, setSelectedCourseId] = useState(0)
    const [programTitle, setProgramTitle] = useState(program.title)
    const [selectedLesson, setSelectedLesson] = useState([])
    const [selectedExercise, setSelectedExercise] = useState([])
    const [lessonTitle, setLessonTitle] = useState('')
    const [lessonTesis, setLessonTesis] = useState('')
    const [lessonDate, setLessonDate] = useState(new Date()) 
    const [exerciseText, setExerciseText] = useState('')
    const [exerciseAnswer, setExerciseAnswer] = useState('')
    const [lastLessonOrder, setLastLessonOrder] = useState(0)
    const [teacher, setTeacher] = useState()
    
  let dateStr = new Date(lessonDate);
  let curr_date = dateStr.getDate();
  let curr_month = dateStr.getMonth() + 1;
  let curr_year = dateStr.getFullYear(); 
  let formated_date = curr_year + "-"
  if (curr_month > 9){
    formated_date += curr_month + "-"
  } else {
    formated_date += "0" + curr_month + "-"
  }
  if (curr_date > 9){
    formated_date += curr_date
  } else {
    formated_date += "0" + curr_date 
  }

  const loadTeacherData = async () => {
    let data = router.query.url 
    let getTeacherByUrl = await axios.post(`${globals.productionServerDomain}/getTeacherByUrl/` + data)

    setTeacher(getTeacherByUrl['data'][0])
  }





    const isProgramIdLoaded = () => {

      if (programId !== undefined) {
        loadProgramData()
      }
    }
    useEffect(() => {
      isProgramIdLoaded()
    }, [programId])

    useEffect(() => {
      loadTeacherData()
    }, []);

    const loadProgramData = async () => {
        let getProgramInfo = await axios.post(`${globals.productionServerDomain}/getCurrentProgram/` + programId) 
        setProgram(getProgramInfo['data'][0]) 
        console.log(program)
        let getTeacherCourses = await axios.post(`${globals.productionServerDomain}/getCoursesByTeacherId/` + getProgramInfo['data'][0].teacher_id).then(res => {
            setCourses(res.data)
        })

        let lessonsCount = 0
        let studentLessons = await axios.post(`${globals.productionServerDomain}/getLessonsByProgramId/` + programId).then(res => {
            res.data.forEach(row => {
                lessonsCount += 1
                row.lesson_number = lessonsCount
                if (row.lesson_order > lastLessonOrder){
                    setLastLessonOrder(row.lesson_order) 
                }
            })
            setLessons(res.data)
        })
    }

    const loadLessonExercises = async (value) => { 
        let count = 0
        let getExercises = await axios.post(`${globals.productionServerDomain}/getExercisesByLessonId/` + value.id).then(res => {
            res.data.forEach(row => {
                count += 1
                row.exercise_order = count
            })
            setExercises(res.data)
        })
    } 

    const updateProgram = async (programId, programTitle, courseId) => {
        if (courseId == 0){
            courseId = program.course_id 
        }
        const data = {
          programId,
          programTitle,
          courseId
        }; 

        await axios({
          method: "put",
          url: `${globals.productionServerDomain}/updateProgramCourseAndTitle`,
          data: data,
        })
          .then(function (res) {
            alert("Программа успешно изменена"); 
          })
          .catch((err) => {
            alert("Произошла ошибка"); 
          });
    }

    const createEmptyLesson = async () => {
        const lessonTitle = 'Текст'
        const lessonOrder = lastLessonOrder + 1
        const lessonCourseId = program.course_id
        const lessonTesis = 'Текст'
        const lessonStartTime = new Date()
        const lessonProgramId = programId

        const data = {
          lessonTitle,
          lessonOrder,
          lessonCourseId,
          lessonTesis,
          lessonStartTime,
          lessonProgramId,
        };
        console.log(data)
        await axios({
          method: "post",
          url: `${globals.productionServerDomain}/createLesson`,
          data: data,
        })
          .then(function (res) {
            alert("Урок успешно создан"); 
          })
          .catch((err) => {
            alert("Произошла ошибка");
          });
    }
 
    const updateLesson = async (lessonId, lessonTitle, lessonDate, lessonTesis) => {
        const data = {
          lessonId,
          lessonTitle,
          lessonDate,
          lessonTesis
        }; 

        await axios({
          method: "put",
          url: `${globals.productionServerDomain}/updateLesson`,
          data: data,
        })
          .then(function (res) {
            alert("Урок успешно изменен"); 
          })
          .catch((err) => {
            alert("Произошла ошибка"); 
          });
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
            alert("Урок успешно удален");
          })
          .catch((err) => {
            alert("Произошла ошибка"); 
          });
    }

    const createEmptyExercise = async () => {
        const exerciseText = 'Текст'
        const exerciseLessonId = selectedLesson.id
        const correctlyAnswer = 'Ответ' 
        const status = "not verified"

        const data = {
          exerciseText,
          exerciseLessonId,
          correctlyAnswer,
          status
        };
        console.log(data)
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

    console.log(teacher);
    return ( 
        <>
            <div style={{backgroundColor: "#f1faff", width: "    100vw", padding: "20px 20px 0 20px"}}>
                <HeaderTeacher white={true} teacher={teacher} />

                <div className={styles.cantainer}>
                    <div className={styles.mainTitle}>
                        <span>Программа Для Студентов</span>
                    </div>
                    <div className={styles.programBlock}>
                        <h1>Выберите направление</h1>
                        <span>
                            <select
                                className={styles.courseSelect}
                                onChange={(e) => {
                                    setSelectedCourseId(e.target.value)
                                 } 
                                }
                                value={selectedCourseId}>
                                <option value="0" disabled>Курс</option>
                                  {courses.map(course => (
                                    <option value={course.id}>{course.title}</option> 
                                      )
                                    )}
                            </select>
                            <button
                                className={styles.reloadButton}
                                onClick={() => {
                                    loadProgramData()
                            }}>&#128472;</button>
                        </span>
                        <h2>Название программы</h2> 
                        <input
                            type="text"
                            className={styles.programTitle}
                            value={programTitle}
                            placeholder={program.title?program.title:'Текст'}
                            onChange={(e) => setProgramTitle(e.target.value)}
                          />
                        <button
                            className={styles.saveButton}
                            onClick={() =>{
                                updateProgram(programId, programTitle, selectedCourseId)
                                loadProgramData()
                            }}>Сохранить</button> 
                    </div>

                    <div className={styles.lessonsBlock}>
                        <h1>Занятия программы</h1>
                        <div className={styles.lessonSelectBlock}>
                            {lessons.map(lesson => (
                                <div 
                                    className={
                                        (selectedLesson.id == lesson.id)
                                            ?(lesson.title && lesson.title !== 'Текст' && lesson.tesis && lesson.tesis !== 'Текст')
                                                ?styles.fillSelectedLesson:styles.emptySelectedLesson:
                                                    (lesson.title && lesson.title !== 'Текст' && lesson.tesis && lesson.tesis !== 'Текст')?
                                                    styles.fillLesson:styles.emptyLesson
                                            }
                                    onClick={() => {
                                        setSelectedLesson(lesson)
                                        setLessonTitle(lesson.title)
                                        setLessonTesis(lesson.tesis)
                                        setLessonDate(lesson.start_time)
                                        loadLessonExercises(lesson)
                                        // loadLesson()
                                        console.log('hhh', formated_date)
                                        console.log(selectedLesson) 
                                    }}
                                >{lesson.lesson_number}</div> 
                            ))}
                            <div 
                                className={styles.plusMinusButton}
                                onClick={async() => {
                                    await createEmptyLesson()
                                    await loadProgramData() 
                                }}
                            >+</div>
                            <div 
                                style={{padding: '3px'}}
                                className={styles.plusMinusButton}
                                onClick={async() => {
                                    await deleteLesson(selectedLesson.id)
                                    await loadProgramData()
                                }}
                            >-</div>
                        </div>
                        <div className={styles.lessonInfoFirstRow}> 
                            <div className={styles.inputBlock}>
                                <span>Название занятия</span>
                                <input
                                    className={styles.lessonTitle}
                                    type="text" 
                                    value={lessonTitle}
                                    placeholder="Текст"
                                    onChange={(e) => setLessonTitle(e.target.value)}
                                />    
                            </div>
                            <div className={styles.inputBlock}>
                                <span>Дата занятия</span>   
                                <input
                                    className={styles.lessonDate}
                                    type="date"
                                    value={formated_date} 
                                    onChange={(e) => {
                                        setLessonDate(e.target.value)
                                        }
                                    }
                                />
                            </div>
                        </div>
                        <div className={styles.lessonInfoSecondRow}> 
                            <span>Содержание урока</span>
                            <textarea
                                className={styles.lessonContent}
                                type="text"
                                value={lessonTesis} 
                                placeholder="Текст"
                                onChange={(e) => setLessonTesis(e.target.value)}>
                            </textarea>
                        </div>
                        <div className={styles.lessonSaveButton}>
                            <button 
                                style={selectedLesson == ''?{display: 'none'}:{display: 'flex'}}
                                className={styles.saveButton}
                                onClick={() => {
                                    updateLesson(selectedLesson.id, lessonTitle, lessonDate, lessonTesis)
                                }}
                            >Сохранить</button>
                        </div>
                    </div>

                    <div className={styles.exercisesBlock}>
                        <h1>Задания к уроку</h1>
                        <div className={styles.exerciseSelectBlock}>
                            {exercises.map(exercise => (
                                <div 
                                    className={
                                        (selectedExercise.id == exercise.id)
                                            ?(exercise.text && exercise.text !== 'Текст' && exercise.correct_answer && exercise.correct_answer !== 'Ответ')
                                                ?styles.fillSelectedExercise:styles.emptySelectedExercise:
                                                    (exercise.text && exercise.text !== 'Текст' && exercise.correct_answer && exercise.correct_answer !== 'Ответ')?
                                                    styles.fillExercise:styles.emptyExercise
                                            }
                                    onClick={() => {
                                        setSelectedExercise(exercise)
                                        setExerciseText(exercise.text)
                                        setExerciseAnswer(exercise.correct_answer)
                                    }}
                                >{exercise.exercise_order}</div>
                            ))}
                            <div 
                                className={styles.plusMinusButton}
                                onClick={() => {
                                    createEmptyExercise()
                                    loadProgramData() 
                                }}
                            >+</div>
                            <div 
                                style={{padding: '3px'}}
                                className={styles.plusMinusButton}
                                onClick={() => {
                                    deleteExercise(selectedExercise.id)
                                    loadProgramData()
                                }}
                            >-</div>
                        </div>
                        <div className={styles.exerciseInfoFirstRow}> 
                            <span>Домашнее задание</span>
                            <textarea
                                className={styles.exerciseText}
                                type="text"
                                value={exerciseText}
                                placeholder="Условие задачи или пример..."
                                onChange={(e) => setExerciseText(e.target.value)}>
                            </textarea>
                        </div>
                        <div className={styles.exerciseInfoSecondRow}>
                            <div className={styles.inputBlock}>
                                <input
                                    className={styles.exerciseAnswer}
                                    type="text"
                                    value={exerciseAnswer}
                                    placeholder="Ответ"
                                    onChange={(e) => setExerciseAnswer(e.target.value)}
                                />
                            </div>
                            <div className={styles.inputBlock}> 
                                <button 
                                style={selectedExercise == ''?{display: 'none'}:{display: 'flex'}}
                                className={styles.saveButton}
                                    onClick={() => {
                                        updateExercise(selectedExercise.id, exerciseText, exerciseAnswer)
                                    }}
                                >Сохранить</button> 
                            </div>
                        </div>
                    </div>
                </div>
                
                <Footer />
            </div>
        </>
       )
}

EditProgram.getInitialProps = async (ctx) => {
    console.log('lol',ctx)
    if(ctx.query.programId !== undefined) {
        return {
            url: ctx.query.programId,
        }
    }else{
        return {};
    }
}

export default EditProgram
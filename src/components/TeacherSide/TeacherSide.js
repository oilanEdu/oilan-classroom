import React, {useEffect, useState} from "react";
import styles from "../../../pages/cabinet/teacher/[url]/homeworks/index.module.css";
import { Image } from "react-bootstrap";
import classnames from 'classnames';
import axios from "axios";
import globals from "../../globals";

const TeacherSide = ({lesson, showCheck, selectedExerciseId, answer, teacherComment, setShowCheck, setSelectedExerciseId, setAnswer, setTeacherComment, setSelectedExerciseNumber, setSelectedExerciseText, setSelectedExerciseCorrectAnswer, getAnswer, selectedStudentId, selectedExerciseNumber, selectedExerciseText, selectedExerciseCorrectAnswer, updateAnswerStatus, updateAnswerComment, setIsDateAndTimeChanged}) => {
    const [exercises, setExercises] = useState([])
    const [exercises2, setExercises2] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [isLoaded2, setIsLoaded2] = useState(false)
    const [numberOfEx, setNumberOfEx] = useState(0)
    useEffect(() => {
        console.log(lesson, "lessonPROPS");
    }, [])
    useEffect(() => {
        setExercises2(exercises)
        console.log("isLoaded", isLoaded);
    }, [isLoaded])
    useEffect(() => {
        setExercises2(exercises)
        console.log("isLoaded2", isLoaded2);
    }, [isLoaded2])
    useEffect(() => {
        console.log("exercises2 changed", exercises2 );
    }, [exercises2])
    useEffect(() => {
        console.log("numberOfEx", numberOfEx);
    }, [numberOfEx])
    
    const getLessonExercises = async (selectedLesson) => {
        let exer_number = 0
        let lessonExercises = await axios.post(`${globals.productionServerDomain}/getExercisesByLessonId/` + selectedLesson).then(res => {
            res.data.forEach(async exercise => {
                let studentId = selectedStudentId
                let exerciseId = exercise.id
                let data = {
                  studentId,
                  exerciseId
                };
                console.log('data',data)
                let exerciseAnswer = axios({ 
                  method: "post",
                  url: `${globals.productionServerDomain}/getAnswersByStudExId`,
                  data: data,
                })
                  .then(function (res) {
                    if (res.data[0]){
                        console.log('EXEXEXEXE', res.data[0].status)
                        exercise.answer_status = res.data[0].status
                    }else{
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
        }
        )
        setIsLoaded2(true)
    }
    const getLessonExercises22 = async (selectedLesson) => {
        let exer_number = 0
        let lessonExercises = await axios.post(`${globals.productionServerDomain}/getExercisesByLessonId/` + selectedLesson).then(res => {
            res.data.forEach(async exercise => {
                let studentId = selectedStudentId
                let exerciseId = exercise.id
                let data = {
                  studentId,
                  exerciseId
                };
                console.log('data',data)
                let exerciseAnswer = await axios({ 
                  method: "post",
                  url: `${globals.productionServerDomain}/getAnswersByStudExId`,
                  data: data,
                })
                  .then(function (res) {
                    if (res.data[0]){
                        console.log('EXE', res.data[0].status)
                        exercise.answer_status = res.data[0].status
                    }else{
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
    const getLessonExercises3 = async (selectedLesson) => {
        await getLessonExercises22(selectedLesson)
    }
    const getLessonExercises4 = async (selectedLesson) => {
        await getLessonExercises(selectedLesson)
    }
    const getLessonExercises5 = async (selectedLesson) => {
        await getLessonExercises(selectedLesson)
    }


    //Date And TIme Picker
    let dateStr = new Date(lesson.personal_time ? lesson.personal_time : lesson.start_time)
    let dateStrTime = new Date(lesson.personal_time ? lesson.personal_time : lesson.start_time).toLocaleTimeString();
    let curr_date = dateStr.getDate();
    let curr_month = dateStr.getMonth() + 1;
    let curr_year = dateStr.getFullYear();
    let formated_date = curr_year + "-";
    if (curr_month > 9) { 
      formated_date += curr_month + "-";
    } else {
      formated_date += "0" + curr_month + "-";
    }
    if (curr_date > 9) {
      formated_date += curr_date; 
    } else {
      formated_date += "0" + curr_date; 
    }
    const [dateState, setDateState] = useState(formated_date);
    const [timeState, setTimeState] = useState(dateStrTime)
    let dateAndTimeMerger = dateState+" "+timeState
    const saveLessonDateAndTime = async (dateAndTimeMerger, lesson_id, course_id, student_id) => {
        const dataForGetSchedule = {
          lesson_id, 
          course_id,
          student_id 
        };  
        debugger
        console.log("dataForGetSchedule", dataForGetSchedule)
        let schedule = await axios({
          method: "post",
          url: `${globals.productionServerDomain}/getScheduleByLessonIdAndCourseIdAndStudentId`,
          data: dataForGetSchedule,
        }).then(function (res) {
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
          }    
        } 
         else {
          console.log("isscheduleRIGHT is NOT RIGHT");
          const dataForCreateSchedule = {
            dateAndTimeMerger,
            lesson_id, 
            course_id,
            student_id 
          }; 
          // console.log("dataForGetSchedule", dataForGetSchedule)
          let schedule = await axios({
            method: "post",
            url: `${globals.productionServerDomain}/createSchedule`,
            data: dataForCreateSchedule,
          })
        } 
      } 
      useEffect(() => {
        setTimeState(dateStrTime)
      }, []);
      const [showInputsOfDate, setShowInputsOfDate] = useState(false)

    return <> <div className={styles.lesson}>
        <div 
            className={styles.detailInfo}
            style={{display: 'flex'}}
        >
            <div className={styles.bricksRow}>
                <span> {exercises2.length > 0 ? "Задание" : ""}</span>
                {numberOfEx == exercises2.length ? <>                {exercises2.map(exercise => (
                    <div style={exercise.id == selectedExerciseId?{display:'flex', padding: '2px', border: '3px solid #007AFF', borderRadius: '8px', marginRight: '20px', marginBottom: '5px', marginTop: '5px'}:{display:'flex', padding: '2px', border: '3px solid white', borderRadius: '8px', marginRight: '20px', marginBottom: '5px', marginTop: '5px'}}>
                        <div 
                            className={exercise.answer_status?exercise.answer_status == 'not verified'?styles.exerBrickWhite:exercise.answer_status == 'correct'?styles.exerBrickGreen:styles.exerBrickRed:styles.exerBrickWhite}
                            onClick={async () => {
                                await getAnswer(selectedStudentId, exercise.id)
                                setSelectedExerciseId(exercise.id)
                                setSelectedExerciseNumber(exercise.exer_number)
                                setSelectedExerciseText(exercise.text)
                                setSelectedExerciseCorrectAnswer(exercise.correct_answer)
                                
                            }}
                        >
                            {exercise.exer_number}
                        </div>
                    </div>
                ))}</> : ''}

            </div>

            {(selectedExerciseId > 0)&&
            <div className={styles.answerBlock}>
                <span className={styles.exerciseText}>{selectedExerciseNumber}) {selectedExerciseText}</span>
                <div className={styles.checkRow}>
                    <span className={styles.studentsAnswer}>
                        {answer?'Ответ студента: ' + answer.text:<i>(студент еще не дал ответа на текущее задание)</i>}
                    </span>    
                    <button 
                        style={answer?{display: 'flex'}:{display: 'none'}} 
                        className={answer?answer.status == 'correct'?styles.disabledButton:styles.correctButton:styles.correctButton}
                        onClick={async() => {
                            await updateAnswerStatus(answer.id, 'correct')
                            await getAnswer(selectedStudentId, selectedExerciseId)
                            await getLessonExercises(lesson.id)
                            await getLessonExercises22(lesson.id)
                        }}
                        disabled={answer?answer.status == 'correct'?true:false:false}
                    >
                        &#10003;
                    </button>
                    <button 
                        className={answer?answer.status == 'uncorrect'?styles.disabledButton:styles.uncorrectButton:styles.uncorrectButton}
                        style={answer?{display: 'flex'}:{display: 'none'}} 
                        onClick={async() => {
                            await updateAnswerStatus(answer.id, 'uncorrect')
                            await getAnswer(selectedStudentId, selectedExerciseId)
                            await getLessonExercises(lesson.id)
                            await getLessonExercises22(lesson.id)
                        }}
                        disabled={answer?answer.status == 'uncorrect'?true:false:false}
                    >
                        &#10008;
                    </button>
                </div>   
                <span className={styles.correctAnswer}>
                    <Image 
                        src='https://realibi.kz/file/108886.png'
                        style={{marginRight: '10px'}}
                    />
                    Правильный ответ - {selectedExerciseCorrectAnswer}
                </span>     
            </div>
            }
            <div style={answer?{display: 'flex'}:{display: 'none'}} className={styles.commentBlock}>
                <span>Оставить комментарий</span>
                <textarea 
                    className={styles.teacherComment}
                    placeholder="Оставьте краткое пояснение по домашнему заданию студента"
                    onChange={e => {
                        setTeacherComment(e.target.value)
                    }}
                >
                </textarea>
                <button
                    className={styles.sendButton}
                    onClick={() => {
                        updateAnswerComment(selectedStudentId, selectedExerciseId, teacherComment, new Date())
                    }}
                    disabled={teacherComment == '' ? true : false}
                >
                    Отправить
                </button>
            </div>
        </div>
    </div>
    </>
}

export default TeacherSide
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import styles from '../../../pages/cabinet/teacher/[url]/homeworks/index.module.css'
import globals from "../../globals";
import axios from "axios";
import LessonDataComponent from "../LessonDataComponent/LessonDataComponent";

const AnswersHomeWorksOfTeacherComponent = ({answer, index, answers, setAnswers}) => {
    const router = useRouter();
    const teacherUrl = router.query.url
    const programId = router.query.program
    const [teacher, setTeacher] = useState([])
    const [baseDataLoaded, setBaseDataLoaded] = useState(false)
    const [lessons, setLessons] = useState([])
    // const [answers, setAnswers] = useState([])
    const [lessonData, setLessonData] = useState([])
    // useEffect(() => {
    //   console.log("lessonData CHANGED");
    // }, [lessonData])
    const [students, setStudents] = useState([]);
    const [mark, setMark] = useState(0);
    const [selectedExId, setSelectedExId] = useState(0);
    const [selectedExIdForQuery, setSelectedExIdForQuery] = useState(0);
    // useEffect(() => {
    //   selectedExId
    //   debugger
    // }, [selectedExId])
    const [selectedStudId, setSelectedStudId] = useState(0);
    const [selectedAnswerId, setSelectedAnswerId] = useState(0);
    const [selectedLessonId, setSelectedLessonId] = useState(0);
    const [teacherComment, setTeacherComment] = useState('')
    const [updateAnswerCommentClicked, setUpdateAnswerComment] = useState(false)
    const [buttonIsClicked, setButtonIsClicked] = useState(false)
    
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
  
    const isInMainPage = true;
  
    useEffect(() => {
      if (!baseDataLoaded || !teacher || !students) {
        loadBaseData()
        setBaseDataLoaded(true)
      }
      console.log('teacherUrl', teacherUrl)
      console.log('teacher', teacher)
      console.log('router', router)
      console.log('students', students)
  
    }, [teacherUrl, teacher, students]);
  
    const ExerciseText = (props) => {
      return <>
        {props.exerciseText?.map((el, index) => index % 2 === 0 ? el : <a href={el}>{el}</a>)}
      </>
    }
  
    const loadBaseData = async () => {
      console.log("IM HERE");
      let data = teacherUrl
      let getTeacherByUrl = await axios.post(`${globals.productionServerDomain}/getTeacherByUrl/` + data)
      const teacherIdLocal = getTeacherByUrl['data'][0]?.id
      console.log('teacherIdLocal', teacherIdLocal)
      setTeacher(getTeacherByUrl['data'][0])
      let megadata = await axios.post(`${globals.productionServerDomain}/getAnswersStatistics/`, { id: teacherIdLocal })
      console.log('megadata', megadata['data'])
      megadata['data'].forEach(answer => {
        answer.isExpanded = false
      })
      const uniqueLessons = megadata['data'].filter((item, index, self) => 
        index === self.findIndex((t) => (
          t.lesson_id === item.lesson_id
        ))
      );
    //   setAnswers(uniqueLessons)
      let studentsData = await axios.post(`${globals.productionServerDomain}/getStudentsByTeacherId/`, { id: teacherIdLocal, sort: 'id' })
      console.log('studentsData', studentsData['data'])
      setStudents(studentsData['data'])
      let megadata2 = await axios.post(`${globals.productionServerDomain}/getAssignmentsByTeacherId/`, { id: teacherIdLocal })
      console.log('megadata2', megadata2['data'])
      let uniqueData = megadata2['data'].reduce((acc, curr) => {
        const key = curr.answer_id;
        if (!acc.map.has(key)) {
          acc.map.set(key, true);
          acc.data.push(curr);
        }
        return acc;
      }, { map: new Map(), data: [] }).data;
      let count = 0
      uniqueData.forEach(async (row, index) => {
        count += 1
        row.exercise_order = count
        // let getExercises = await axios.post(`${globals.productionServerDomain}/getExercisesByLessonId/` + row?.lesson_id)
        // let localLesson = getExercises['data'][index]
        // row.exercise_text = localLesson?.text
        // debugger
      })
      console.log('uniqueData', uniqueData);
      setLessonData(uniqueData)
    }
    // useEffect(() => {
    //   loadBaseData()
    // }, [])
    useEffect(() => {
      if (!answers.length > 0 && !lessonData.length > 0) {
        console.log('myState has not changed yet');
        setTimeout(() => {
          loadBaseData()
        }, 1000);
      }
    }, [answers, lessonData]);
  
    function formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${day}.${month}.${year}, ${hours}:${minutes}`;
    }
  
    const toggleAnswer = (index) => {
      setAnswers(prevAnswers => {
        const newAnswers = [...prevAnswers];
        newAnswers[index].isExpanded = !newAnswers[index].isExpanded;
        return newAnswers;
      });
    };
  
  
  
    console.log(selectedExId);
  
    // const LessonDataComponent = ({LD, i, answer}) => {
    //   const [localExrciseText, setLocalExrciseText] = useState()
    //   const [teacherCommentLocal, setTeacherCommentLocal] = useState('')
    //   const [markLocal, setMarkLocal] = useState(0);
    //   useEffect(() => {
    //     LD
    //     async function test () {
    //       let getExercises = await axios.post(`${globals.productionServerDomain}/getExercisesByLessonId/` + LD?.lesson_id)
    //       let localLesson = getExercises['data'][i]
    //       setLocalExrciseText(localLesson?.text)
    //       // debugger
    //     }
    //     test()
    //     setMarkLocal(LD.teacher_mark)
    //     // debugger
    //   }, [])
    //   return <div key={i}>
    //   <div>
    //     {selectedExId === LD?.exercise_id && selectedStudId === LD?.student_id && selectedAnswerId === LD?.answer_id ? <div className={styles.checkRow}>
    //       <div className={styles.answer_block}>
    //             <div>
    //                 <div className={styles.wrapper_block}>
    //                 <span className={styles.work_headline}>Задание</span>
    //                 <input className={styles.input_container} type="text" value={localExrciseText} />
    //               </div>
    //               <div className={styles.checkRow}>
    //                 <span className={styles.student_answer}>
    //                   <div className={styles.student_answer_text}>
    //                       <span className={styles.work_headline}>Ответ студента: </span>
    //                       <input className={styles.input_container} type="text" value={LD?.answer_text} />
    //                   </div>
    //                 </span>
    //                 {answer 
    //                   ? <div className={styles.wrapper_block}>
    //                     <span className={styles.work_headline}>Оцените выполнение задания</span>
    //                     <div className={styles.grade_toMark}>
    //                       <span className={markLocal === 1 ? styles.grade_toMark_active : styles.grade_toMark_item} onClick={() => setMarkLocal(1)}>1</span>
    //                       <span className={markLocal === 2 ? styles.grade_toMark_active : styles.grade_toMark_item} onClick={() => setMarkLocal(2)}>2</span>
    //                       <span className={markLocal === 3 ? styles.grade_toMark_active : styles.grade_toMark_item}  onClick={() => setMarkLocal(3)}>3</span>
    //                       <span className={markLocal === 4 ? styles.grade_toMark_active : styles.grade_toMark_item}  onClick={() => setMarkLocal(4)}>4</span>
    //                       <span className={markLocal === 5 ? styles.grade_toMark_active : styles.grade_toMark_item}  onClick={() => setMarkLocal(5)}>5</span>
    //                     </div> 
    //                   </div>
    //                   : <></>
    //                 }
    //               </div>
    //             </div>
    //             <div style={answer ? { display: 'flex' } : { display: 'none' }} className={styles.comment_block}>
    //               <span className={styles.work_headline}>Комментарий ученика</span>
    //               <div className={styles.answer_input}>
    //                 <textarea
    //                   className={styles.studentComment}
    //                   value={LD?.student_comment ? LD?.student_comment : "Студент не оставил комментарии"}
    //                 >
    //                 </textarea>
    //               </div>
    //             </div>
    //           </div>
    //           <div className={styles.comment_block}>
    //             <span className={styles.work_headline}>Добавьте комментарий для ученика</span>
    //             <div className={styles.answer_input}>
    //               <textarea
    //                 className={styles.teacherComment}
    //                 value={teacherCommentLocal}
    //                 onChange={e => {
    //                   // if (symbols !== 0) {
    //                     setTeacherCommentLocal(e.target.value)
    //                     console.log(teacherCommentLocal)
    //                   // }
    //                 }}
    //                 placeholder=""
    //                 // onKeyDown={(e) => onKeyDownHandler(e)}
    //               >
    //               </textarea>
    //             </div>
  
    //             <button
    //               className={styles.sendButton}
    //               onClick={async () => {
    //                 await updateAnswerComment(selectedStudId, selectedExIdForQuery, teacherCommentLocal, new Date())
    //                 await updateAnswerStatus(selectedAnswerId, 'correct', markLocal)
    //                 // await getAnswer(selectedStudId, selectedExId)
    //                 // await getLessonExercises(selectedLessonId)
    //                 // await getLessonExercises22(selectedLessonId)
    //               }}
    //               // disabled={teacherComment == '' ? true : false}
    //             >
    //               Сохранить и отправить
    //             </button>
    //           </div>
    //         </div> 
    //         : <></>}
    //       </div>
          
      
      
    // </div>
    // }
  
    const Exercises = ({LD, i}) => {
      const [realExerciseID, setRealExerciseID] = useState()
  
      useEffect(() => {
        async function getRealExercises () {
          // debugger
          LD.lesson_id
          LD.student_id
          let test = await axios.get(`${globals.productionServerDomain}/getLessonExercises?lesson_id=${LD?.lesson_id}&student_id=${LD?.student_id}`).then(res3 => {
            // res3.data.forEach(item => {
            //   counter += 1
            //   item.exer_number = counter
            // })
            // setExercises(res3.data);
            res3.data
            setRealExerciseID(res3.data[i]?.id)
            // debugger
          })
          // debugger
          // setRealExerciseID(test['data'][i - 1]?.id)
        }
        getRealExercises()
      }, [])
  
  
      return (<div>
        <div 
          className={styles.lesson_work}
          data-index={i}
          style={{opacity: selectedAnswerId === LD?.answer_id ? "1" : "40%"}}
          onClick={() => {
            setMark(LD?.teacher_mark)
            setSelectedExId(LD?.exercise_id)
            setSelectedExIdForQuery(realExerciseID)
            // debugger
            setSelectedStudId(LD?.student_id)
            setSelectedAnswerId(LD?.answer_id)
            setSelectedLessonId(LD?.lesson_id)
            // debugger
          }}
        >
          Задание {i + 1}
        </div>
      </div>)
    }

    return (
        <div className={styles.wrapper_answersRow}>
        <div className={styles.answerRow}>
          <div className={styles.lessons}>
            <div className={styles.lesson_title_wrapper}>
              <p>{answer?.name} {answer?.surname}</p>
              <p>Урок {answer?.lesson_orsder}: {answer?.lesson_title}</p>
            </div>
            <div className={styles.lesson_tesis}>
              <p>Курс: {answer?.course_title}</p>
              <p>Программа: {answer?.program_title}</p>
              <p>Дата урока: {answer?.student_lesson_start_time ? formatDate(answer?.student_lesson_start_time) : answer?.lesson_start_time ? formatDate(answer?.lesson_start_time) : 'не назначено'}</p>
            </div>
            <div className={styles.answer_comment}>
              <p>{answer?.student_comment ? 'Ученик оставил комментарий к заданию' : 'Студент не оставил комментарий'}</p>
            </div>
            <div className={styles.lesson_grade_wrapper}>
              <div className={styles.lesson_grade}>
                {answer?.total_obtained_mark ? `Оценка - ${answer?.average_mark} (${answer?.percent_completed}%)` : 'Ждет проверки'}
              </div>
            </div>
          </div>
          <div className={styles.answerText}>
            {answer.isExpanded && (
              <div>
                {/* <div className={styles.bricksRow}>
                  {lessonData.map((LD, i) => {
                    console.log('LD', LD)
                    console.log('answer', answer)
                    let test = lessonData.filter(el => (el?.lesson_id == answer?.lesson_id && el?.student_id == answer?.student_id))
                    
                    // if ((LD?.lesson_id == answer?.lesson_id && LD?.student_id == answer?.student_id)) {
                      
                    //   debugger
                    // }
                    if (test.length > 0) {
                      debugger
                    }
                    return (
                      <div key={i}>
                        {(LD?.lesson_id == answer?.lesson_id && LD?.student_id == answer?.student_id) ?
                          <>
                          {test.map(el => <>                                    <div>
                              <div 
                                className={styles.lesson_work}
                                data-index={i}
                                style={{opacity: selectedAnswerId === LD?.answer_id ? "1" : "40%"}}
                                onClick={() => {
                                  setMark(LD?.teacher_mark)
                                  setSelectedExId(LD?.exercise_id)
                                  setSelectedStudId(LD?.student_id)
                                  setSelectedAnswerId(LD?.answer_id)
                                  setSelectedLessonId(LD?.lesson_id)
                                }}
                              >
                                Задание {LD?.exercise_order}
                              </div>
                            </div></>)}

                            
                          </>
                          :
                          <></>
                        }
                      </div>
                    )
                  })}
                </div> */}
                <div className={styles.bricksRow}>
                {lessonData.filter(el => (el?.lesson_id == answer?.lesson_id && el?.student_id == answer?.student_id)).map((LD, i) =>  <><Exercises LD={LD} i={i} /></>)}
                </div>
                
                {/* {lessonData.map((LD, i) => {
                  console.log('LD', LD)
                  console.log('answer', answer)
                  return (
                    <div key={i}>
                      <div>
                        {selectedExId === LD?.exercise_id && selectedStudId === LD?.student_id && selectedAnswerId === LD?.answer_id ? <div className={styles.checkRow}>
                          <div className={styles.answer_block}>
                                <div>
                                    <div className={styles.wrapper_block}>
                                    <span className={styles.work_headline}>Задание</span>
                                    <input className={styles.input_container} type="text" value={LD?.exercise_text} />
                                  </div>
                                  <div className={styles.checkRow}>
                                    <span className={styles.student_answer}>
                                      <div className={styles.student_answer_text}>
                                          <span className={styles.work_headline}>Ответ студента: </span>
                                          <input className={styles.input_container} type="text" value={LD?.answer_text} />
                                      </div>
                                    </span>
                                    {answer 
                                      ? <div className={styles.wrapper_block}>
                                        <span className={styles.work_headline}>Оцените выполнение задания</span>
                                        <div className={styles.grade_toMark}>
                                          <span className={mark === 1 ? styles.grade_toMark_active : styles.grade_toMark_item} onClick={() => setMark(1)}>1</span>
                                          <span className={mark === 2 ? styles.grade_toMark_active : styles.grade_toMark_item} onClick={() => setMark(2)}>2</span>
                                          <span className={mark === 3 ? styles.grade_toMark_active : styles.grade_toMark_item}  onClick={() => setMark(3)}>3</span>
                                          <span className={mark === 4 ? styles.grade_toMark_active : styles.grade_toMark_item}  onClick={() => setMark(4)}>4</span>
                                          <span className={mark === 5 ? styles.grade_toMark_active : styles.grade_toMark_item}  onClick={() => setMark(5)}>5</span>
                                        </div> 
                                      </div>
                                      : <></>
                                    }
                                  </div>
                                </div>
                                <div style={answer ? { display: 'flex' } : { display: 'none' }} className={styles.comment_block}>
                                  <span className={styles.work_headline}>Комментарий ученика</span>
                                  <div className={styles.answer_input}>
                                    <textarea
                                      className={styles.studentComment}
                                      value={LD?.student_comment ? LD?.student_comment : "Студент не оставил комментарии"}
                                    >
                                    </textarea>
                                  </div>
                                </div>
                              </div>
                              <div className={styles.comment_block}>
                                <span className={styles.work_headline}>Добавьте комментарий для ученика</span>
                                <div className={styles.answer_input}>
                                  <textarea
                                    className={styles.teacherComment}
                                    value={teacherComment}
                                    onChange={e => {
                                      // if (symbols !== 0) {
                                        setTeacherComment(e.target.value)
                                        console.log(teacherComment)
                                      // }
                                    }}
                                    placeholder=""
                                    // onKeyDown={(e) => onKeyDownHandler(e)}
                                  >
                                  </textarea>
                                </div>

                                <button
                                  className={styles.sendButton}
                                  onClick={async () => {
                                    await updateAnswerComment(selectedStudId, selectedExId, teacherComment, new Date())
                                    await updateAnswerStatus(selectedAnswerId, 'correct', mark)
                                    // await getAnswer(selectedStudId, selectedExId)
                                    // await getLessonExercises(selectedLessonId)
                                    // await getLessonExercises22(selectedLessonId)
                                  }}
                                  // disabled={teacherComment == '' ? true : false}
                                >
                                  Сохранить и отправить
                                </button>
                              </div>
                            </div> : <></>}
                          </div>
                          
                      
                      
                    </div>
                  )
                })} */}
                {/* {lessonData.map((LD, i) => {
                  return (
                    <LessonDataComponent LD={LD} i={i} answer={answer}/>
                  )
                })} */}
                {lessonData.filter(el => (el?.lesson_id == answer?.lesson_id && el?.student_id == answer?.student_id)).map((LD, i) => {
                  return (
                    <LessonDataComponent LD={LD} i={i} answer={answer} selectedExId={selectedExId} selectedStudId={selectedStudId} selectedAnswerId={selectedAnswerId} updateAnswerCommentClicked={updateAnswerCommentClicked} setUpdateAnswerComment={setUpdateAnswerComment}
                    toggleAnswer={toggleAnswer} index={index}
                    buttonIsClicked={buttonIsClicked}
                    setButtonIsClicked={setButtonIsClicked}
                    />
                  )
                })}
              </div>
            )}
          </div>
          
        </div>
        <button className={styles.plusButton} onClick={() => toggleAnswer(index)}>{answer.isExpanded ? "-" : "+"}</button>
       
      </div>
    )
}

export default AnswersHomeWorksOfTeacherComponent
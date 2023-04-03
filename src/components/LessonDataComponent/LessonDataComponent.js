import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import styles from '../../../pages/cabinet/teacher/[url]/homeworks/index.module.css'
import globals from "../../globals";
import axios from "axios";

const LessonDataComponent = ({LD, i, answer, selectedExId, selectedStudId, selectedAnswerId, updateAnswerCommentClicked, setUpdateAnswerComment, toggleAnswer, index}) => {
    const [localExrciseText, setLocalExrciseText] = useState()
    const [teacherCommentLocal, setTeacherCommentLocal] = useState('')
    const [markLocal, setMarkLocal] = useState(0);

    const updateAnswerComment = async (studentId, exerciseId, text, date) => {
        const data = {
          studentId,
          exerciseId,
          text,
          date
        };
    
        await axios({
          method: "post",
          url: `${globals.productionServerDomain}/createTeacherComment`,
          data: data,
        })
          .then(function (res) {
            alert("Комментарий отправлен");
          })
          .catch((err) => {
            alert("Произошла ошибка");
          });
      }

    const updateAnswerStatus = async (id, status, mark) => {
        const data = {
          id,
          status,
          mark
        };
        await axios({
          method: "put",
          url: `${globals.productionServerDomain}/updateAnswerStatus`,
          data: data,
        })
          .then(function (res) {
            alert("Отметка о выполнении изменена");
          })
          .catch((err) => {
            alert("Произошла ошибка");
          });
      }
    useEffect(() => {
      LD
      async function test () {
        let getExercises = await axios.post(`${globals.productionServerDomain}/getExercisesByLessonId/` + LD?.lesson_id)
        let localLesson = getExercises['data'][i]
        setLocalExrciseText(localLesson?.text)
        // debugger
      }
      test()
      setMarkLocal(LD.teacher_mark)
      // debugger
    }, [])

    useEffect(() => {
        if (updateAnswerCommentClicked) {
            async function submitCommentAndMark () {
                await updateAnswerComment(selectedStudId, realExerciseID, teacherCommentLocal, new Date())
                await updateAnswerStatus(LD?.answer_id, 'correct', markLocal)
                
            }
            submitCommentAndMark()
        }
    }, [updateAnswerCommentClicked])


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

    return <div key={i}>
    <div>
      {selectedExId === LD?.exercise_id && selectedStudId === LD?.student_id && selectedAnswerId === LD?.answer_id ? <div className={styles.checkRow}>
        <div className={styles.answer_block}>
              <div>
                  <div className={styles.wrapper_block}>
                  <span className={styles.work_headline}>Задание</span>
                  <input className={styles.input_container} type="text" value={localExrciseText} />
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
                        <span className={markLocal === 1 ? styles.grade_toMark_active : styles.grade_toMark_item} onClick={() => setMarkLocal(1)}>1</span>
                        <span className={markLocal === 2 ? styles.grade_toMark_active : styles.grade_toMark_item} onClick={() => setMarkLocal(2)}>2</span>
                        <span className={markLocal === 3 ? styles.grade_toMark_active : styles.grade_toMark_item}  onClick={() => setMarkLocal(3)}>3</span>
                        <span className={markLocal === 4 ? styles.grade_toMark_active : styles.grade_toMark_item}  onClick={() => setMarkLocal(4)}>4</span>
                        <span className={markLocal === 5 ? styles.grade_toMark_active : styles.grade_toMark_item}  onClick={() => setMarkLocal(5)}>5</span>
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
                  value={teacherCommentLocal}
                  onChange={e => {
                    // if (symbols !== 0) {
                      setTeacherCommentLocal(e.target.value)
                      console.log(teacherCommentLocal)
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
                    setUpdateAnswerComment(true)
                    
                //   await updateAnswerComment(selectedStudId, realExerciseID, teacherCommentLocal, new Date())
                //   await updateAnswerStatus(LD?.answer_id, 'correct', markLocal)

                  // await getAnswer(selectedStudId, selectedExId)
                  // await getLessonExercises(selectedLessonId)
                  // await getLessonExercises22(selectedLessonId)
                }}
                // disabled={teacherComment == '' ? true : false}
              >
                Сохранить и отправить
              </button>
            </div>
          </div> 
          : <></>}
        </div>
        
    
    
  </div>
  }

export default React.memo(LessonDataComponent)
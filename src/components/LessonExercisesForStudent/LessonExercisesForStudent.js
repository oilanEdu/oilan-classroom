import { useEffect, useState } from "react";
import styles from "./LessonExercisesForStudent.module.css";
import axios from "axios";
import globals from "../../globals";

const LessonExercisesForStudent = ({fetchData, exercises, student, bg, padding, brickBorder}) => {
  const [ active, setActive ] = useState(0);
  const [ answer, setAnswer ] = useState('')
  const [ editMode, setEditMode ] = useState(false)
  const [ teacherComments, setTeacherComments ] = useState([])
  const [ symbols, setSymbols ] = useState(1500);
  const [ exerciseText, setExerciseText ] = useState([])
  function linkify(text) {
    var url_pattern = /(https?:\/\/\S+)/g;
    // return text.replace(url_pattern, '<a href="$1">$1</a>');
    // let result = text?.replace(url_pattern, '<a href="$1">$1</a>')
    // let result2 = result?.split('<a').join(' SplitLinkHere ').split('a>').join(' SplitLinkHere ')
    // let result3 = result2?.split('SplitLinkHere')


    let test = text?.split(url_pattern)

    console.log(test, "splitter");
    // return result3 
    setExerciseText(test)
    // console.log(text?.replace(url_pattern, '<a href="$1">$1</a>'), "REPLACER");
  }
 
  console.log(padding); 

  // function linkify(arg) {
  //   let result = [];
  //   let regex = /(\b\w+\b)((?:https?:\/\/)?(?:www\.)?\S+)/g;
  //   let match;
    
  //   while ((match = regex.exec(arg)) !== null) {
  //     result.push({
  //       text: match[1],
  //       link: match[2]
  //     });
  //   }
  
  //   console.log(result, "REPLACER", arg);
  //   return result;
  // }

  console.log("eeeeee", exercises)
  console.log(student)
  const openExer = e => setActive(+e.target.dataset.index);
  useEffect(() => {
    
    if (active != null) {
      let studentId = student
      let exerciseId = exercises[active]?.id
      let data = {
        studentId,
        exerciseId
      };
      let exerciseAnswer = axios({
        method: "post",
        url: `${globals.productionServerDomain}/getTeacherCommentsByStudExId`,
        data: data,
      })
        .then(function (res) {
          if (res.data[0]){
              setTeacherComments(res.data)
              // console.log('EXE', res.data[0].status)
              // exercise.answer_status = res.data[0].status
              // exercise.teacher_comment = res.data[0].comment 
          }else{
              console.log('ответов нет')
              setTeacherComments([])
          }
        })
        .catch((err) => {
          alert("Произошла ошибка");   
        });
      
      linkify(exercises[active]?.text)
    }
  }, [active])
  
  const sendAnswer = async (answerText, lessonId, exerciseId, studentId, status) => {
    const data = {
          answerText,
          lessonId,
          exerciseId,
          studentId,
          status
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

  const sendEditedAnswer = async (answerText, answerId, status) => {
    const data = {
          answerText,
          answerId,
          status
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

  const ExerciseText = (props) => {
    // useEffect(() => {

    // }, [])
    // {index % 2 === 0 ? <p>{el}</p> : <a href={el}>{el}</a>}

    return <>
    {/* {props.indexOfText % 2 === 0 ? <p>{props.el}</p> : <a href={props.el}>{props.el}</a>} */}
    {props.exerciseText?.map((el, index) => index % 2 === 0 ? el : <a href={el}>{el}</a>)}
    </>
  }
  return <div style={{ backgroundColor: bg, padding: padding}} className={styles.container}>
    {width <= 480 ? '' : <>
    <div className={styles.exercises}>
      <h3 className={styles.exercises_title}>Домашние задания</h3>
      {exercises.map((exer, i) => {
        return <div 
          style={exercises[active]?.id == exer.id 
            ? {} 
            : {border: brickBorder}
          }
          className={exercises[active]?.id == exer.id 
            ? styles.blueBrickBorder
            : styles.whiteBrickBorder
          } 
        >
          <div 
            className={
              exer.answer_text == undefined 
              ? styles.emptyExercise
              : 
                exer.answer_status == 'correct'
                ? styles.correctExercise
                : exer.answer_status == 'uncorrect'
                ? styles.uncorrectExercise
                : styles.notCheckedExercise
            } 
            onClick={openExer}
            data-index={i}
          >
            {exer.exer_number}
          </div>
        </div>
      })}
    </div>
    {exercises[active] && <div>
      {!exercises[active].answer_text?
      (
        <>
          <p className={styles.answer_text}>
            {exercises[active].exer_number}) <ExerciseText exerciseText={exerciseText}/>
          </p>
          <div className={styles.answer_row}>
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
              <label>
                Осталось символов <span>{symbols}</span>
              </label>
            </div>
            
            <button 
              className={styles.answer_btn}
              onClick={async() => {
                await sendAnswer(answer, exercises[active].lesson_id, exercises[active].id, student, 'not verified')
                await fetchData()
              }}
            >
              Ответить
            </button>
          </div>
        </>
      ):
      (<>
          <div className={styles.reTryBlock}>
            {/* {exerciseText.map((el, index) => {
              
            })} */}
            <p>
            Задание: <ExerciseText exerciseText={exerciseText}/>
            </p>
            {/* <span>Задание: {exerciseText.map((el, index) => el)}</span> */}
            <span>Ваш ответ: {exercises[active].answer_text}</span>
            <div className={styles.advice}>{exercises[active].answer_status == 'correct'?<><div className={styles.correctAdvice}></div>Сдано на отлично</>:exercises[active].answer_status == 'uncorrect'?<><><div className={styles.uncorrectAdvice}></div>Есть ошибки попробуйте снова</></>:''}</div>
            <button 
              className={styles.reanswer_btn}
              onClick={() => {
                setEditMode(true)
              }}
            >
              Изменить ответ
            </button>
            {editMode?
              (
              <>
                <div className={styles.editAnswerBlock}>
                  <div>
                    <div className={styles.answer_input}>
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
                      <label>
                        Осталось символов <span>{symbols}</span>
                      </label>
                    </div>
                    <button 
                      className={styles.answer_btn}
                      onClick={async() => {
                        await sendEditedAnswer(answer, exercises[active].answer_id, 'not verified')
                        await fetchData()
                      }}
                    >
                      Ответить
                    </button>
                  </div>
                </div>
              </>):(<></>)
            }
            <div>
              <div className={styles.teacherComment}><img src="https://realibi.kz/file/108886.png" className={styles.mailLogo}/><span>Комментарий преподователя:</span></div>
              {teacherComments.map(comment => {
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
    </>}

    {/* //начинается мобильная вёрстка */}
    {width <= 480 ? 
    <> <div className={styles.exercises}>
    <h3 className={styles.exercises_title}>Домашние задания</h3>
    {exercises.map((exer, i) => {
      return <div 
        style={exercises[active]?.id == exer.id 
          ? {} 
          : {border: brickBorder}
        }
        className={exercises[active]?.id == exer.id 
          ? styles.blueBrickBorder
          : styles.whiteBrickBorder
        } 
      >
        <div 
          className={
            exer.answer_text == undefined 
            ? styles.emptyExercise
            : 
              exer.answer_status == 'correct'
              ? styles.correctExercise
              : exer.answer_status == 'uncorrect'
              ? styles.uncorrectExercise
              : styles.notCheckedExercise
          } 
          onClick={openExer}
          data-index={i}
        >
          {exer.exer_number}
        </div>
      </div>
    })}
  </div>
  {exercises[active] && <div>
    {!exercises[active].answer_text?
    (
      <>
        <p className={styles.answer_text}>
          {exercises[active].exer_number}) <ExerciseText exerciseText={exerciseText}/>
        </p>
        <div className={styles.answer_row}>
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
            <label>
              Осталось символов <span>{symbols}</span>
            </label>
          </div>
          
          <button 
            className={styles.answer_btn}
            onClick={async() => {
              await sendAnswer(answer, exercises[active].lesson_id, exercises[active].id, student, 'not verified')
              await fetchData()
            }}
          >
            Ответить
          </button>
        </div>
      </>
    ):
    (<>
        <div className={styles.reTryBlock}>
          {/* <span>Задание: {exerciseText}</span> */}
          <p>
          Задание: <ExerciseText exerciseText={exerciseText}/>
            </p>
          <span>Ваш ответ: {exercises[active].answer_text}</span>
          <div className={styles.advice}>{exercises[active].answer_status == 'correct'?<><div className={styles.correctAdvice}></div>Сдано на отлично</>:exercises[active].answer_status == 'uncorrect'?<><><div className={styles.uncorrectAdvice}></div>Есть ошибки попробуйте снова</></>:''}</div>
          <button 
            className={styles.reanswer_btn}
            onClick={() => {
              setEditMode(true)
            }}
          >
            Изменить ответ
          </button>
          {editMode?
            (
            <>
              <div className={styles.editAnswerBlock}>
                <div>
                  <div className={styles.answer_input}>
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
                    <label>
                      Осталось символов <span>{symbols}</span>
                    </label>
                  </div>
                  <button 
                    className={styles.answer_btn}
                    onClick={async() => {
                      await sendEditedAnswer(answer, exercises[active].answer_id, 'not verified')
                      await fetchData()
                    }}
                  >
                    Ответить
                  </button>
                </div>
              </div>
            </>):(<></>)
          }
          <div>
            <div className={styles.teacherComment}><img src="https://realibi.kz/file/108886.png" className={styles.mailLogo}/><span>Комментарий преподователя:</span></div>
            {teacherComments.map(comment => {
            return <div className={styles.comment}>
            <span>{comment.text}</span>
            <span className={styles.commentDate}>{comment.date?.toLocaleString().substring(0, 10)} {comment.date?.toLocaleString('ru', { hour12: false }).substring(11, 16)}</span>  
          </div> 
        })}
          </div>
        </div>
    </>)
  }
    </div>}</>
    : ''}
  </div>
};

export default LessonExercisesForStudent;
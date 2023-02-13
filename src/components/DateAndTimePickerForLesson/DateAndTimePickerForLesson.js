import axios from "axios";
import { useEffect, useState } from "react";
import globals from "../../globals";
import styles from './DateAndTimePickerForLesson.module.css'

function DateAndTimePickerForLesson(props) {
  const [errorOfDate, setErrorOfDate] = useState(false)

  let dateStr = new Date(props.lesson.personal_time ? props.lesson.personal_time : props.lesson.start_time)
  let dateStrTime = new Date(props.lesson.personal_time ? props.lesson.personal_time : props.lesson.start_time).toLocaleTimeString();
  useEffect(() => {
    const newLessons = [...props.lessons2];
    const index2 = newLessons.findIndex(el => el.id === props.lesson_id);
    dateStr = new Date(props.lessons2[index2].personal_time ? props.lessons2[index2].personal_time : props.lessons2[index2].start_time)
    dateStrTime = new Date(props.lessons2[index2].personal_time ? props.lessons2[index2].personal_time : props.lessons2[index2].start_time).toLocaleTimeString();

    console.log("testo", props.lessons2.map(el => new Date(dateAndTimeMerger).getTime() > new Date(el.personal_time).getTime() && props.lesson_order > el.lesson_order ));
    // if (props.lessons2.map(el => new Date(dateAndTimeMerger).getTime() > new Date(el.personal_time).getTime() && props.lesson_order > el.lesson_order )) {
      
    // }  
    // if (props.lessons2.map(el => new Date(dateAndTimeMerger).getTime() < new Date(el.personal_time).getTime() && props.lesson_order < el.lesson_order )) {
      
    // }
    // console.log("testo2",    props.lessons2.map((el, index) => {if (new Date(dateAndTimeMerger).getTime() > new Date(el.personal_time).getTime() && props.lesson_order > el.lesson_order) {
      
    // } else {
    //   setErrorOfDate(true)
    // }}));
    let array = props.lessons2.map(el => new Date(dateAndTimeMerger).getTime() > new Date(el.personal_time).getTime() && props.lesson_order > el.lesson_order )
    console.log(array, "testo2");
  }, [props.lessons2])

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

  // let time = dateStr.getHours() + ":" + dateStr.getMinutes();
  // let timeHours = dateStr.getHours()
  // let timeHours2 = timeHours.length == 1 ? "0" + timeHours : timeHours  
    // let time2 = time.length < 10 ? "0" + time : ''

  const [dateState, setDateState] = useState(formated_date);
  const [timeState, setTimeState] = useState(dateStrTime)

 
  
  let dateAndTimeMerger = dateState+" "+timeState

  const saveLessonDateAndTimeHandler = async () => { 
    if (props.saveIsClicked == true) {
      props.saveLessonDateAndTime(dateAndTimeMerger, props.lesson.id, props.lesson.course_id, props.student.student_id)
    } 
  }

  useEffect(() => {
    console.log(props, "PROPS oF DATE AND TIME");
    setTimeState(dateStrTime)
  }, []);
  useEffect(() => { 
    saveLessonDateAndTimeHandler()
  }, [props.saveIsClicked]) 

  useEffect(() => {
    // const newColors = [...colors];
    // const index = newColors.findIndex(color => color.id === 2);
    // newColors[index] = { ...newColors[index], text: 'new text' };

    const newLessons = [...props.lessons2];
    const index2 = newLessons.findIndex(el => el.id === props.lesson_id);
    newLessons[index2] = { ...newLessons[index2], personal_time: dateAndTimeMerger };
    props.setLessons2(newLessons)
    
  }, [timeState, dateState])
  useEffect(() => {
    console.log(props.lessons2, "props.lessons2");
    const index2 = props.lessons2.findIndex(el => el.id === props.lesson_id);
    // let array = props.lessons2.slice(0, index2)
    // let array1 = props.lessons2.slice(-index2)
    // console.log(array, "array");
    // let array2 = array.map(el => new Date(dateAndTimeMerger).getTime() > new Date(el.personal_time).getTime() && props.lesson_order > el.lesson_order )
    // let array3 = array1.map(el => new Date(dateAndTimeMerger).getTime() > new Date(el.personal_time).getTime() && props.lesson_order > el.lesson_order )
    // console.log(array2, "array2");
    // console.log(array3, "array3");
    //Определение ошибки
    props.lessons2.map(el => {if (props.lesson_order > el.lesson_order) {
      if (new Date(dateAndTimeMerger).getTime() < new Date(el.personal_time).getTime()) {
       setErrorOfDate(true) 
      }
    }

    //Определение правильности
    let array1 = props.lessons2.slice(0, index2)
    console.log(array1, "array1");
    let array = array1.map(el => new Date(dateAndTimeMerger).getTime() > new Date(el.personal_time).getTime() && props.lesson_order > el.lesson_order )


    if (array.every(Boolean)) {
      setErrorOfDate(false) 
    }
    
  })
  }, [props.lessons2])

  return (
    <div className={styles.wrapper}> 
      <p className={styles.title}>№{props.lesson.lesson_number} Занятие  - {props.lesson.title}</p> 
      <div 
      className={styles.inputsWrapper}>
      <input
        style={{borderColor: errorOfDate ? "red" : ""}}
        className={styles.inputs}
        id="date"
        type="date"
        value={dateState}
        onChange={(e) => {setDateState(e.target.value)}}
      ></input>
      <input
        style={{borderColor: errorOfDate ? "red" : ""}}
        className={styles.inputs}
        type="time"
        value={timeState} 
        onChange={(e) => setTimeState(e.target.value)}>
      </input>
      </div>
    </div>
  );
}

export default DateAndTimePickerForLesson;

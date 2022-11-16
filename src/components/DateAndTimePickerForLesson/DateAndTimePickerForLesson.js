import axios from "axios";
import { useEffect, useState } from "react";
import globals from "../../globals";
import styles from './DateAndTimePickerForLesson.module.css'

function DateAndTimePickerForLesson(props) {

  let dateStr = new Date(props.lesson.start_time)
  let dateStrTime = new Date(props.lesson.personal_time ? props.lesson.personal_time : props.lesson.start_time).toLocaleTimeString();

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
       

  return (
    <div className={styles.wrapper}> 
      <p className={styles.title}>№{props.lesson.lesson_number} Занятие  - {props.lesson.title}</p> 
      <div className={styles.inputsWrapper}>
      <input
        className={styles.inputs}
        id="date"
        type="date"
        value={dateState}
        onChange={(e) => setDateState(e.target.value)}
      ></input>
      <input
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

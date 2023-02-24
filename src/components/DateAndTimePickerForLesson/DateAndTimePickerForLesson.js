import axios from "axios";
import { useEffect, useState } from "react";
import globals from "../../globals";
import styles from './DateAndTimePickerForLesson.module.css'

function DateAndTimePickerForLesson(props) {
  const [errorOfDate, setErrorOfDate] = useState(false)
  const [errorOfDateLesson, setErrorOfDateLesson] = useState(false)
  const [errorOfDateOfGoingLesson, setErrorOfDateOfGoingLesson] = useState(false)
  const [errorOfDateOfGoingLessonLesson, setErrorOfDateOfGoingLessonLesson] = useState(false)
  const [studentOfError, setStudentOfError] = useState()
  useEffect(() => {
    console.log(studentOfError, "studentOfError"); 
  }, [studentOfError])

  let dateStr = new Date(props.lesson.personal_time ? props.lesson.personal_time : props.lesson.start_time)
  let dateStrTime = new Date(props.lesson.personal_time ? props.lesson.personal_time : props.lesson.start_time).toLocaleTimeString();
  useEffect(() => {
    const newLessons = [...props.lessons2];
    const index2 = newLessons.findIndex(el => el.id === props.lesson_id);
    dateStr = new Date(props.lessons2[index2].personal_time ? props.lessons2[index2].personal_time : props.lessons2[index2].start_time)
    dateStrTime = new Date(props.lessons2[index2].personal_time ? props.lessons2[index2].personal_time : props.lessons2[index2].start_time).toLocaleTimeString();
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
    setDateState(formated_date)
    setTimeState(dateStrTime)
    // debugger

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

    //ПРОИСХОДИТ ИЗМЕНЕНИЕ ДАТЫ И ВРЕМЕНИ, ПОСЛЕ ИЗМЕНЕНИЯ ПРОЙДУТ ПРОВЕРКИ НА КОРРЕКТНОСТЬ

    const newLessons = [...props.lessons2];
    const index2 = newLessons.findIndex(el => el.id === props.lesson_id);
    newLessons[index2] = { ...newLessons[index2], personal_time: dateAndTimeMerger };
    props.setLessons2(newLessons)
    
  }, [timeState, dateState])
  useEffect(() => {
    //ниже весь код - определение того чтобы все уроки были выставлены по порядку, чтобы первый урок не начался раньше первого
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
       setErrorOfDateLesson(el)
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

    // allStudentsLessons
    //В качестве определения ошибки тут будет setErrorOfDateOfGoingLesson, в итоге будет два условия для выявления ошибки, при выполнении хоть одной из них - выявлять ошибку.
    function compareDates(date, datesArray) {
      const oneHourInMs = 60 * 60 * 1000; // один час в миллисекундах
    
      for (let i = 0; i < datesArray.length; i++) {
        const differenceInMs = Math.abs(new Date(date).getTime() - new Date(datesArray[i].personal_time).getTime()); // разница в миллисекундах между двумя датами
        const test1 = new Date(date).getTime()
        const test2 = new Date(datesArray[i].personal_time).getTime()
        if ((differenceInMs < oneHourInMs && differenceInMs != 0 && datesArray[i].id != props.lesson_id) || (differenceInMs === 0 && datesArray[i].id != props.lesson_id)) {
          debugger
          setErrorOfDateOfGoingLesson(true)
          setErrorOfDateOfGoingLessonLesson(datesArray[i])
          return true; // если разница в один час, вернуть true
        }
      }
      debugger
      setErrorOfDateOfGoingLesson(false)
      return false; // если ни одна дата не отличается на один час, вернуть false
    }
    const mergedArr = props.lessons2.reduce((acc, curr) => {
      const matchingObj = acc.find(obj => obj.id === curr.id);
      if (matchingObj) {
        Object.assign(matchingObj, curr);
      } else {
        acc.push(curr);
      }
      return acc;
    }, [props.allStudentsLessons]);
    // console.log(mergedArr, "mergedArr");
    compareDates(props.lesson.personal_time, mergedArr)
  }, [props.lessons2])

  useEffect(() => {
    if (errorOfDateOfGoingLessonLesson.student_id != undefined) {
      async function test() {
        let student_id = errorOfDateOfGoingLessonLesson.student_id
        let data =  {
          student_id
        }
        let test1 = await axios.post(`${globals.productionServerDomain}/getStudentById`, data);
        setStudentOfError(test1.data[0])
        // let student_id = errorOfDateOfGoingLessonLesson.student_id
        // let data = {
        //   student_id
        // }
        // let getStudent = await axios({
        //   method: "post",
        //   url: `${globals.productionServerDomain}/getStudentById`,
        //   data: data,
        // }) 
        //   .then(function (res) {
        //     if (res.data[0]){
        //       setStudentOfError(res.data[0])
        //         // console.log('EXE', res.data[0].status)
        //         // exercise.answer_status = res.data[0].status
        //         // exercise.teacher_comment = res.data[0].comment 
        //     }else{
        //         console.log('ответов нет')
        //         // setStudent()
        //     }
        //   })
        //   .catch((err) => {
        //     alert("Произошла ошибка");   
        //   });
      }
      test()
    }
  }, [errorOfDateOfGoingLessonLesson])
  return (
    <div className={styles.wrapper}> 
      <p className={styles.title}>№{props.lesson.lesson_number} Занятие  - {props.lesson.title}</p> 
      <div 
      className={styles.inputsWrapper}>
      <input
        style={{borderColor: errorOfDate || errorOfDateOfGoingLesson ? "red" : ""}}
        className={styles.inputs}
        id="date"
        type="date"
        value={dateState}
        onChange={(e) => {setDateState(e.target.value)}}
      ></input>
      <input
        style={{borderColor: errorOfDate || errorOfDateOfGoingLesson ? "red" : ""}}
        className={styles.inputs}
        type="time"
        value={timeState} 
        onChange={(e) => setTimeState(e.target.value)}>
      </input>
      <p style={{display: errorOfDate || errorOfDateOfGoingLesson ? "block" : "none", margin: "0", color: "red", textAlign: "end"}}>
        {errorOfDate ? <>Занятие номер {props.lesson.lesson_order} не может быть раньше занятия номер {errorOfDateLesson.lesson_order} <br/></> : ''}
        {errorOfDateOfGoingLesson ? <>Занятие номер {props.lesson.lesson_order} совпадает по времени с занятием номер {errorOfDateOfGoingLessonLesson.lesson_order} {errorOfDateOfGoingLessonLesson.student_id === props.lesson.student_id ? '' : <>студента {studentOfError?.surname} {studentOfError?.name}</>}</> : ''}
      </p>
      </div>
    </div>
  );
}

export default DateAndTimePickerForLesson;

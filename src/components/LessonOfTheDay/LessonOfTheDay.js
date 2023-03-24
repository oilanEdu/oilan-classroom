import axios from "axios";
import { useEffect, useState } from "react";
import globals from "../../globals";
import styles from "../Calendar_2/styles.module.css"


const LessonOfTheDay = ({day, lesson2}) => {
    const [lesonOfTheDay, setLesonOfTheDay] = useState()
    const [formattedTime, setFormattedTime] = useState()
    const [formattedTime2, setFormattedTime2] = useState()
    useEffect(() => {
      if (lesson2.student_id != undefined) {
        async function test() {
          let student_id = lesson2.student_id
          let data = {
            student_id 
          }
          let test1 = await axios.post(`${globals.productionServerDomain}/getStudentById`, data);
          setLesonOfTheDay(test1.data[0])
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

        function getFormattedTime(date) {
          console.log("getShiftedTime", date);
          if (date != undefined) {
            // Вычисляем количество миллисекунд, соответствующее указанному количеству минут
            // const millisecondsShift = minutes * 60 * 1000;
            
            // Вычисляем новое время, сдвинутое на указанное количество минут
            const dateOfPersonalTime = new Date(date)
            // const shiftedTime = new Date(dateOfPersonalTime.getTime() + millisecondsShift);
            
            // Получаем часы и минуты из нового времени
            const hours = dateOfPersonalTime.getHours();
            const minutesFormatted = dateOfPersonalTime.getMinutes() < 10 ? `0${dateOfPersonalTime.getMinutes()}` : dateOfPersonalTime.getMinutes();
            
            // Форматируем часы и минуты в строку в формате "hh:mm"
            const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutesFormatted}`;
            
            // Возвращаем отформатированную строку
            setFormattedTime(formattedTime)
          } else {
            setFormattedTime("Следующее занятие не запланировано")
          }
          return formattedTime;
        }
        getFormattedTime(lesson2?.personal_time ? lesson2?.personal_time : lesson2?.start_time)


        // function getShiftedTime(date, minutes) {
        //   console.log("getShiftedTime", date, minutes);
        //   if (date != undefined) {
        //     // Вычисляем количество миллисекунд, соответствующее указанному количеству минут
        //     const millisecondsShift = minutes * 60 * 1000;
            
        //     // Вычисляем новое время, сдвинутое на указанное количество минут
        //     const dateOfPersonalTime = new Date(date)
        //     const shiftedTime = new Date(dateOfPersonalTime.getTime() + millisecondsShift);
            
        //     // Получаем часы и минуты из нового времени
        //     const hours = shiftedTime.getHours();
        //     const minutesFormatted = shiftedTime.getMinutes() < 10 ? `0${shiftedTime.getMinutes()}` : shiftedTime.getMinutes();
            
        //     // Форматируем часы и минуты в строку в формате "hh:mm"
        //     const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutesFormatted}`;
            
        //     // Возвращаем отформатированную строку
        //     setFormattedTime2(formattedTime)
        //     debugger
        //   } else {
        //     setFormattedTime2("Следующее занятие не запланировано")
        //   }
        //   return formattedTime;
        // }
        // getShiftedTime(lesson2?.personal_time ? lesson2?.personal_time : lesson2?.start_time , lesson2.lesson_duration) 
      }
    }, [])
    return (
      <div>
        {lesonOfTheDay?.name} {lesonOfTheDay?.surname} <br/>
        {formattedTime}
        {/* {formattedTime} - {formattedTime2} */}
      </div>
    )
  }

export default LessonOfTheDay
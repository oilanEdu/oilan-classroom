import { useEffect, useState } from "react";
import globals from "../../globals";
import CopyLink from "../CopyLink/CopyLink";
import DateAndTimePickerForLesson from "../DateAndTimePickerForLesson/DateAndTimePickerForLesson";
const axios = require("axios").default;
import styles from './ProgramStatus.module.css'

const ProgramStatus = ({student, index, program, allStudentsLessons}) => {
  const [check, setCheck] = useState(program.status === "process" ? false : true);
  console.log(check);
  const [lessons, setLessons] = useState([]);
  const [saveIsClicked, setSaveIsClicked] = useState(false)

  const saveLessonDateAndTime = async (dateAndTimeMerger, lesson_id, course_id, student_id) => {
    if (dateAndTimeMerger.length > 10) {
      const dataForGetSchedule = {
        lesson_id, 
        course_id,
        student_id 
      };  
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
  } 

  const updateStudentProgramStatus = async() => { 
    const data = {
      studentId: program.student_id, 
      programId: program.program_id, 
      status: check === false ? "complieted" : "process"
    }; 

    console.log(data);

    console.log(data);
    await axios({
      method: "put",
      url: `${globals.productionServerDomain}/updateStudentProgramStatus`, 
      data: data,
    })
      .then(function (res) {
        alert("Данные успешно изменены"); 
      })
      .catch((err) => {
        alert("Произошла ошибка");
      });
  };

  const loadStudentLessons = async (studentId, programId) => {
    const data = {
      studentId, 
      programId
    };
    console.log('studentId, programId MODAL', studentId, programId)  
    await axios({
      method: "post",
      url: `${globals.productionServerDomain}/getStudentLessonsByProgramId`,
      data: data,
    })
      .then(function (res) {
        let lessons = res.data
        let lesson_number = 0
        res.data.forEach(lesson => { 
            lesson_number += 1  
            lesson.lesson_number = lesson_number
        })
        console.log("lessonsMODAL", lessons)
        setLessons(lessons)
      })
      .catch((err) => {
        alert("Произошла ошибка");
      });
    // console.log('lessons', lessons)
  }

  useEffect(() => {
    loadStudentLessons(program.student_id, program.program_id)
  }, [])

  const onChangeHandler = async () => {
    await setCheck(!check);
    await updateStudentProgramStatus();
  }

  console.log(lessons);
  console.log(program);

  return <div className={styles.program_contain}>
    <p className={styles.program_title}>{program.title}</p>
    <p>Поделитесь со студентом ссылкой на его личный кабинет</p>
    <CopyLink url={"oilan-classroom.com/cabinet/student/" + student?.nickname + "/course/" + program.course_url + "?program=" + program.program_id}/>
    <h3 className={styles.title}>Выбрать даты и время для занятий по курсу</h3>
    <div className={styles.innerWrapper}>
      <div className={styles.timetablesWrapper}>
        {lessons?.map(lesson => 
          <DateAndTimePickerForLesson 
            allStudentsLessons={allStudentsLessons} 
            lessons2={lessons} 
            setLessons2={setLessons} 
            lesson={lesson} 
            lesson_id={lesson.id} 
            lesson_order={lesson.lesson_order} 
            student={student} 
            saveLessonDateAndTime={saveLessonDateAndTime} 
            saveIsClicked={saveIsClicked}
          /> 
        )} 
      </div>
    </div>
    <div className={styles.check_end}>
      <label>
        Обучение на курсе окончено
        <input type="checkbox" checked={check} onChange={onChangeHandler} /> 
      </label>
    </div>
    
  </div>
};

export default ProgramStatus;
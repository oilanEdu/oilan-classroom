import axios from "axios";
import { useEffect, useState } from "react";
import globals from "../../globals";
import DateAndTimePickerForLesson from "../DateAndTimePickerForLesson/DateAndTimePickerForLesson";
import styles from './ModalForLessonConfiguration.module.css'
 
function ModalForLessonConfiguration(props) {
  const [studentProgramUpcoming, setStudentProgramUpcoming] = useState(props?.student?.program_id);
  const [lessonsUpcoming, setLessonsUpcoming] = useState()
  const [saveIsClicked, setSaveIsClicked] = useState(false)
  const [lessonsUpcomingIsLoaded, setLessonsUpcomingIsLoaded] = useState()
  useEffect(() => {
    var wrapper = document.getElementById("wrapper")

    wrapper.addEventListener("overflow", function( event ) {
      console.log( event );
  }, false);
    wrapper.addEventListener("underflow", function( event ) {
      console.log( event );
  }, false);
  }, [])
  useEffect(() => {
    console.log("lessonsUpcoming", lessonsUpcoming);
  }, [lessonsUpcoming])

  const saveLessonDateAndTime = async (dateAndTimeMerger, lesson_id, course_id, student_id) => {
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
        setLessonsUpcoming(lessons)
        // setLessonsUpcomingIsLoaded(true)
      })
      .catch((err) => {
        alert("Произошла ошибка");
      });
    // console.log('lessons', lessons)
  }
  let loadLessonsByProgram = async (value) => {
    console.log("value", value) 
    let studentLessons = axios.post(`${globals.productionServerDomain}/getLessonsByProgramId/` + value).then(res => {
    let lessons = res.data
    let lesson_number = 0
      res.data.forEach(lesson => {
          lesson_number += 1
          lesson.lesson_number = lesson_number
      })
    let lessonsOfProgramButNotOfStudent = lessons.filter(element => !lessonsUpcoming.find(item => item.id === element.id));
    let mixedArray = lessonsUpcoming.concat(lessonsOfProgramButNotOfStudent)
    setLessonsUpcoming(mixedArray)
    })} 
    useEffect(() => {
      if (lessonsUpcoming != undefined) {
        loadLessonsByProgram(studentProgramUpcoming) 
      }
    }, [lessonsUpcoming])
 
  // useEffect(() => {
  //   loadStudentLessons(props?.student?.student_id, props?.student?.program_id)
  //   console.log("lessonsUpcomingIsLoaded", lessonsUpcomingIsLoaded)
  // }, [lessonsUpcomingIsLoaded])
  useEffect(() => {
    console.log("propsOfModal", props)
    loadStudentLessons(props?.student?.student_id, props?.student?.program_id)
  }, []) 

  const [lessons2, setLessons2] = useState()
  useEffect(() => {
    console.log(lessons2, "lessons2");
  }, [lessons2])
  useEffect(() => {
    if (lessonsUpcoming != undefined) {
      setLessons2(lessonsUpcoming) 
    }
  }, [lessonsUpcoming])
  return (
    <div >
      <div className={styles.blackBackground}>

      </div>
      {props.showModalLesson ? (
        <div className={styles.modalWrapper} id="wrapper">
          <div className={styles.close} onClick={() => props.setShowModalLesson(!props.showModalLesson)}>
          
          </div>
          <h3 className={styles.title}>ВЫБРАТЬ ПРОГРАММУ ДЛЯ СТУДЕНТА</h3>
          <div className={styles.innerWrapper}>
          <div className={styles.student}>
            <div className={styles.studentImg} style={{backgroundImage: "url(https://realibi.kz/file/318865.png)"}}></div>
            <div className={styles.studentName}>
             <p>{props.student.name} {props.student.surname}</p>
             <p>id: {"0".repeat(7 - String(props.student.student_id).length) + props.student.student_id}</p> 
            </div>
          </div> 
          <select
          className={styles.select}
            onChange={(e) => {
              setStudentProgramUpcoming(e.target.value);
              loadLessonsByProgram(e.target.value)
            }}
            value={studentProgramUpcoming}
          >
            <option value="0" disabled>
              Выбрать
            </option>
            {props.programs.map((program) =>
              program.course_id == props.student.course_id ? (
                <option value={program.id}>{program.title}</option>
              ) : (
                <></>
              )
            )}
          </select>
          </div>


          <h3 className={styles.title}>ВЫБРАТЬ ДАТЫ И ВРЕМЯ ЗАНЯТИЙ</h3>
          <div className={styles.innerWrapper}>
            <div className={styles.timetablesWrapper}>
            {lessons2?.map(lesson => 
                <DateAndTimePickerForLesson lessons2={lessons2} setLessons2={setLessons2} lesson={lesson} lesson_id={lesson.id} lesson_order={lesson.lesson_order} student={props.student} saveLessonDateAndTime={saveLessonDateAndTime} saveIsClicked={saveIsClicked}/> 
          )} 
            </div>
          <div className={styles.buttonWrapper}>
          <button
          className={styles.save}
            onClick={() => {
              // updateStudentProgram
              setSaveIsClicked(!saveIsClicked)
              props.updateStudentProgram( 
                props.student.student_id,
                props.student.course_id,
                studentProgramUpcoming
              );
              props.loadTeacherData();
            }}
          >
            Сохранить
          </button>
          </div>
          </div>

        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default ModalForLessonConfiguration;

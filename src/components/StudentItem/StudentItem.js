import { useRouter } from "next/router";
import styles from "./StudentItem.module.css";
import { Image } from "react-bootstrap";
import { useEffect, useState } from "react";
import EditStudentData from "../EditStudentData/EditStudentData";
import EditStudentStatus from "../EditStudentStatus/EditStudentStatus";
import axios from "axios";
import globals from "../../globals";
import ModalForLessonConfiguration from "../ModalForLessonConfiguration/ModalForLessonConfiguration";

const StudentItem = ({ student, showModalLesson, setShowModalLesson, setStudentForModal, programs, route, updateStudentProgram, loadTeacherData, allStudentsLessons }) => {
  const router = useRouter();
  const [showSetting, setShowSetting] = useState(false);
  const [formattedTime, setFormattedTime] = useState() 

  const [showModalData, setShowModalData] = useState(false);
  const [showModalStatus, setShowModalStatus] = useState(false);

  const [studentPrograms, setStudentPrograms] = useState();

  const personalLink = async (studentId, prigramId) => {
    const redirectUrl = `${route}/homeworks?programId=${encodeURIComponent(prigramId)}&studentId=${encodeURIComponent(studentId)}`
    
    await router.push(redirectUrl)  

  }

  const getProgramsByStudentId = async () => {
    let result = await axios.post(`${globals.productionServerDomain}/getProgramsByStudentId/` + student?.student_id)
    setStudentPrograms(result.data);
      console.log(studentPrograms, "getProgramsByStudentId")
  } 

  useEffect(() => { 
    getProgramsByStudentId();
    console.log(student.closer_date, "student.closer_date");
  }, []);
  useEffect(() => {
    if (studentPrograms != undefined) {
      getShiftedTime(student.closer_date_witout_local , studentPrograms[0].lesson_duration) 
    }
  }, [studentPrograms])

  const deleteProgram = async (studentId, programId) => {
    const data = {
      studentId,
      programId
    }; 

    await axios({ 
      method: "delete",
      url: `${globals.productionServerDomain}/deleteStudentOneProgram`,
      data: data,
    })
      .then(function (res) {
        alert("Студент из программы успешно удален");
      })
      .catch((err) => {
        alert("Произошла ошибка"); 
      });

  }

  const deletestudent = async (id) => {
    const data = {
      id
    }; 

    await axios({ 
      method: "delete",
      url: `${globals.productionServerDomain}/deleteStudent`,
      data: data,
    })
      .then(function (res) {
        alert("Студент успешно удален");
      })
      .catch((err) => {
        alert("Произошла ошибка"); 
      });
  }

  console.log(student);

  const padWithZeros = (id, length) => id.toString().padStart(length, '0');

  const optimizedId = (student) => {
    if (!student) return '';
    const id = padWithZeros(student.student_id, 7);
    return id;
  }

  console.log(studentPrograms);
  function getShiftedTime(date, minutes) {
    console.log("getShiftedTime", date, minutes);
    if (date != undefined) {
      // Вычисляем количество миллисекунд, соответствующее указанному количеству минут
      const millisecondsShift = minutes * 60 * 1000;
      
      // Вычисляем новое время, сдвинутое на указанное количество минут
      const dateOfPersonalTime = new Date(date)
      const shiftedTime = new Date(dateOfPersonalTime.getTime() + millisecondsShift);
      
      // Получаем часы и минуты из нового времени
      const hours = shiftedTime.getHours();
      const minutesFormatted = shiftedTime.getMinutes() < 10 ? `0${shiftedTime.getMinutes()}` : shiftedTime.getMinutes();
      
      // Форматируем часы и минуты в строку в формате "hh:mm"
      const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutesFormatted}`;
      
      // Возвращаем отформатированную строку
      setFormattedTime(formattedTime)
    } else {
      setFormattedTime("Следующее занятие не запланировано")
    }
    return formattedTime;
  }

  return <div className={styles.student}>
    <span className={styles.sCourse}>
      {student?.course_title} ({student?.program_title})
    </span>
    <span
      className={styles.sFullname}
      onClick={() => {
        personalLink(student?.student_id, student?.program_id);
      }}
    >
      <div className={styles.studentCage}>
        <span>
          <Image
            src={student?.img !== null ? student?.img : "https://realibi.kz/file/142617.png"}
            style={{ marginRight: "8px", width: "40px" }}
          />
        </span>
        <div className={styles.idAndName}>
          <span className={styles.name}>
            {student?.surname} {student?.name} {student?.patronymic}
          </span>
          <span className={styles.id}>
            {optimizedId(student)}
            {/* {"0".repeat(7 - String(student?.student_id).length) + student?.student_id} */}
            {/* {"0".repeat(7 - String(student?.student_id).length) +
              student?.student_id} */}
          </span>
        </div>
      </div>
    </span>
    <span className={styles.sComplietedLessons}>
      <div className={styles.progressLine}>
        <div
          className={styles.studentProgress}
          style={{
            width: student?.progress
              ? student?.progress + "%"
              : "0" + "%",
          }}
        ></div>
      </div>
      {student?.check ? student.check : "0"} из{" "}
      {student?.lessons_count ? student.lessons_count : ""}
    </span>
    <span className={styles.sNextLesson}>
      <span>{student?.closer_date}</span>
      <span>
        {student?.curr_hours != undefined ? (
          <>
            {student?.curr_hours < 10
              ? "0" + student?.curr_hours
              : student?.curr_hours}
            :
            {student.curr_minutes < 10
              ? "0" + student?.curr_minutes
              : student?.curr_minutes}
            -
            {formattedTime}
          </>
        ) : (
          "Следующее занятие не запланировано"
        )}
      </span>
    </span>
    <div 
      className={styles.setting}
      onClick={() => setShowSetting(!showSetting)}
    >
      <p className={showSetting ? styles.settingTitleShow : styles.settingTitleHide}>
        Настройки
      </p>
      <div 
        className={styles.editSetData}
        style={{display: showSetting ? "block" : "none"}}
      >
        <span
          // className={styles.sConfigure}
          onClick={() => {
            // setShowModalLesson(!showModalLesson);
            // setStudentForModal(student);
            setShowModalData(!showModalData)
            setShowModalStatus(!showModalStatus);
            setShowModalLesson(!showModalLesson);
            setStudentForModal(student);
          }}
        >
          Редактировать
        </span>
        {/* <div className={styles.sConfigureGear}></div> */}
      </div>
      {/* <div 
        className={styles.editSetProg}
        style={{display: showSetting ? "block" : "none"}}
      >
        <span
          // className={styles.sConfigure}
          onClick={() => {
            setShowModalStatus(!showModalStatus);
            // setStudentForModal(student);
          }}
        >
          Статус/программа
        </span>
      </div> */}
      {/* <div 
        className={styles.editSetSh}
        style={{display: showSetting ? "block" : "none"}}
      >
        <span
          onClick={() => {
            setShowModalLesson(!showModalLesson);
            setStudentForModal(student);
          }}
        >
          Расписание
        </span>
      </div> */}
      <div 
        className={styles.deleteSet}
        style={{display: showSetting ? "block" : "none"}}
        onClick={() => {
          if (studentPrograms.length > 1) {
            deleteProgram(student.student_id, student.program_id);
            window.location.reload();
          } else {
            deleteProgram(student.student_id, student?.program_id);
            deletestudent(student.student_id);
            window.location.reload();
          }
        }}
      >
        <span>
          Удалить
        </span>
      </div>
    </div>
    <EditStudentStatus studentId={optimizedId(student)} allStudentsLessons={allStudentsLessons} programs={programs} student={student} show={showModalStatus} setShow={setShowModalStatus} />
  </div>
};

export default StudentItem;
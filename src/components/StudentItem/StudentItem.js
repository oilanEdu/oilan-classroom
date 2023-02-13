import { useRouter } from "next/router";
import styles from "./StudentItem.module.css";
import { Image } from "react-bootstrap";
import { useEffect, useState } from "react";
import EditStudentData from "../EditStudentData/EditStudentData";
import EditStudentStatus from "../EditStudentStatus/EditStudentStatus";
import axios from "axios";
import globals from "../../globals";

const StudentItem = ({ student, showModalLesson, setShowModalLesson, setStudentForModal, programs, route }) => {
  const router = useRouter();
  const [showSetting, setShowSetting] = useState(false);

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
      console.log(studentPrograms)
  }

  useEffect(() => {
    getProgramsByStudentId();
  }, []);

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
            src="https://realibi.kz/file/142617.png"
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
            {student?.curr_hours == 23
              ? "00"
              : student?.curr_hours + 1 < 10
              ? "0" + (student?.curr_hours + 1)
              : student?.curr_hours + 1}
            :
            {student?.curr_minutes < 10
              ? "0" + student.curr_minutes
              : student.curr_minutes}
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
        Редактировать
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
          }}
        >
          Личные данные
        </span>
        {/* <div className={styles.sConfigureGear}></div> */}
      </div>
      <div 
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
        {/* <div className={styles.sConfigureGear}></div> */}
      </div>
      <div 
        className={styles.editSetSh}
        style={{display: showSetting ? "block" : "none"}}
      >
        <span
          // className={styles.sConfigure}
          onClick={() => {
            setShowModalLesson(!showModalLesson);
            setStudentForModal(student);
          }}
        >
          Расписание
        </span>
        {/* <div className={styles.sConfigureGear}></div> */}
      </div>
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
    {/* <div className={styles.sConfigureWrapper}>
      <span
        className={styles.sConfigure}
        onClick={() => {
          setShowModalLesson(!showModalLesson);
          setStudentForModal(student);
        }}
      >
        Редактировать
      </span>
      <div className={styles.sConfigureGear}></div>
    </div> */}
    <EditStudentData student={student} show={showModalData} setShow={setShowModalData} />
    <EditStudentStatus programs={programs} student={student} show={showModalStatus} setShow={setShowModalStatus} />
  </div>
};

export default StudentItem;
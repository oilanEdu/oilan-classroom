import { useRouter } from "next/router";
import React, {useEffect, useState} from "react";
import globals from "../../globals";
import styles from "./HomeworksByTeacher.module.css";
import axios from "axios";
import { Image } from "react-bootstrap";
import Footer from "../Footer/Footer";
import HeaderTeacher from "../new_HeaderTeacher/new_HeaderTeacher";
import classnames from 'classnames';
import NewTeacherHomeworksLessons from "../NewTeacherHomeworksLessons/NewTeacherHomeworksLessons";
import GoToLessonWithTimerComponent from "../GoToLessonWithTimerComponent/GoToLessonWithTimerComponent";
import ClickAwayListener from '@mui/base/ClickAwayListener';

function HomeworksByTeacher(props) {
	
	const router = useRouter()
	const teacherUrl = router.query.url
  const studentId = router.query.studentId
  const programId = router.query.programId
  const [teacher, setTeacher] = useState([])
  const [students, setStudents] = useState([])
  const [selectedStudentId, setSelectedStudentId] = useState(studentId)
  const [selectedStudentName, setSelectedStudentName] = useState("Студенты")
  const [selectedProgramId, setSelectedProgramId] = useState(programId)
  const [selectedProgram, setSelectedProgram] = useState("Программы");
  const [selectedExerciseId, setSelectedExerciseId] = useState(0)
  const [selectedExerciseNumber, setSelectedExerciseNumber] = useState(0)
  const [selectedExerciseText, setSelectedExerciseText] = useState('')
  const [selectedExerciseCorrectAnswer, setSelectedExerciseCorrectAnswer] = useState('')
  const [studentSelectShow, setStudentSelectShow] = useState(false);
  const [programSelectShow, setProgramSelectShow] = useState(false);
  const [answer, setAnswer] = useState([])
  const [programs, setPrograms] = useState([])
  const [lessons, setLessons] = useState([])
  const [exercises, setExercises] = useState([])
  const [showCheck, setShowCheck] = useState(0)
  const [teacherComment, setTeacherComment] = useState('')

  useEffect(() => {
    setLessons('')
    reloadButton()
  }, [selectedStudentId])
  useEffect(() => {
    loadBaseData()
    loadPrograms(selectedStudentId)
    loadStudentLessons(selectedStudentId, selectedProgramId)
  }, []) 

  const loadBaseData = async () => {
    let data = props.url 
    let getTeacherByUrl = await axios.post(`${globals.productionServerDomain}/getTeacherByUrl/` + data)
    const teacherIdLocal = getTeacherByUrl['data'][0]?.id
    const dataStudents = {
      id: teacherIdLocal,
      sort: "oc_students.surname"
    }
    let teacherStudents = await axios.post(`${globals.productionServerDomain}/getStudentsByTeacherId/`,  dataStudents)
    setTeacher(getTeacherByUrl['data'][0])
    setStudents(teacherStudents['data'])
    console.log(students)
  }

  console.log(props.student);
  useEffect(() => {
    loadPrograms();
  }, [props.student])

  const loadPrograms = async (studentId) => {
    let studentPrograms;
    // if (studentId) {
      studentPrograms = await axios.post(`${globals.productionServerDomain}/getProgramsByStudentId/` + props.student.id);
    // } else if (selectedStudentId) {
    //   studentPrograms = await axios.post(`${globals.productionServerDomain}/getProgramsByStudentId/` + selectedStudentId);
    // } else {
    //   studentPrograms = await axios.post(`${globals.productionServerDomain}/getProgramsByStudentId/` + students[0]?.student_id);
    // }
    
    setPrograms(studentPrograms['data']);
    console.log(studentPrograms['data'])
    console.log(props.student.id, studentPrograms['data'][0].id)
    loadStudentLessons(props.student.id, studentPrograms['data'][0].program_id);
  }
    
  const reloadButton = async () => {
    await loadPrograms(selectedStudentId);
  };
    
  const loadStudentLessons = async (studentId, programId) => {
    const data = {
      studentId,
      programId
    };

    console.log(data);

    await axios({
      method: "post",
      url: `${globals.productionServerDomain}/getStudentLessonsByProgramId`,
      data: data,
    })
      .then(function (res) {
        let lessons = res.data
        let lesson_number = 0
        lessons.forEach(lesson => {
          lesson_number += 1
          lesson.lesson_number = lesson_number 
          if (lesson.personal_time){
            lesson.fact_time = lesson.personal_time
          } else {
            lesson.fact_time = lesson.start_time
          }
          let strDate = new Date(lesson.fact_time)
          let curr_hours = strDate.getHours();
          let curr_minutes = strDate.getMinutes(); 
          lesson.out_date = new Date(strDate).toLocaleDateString() 
          lesson.out_hours = curr_hours
          lesson.out_minutes = curr_minutes
        })
        setLessons(lessons)
      })
      .catch((err) => {
        alert("Произошла ошибка");
      });
  }

  const getAnswer = async (studentId, exerciseId) => {
    const data = {
      studentId,
      exerciseId
    };
    await axios({
      method: "post",
      url: `${globals.productionServerDomain}/getAnswersByStudExId`,
      data: data,
    })
      .then(function (res) {
        setAnswer(res.data[0])
      })
      .catch((err) => {
        alert("Произошла ошибка");
      });
  }


  console.log(programs);
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
  // if (typeof localStorage !== "undefined") {
	return <>
      <div style={{backgroundColor: "#f1faff", width: "100vw", overflowX: "hidden"}}>
        <div className={styles.cantainer}>
      		<div className={styles.selectBlock}>
            <h1>Домашние задания</h1>
          </div>
          <div className={styles.lessons}>
            {lessons.length > 0 
              ? <> {lessons.map((lesson, index) => (
                <NewTeacherHomeworksLessons 
                  index={index}
                  lesson={lesson} 
                  showCheck={showCheck} 
                  selectedExerciseId={selectedExerciseId} 
                  answer={answer} 
                  student={props.student}
                  setShowCheck={setShowCheck} 
                  setSelectedExerciseId={setSelectedExerciseId} 
                  setAnswer={setAnswer} 
                  setSelectedExerciseNumber={setSelectedExerciseNumber} 
                  setSelectedExerciseText={setSelectedExerciseText} 
                  setSelectedExerciseCorrectAnswer={setSelectedExerciseCorrectAnswer} 
                  getAnswer={getAnswer} 
                  selectedStudentId={selectedStudentId} 
                  selectedExerciseNumber={selectedExerciseNumber} 
                  selectedExerciseText={selectedExerciseText} 
                  selectedExerciseCorrectAnswer={selectedExerciseCorrectAnswer} 
                  updateAnswerStatus={updateAnswerStatus} 
                  updateAnswerComment={updateAnswerComment}
                  loadStudentLessons={loadStudentLessons}
                  selectedProgramId={selectedProgramId}
                />
              ))} </> 
              : ''
            }
        </div>
      </div>            	
      <Footer />
      </div>
    </>
  //   :<></>
  // )} else {return <></>}
}

HomeworksByTeacher.getInitialProps = async (ctx) => {
  if(ctx.query.url !== undefined) {
    return {
      url: ctx.query.url,
    }
  } else{
    return {};
  }
}

export default HomeworksByTeacher;
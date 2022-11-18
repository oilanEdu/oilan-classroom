import { useRouter } from "next/router";
import React, {useEffect, useState} from "react";
import globals from "../../../../../src/globals";
import styles from "./styles.module.css";
import axios from "axios";
import { Image } from "react-bootstrap";
import Footer from "../../../../../src/components/Footer/Footer";
import HeaderTeacher from "../../../../../src/components/HeaderTeacher/HeaderTeacher";
import classnames from 'classnames';
import TeacherHomeworksLessons from "../../../../../src/components/TeacherHomeworksLessons/TeacherHomeworksLessons";

function Homeworks(props) {
	
	const router = useRouter()
	const teacherUrl = router.query.url
    const studentId = router.query.studentId
    const programId = router.query.programId
    const [teacher, setTeacher] = useState([])
    const [students, setStudents] = useState([])
    const [selectedStudentId, setSelectedStudentId] = useState(studentId)
    const [selectedProgramId, setSelectedProgramId] = useState(programId)
    const [selectedExerciseId, setSelectedExerciseId] = useState(0)
    const [selectedExerciseNumber, setSelectedExerciseNumber] = useState(0)
    const [selectedExerciseText, setSelectedExerciseText] = useState('')
    const [selectedExerciseCorrectAnswer, setSelectedExerciseCorrectAnswer] = useState('')
    const [answer, setAnswer] = useState([])
    const [programs, setPrograms] = useState([])
    const [lessons, setLessons] = useState([])
    const [exercises, setExercises] = useState([])
    const [showCheck, setShowCheck] = useState(0)
    const [teacherComment, setTeacherComment] = useState('')
    console.log('teacherUrl',teacherUrl)
    console.log('studentId',studentId)
    console.log('programId',programId)

    useEffect(() => {
      console.log(lessons, "lessonsHomeworks");
    }, [lessons])
    useEffect(() => {
     console.log(selectedStudentId, "selectedStudentIdDDDDD"); 
     setLessons('')
     reloadButton()
    }, [selectedStudentId])
    useEffect(() => {
        loadBaseData()
        loadPrograms(selectedStudentId)
        loadStudentLessons(selectedStudentId, selectedProgramId)
    }, []) 

    const loadBaseData = async () => {
      console.log("came here1");
    	let data = props.url 
        let getTeacherByUrl = await axios.post(`${globals.productionServerDomain}/getTeacherByUrl/` + data)
        console.log("came here2");
        const teacherIdLocal = getTeacherByUrl['data'][0]?.id
        console.log("came here3");
        const dataStudents = {
          id: teacherIdLocal,
          sort: "oc_students.surname"
      }
        let teacherStudents = await axios.post(`${globals.productionServerDomain}/getStudentsByTeacherId/`,  dataStudents)
        console.log("teacherStudents", teacherStudents);
        console.log("came here4");
        setTeacher(getTeacherByUrl['data'][0])
        setStudents(teacherStudents['data'])
        console.log('teacher', teacher)
        console.log('students', students)
    }

    const loadPrograms = async (studentId) => {
        const studentPrograms = await axios.post(`${globals.productionServerDomain}/getProgramsByStudentId/` + studentId)
        setPrograms(studentPrograms['data'])
        if (studentPrograms['data'].length == 1){
            studentPrograms['data'].forEach(program => {
                setSelectedProgramId(program.id)
            })
            console.log(selectedStudentId, studentPrograms['data'][0].id, "selectedStudentId, selectedProgramId");
            console.log(studentPrograms['data'][0], "studentPrograms['data'][0]")
            loadStudentLessons(studentId, studentPrograms['data'][0].id)
        }
        console.log('programs', programs)
    }
    const reloadButton = async() => {
      // await loadBaseData()
      await loadPrograms(selectedStudentId)
      // await loadStudentLessons(selectedStudentId, selectedProgramId)
    }
    const loadStudentLessons = async (studentId, programId) => {
        const data = {
          studentId,
          programId
        };
        console.log('studentId, programId', studentId, programId)
        console.log(data, "dataData");
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
                if (lesson.personal_time){
                    lesson.fact_time = lesson.personal_time
                }else{
                    lesson.fact_time = lesson.start_time
                }
                let strDate = new Date(lesson.fact_time)
                let curr_hours = strDate.getHours();
                let curr_minutes = strDate.getMinutes(); 
                lesson.out_date = new Date(strDate).toLocaleDateString() 
                lesson.out_hours = curr_hours
                lesson.out_minutes = curr_minutes
            })
            setLessons(res.data)
          })
          .catch((err) => {
            alert("Произошла ошибка");
          });
        console.log('lessons', lessons) 
    }

    // const getLessonExercises = async (selectedLesson) => {
    //     let exer_number = 0
    //     let lessonExercises = axios.post(`${globals.productionServerDomain}/getExercisesByLessonId/` + selectedLesson).then(res => {
    //         res.data.forEach(exercise => {
    //             let studentId = selectedStudentId
    //             let exerciseId = exercise.id
    //             let data = {
    //               studentId,
    //               exerciseId
    //             };
    //             console.log('data',data)
    //             let exerciseAnswer = axios({ 
    //               method: "post",
    //               url: `${globals.productionServerDomain}/getAnswersByStudExId`,
    //               data: data,
    //             })
    //               .then(function (res) {
    //                 if (res.data[0]){
    //                     console.log('EXE', res.data[0].status)
    //                     exercise.answer_status = res.data[0].status
    //                 }else{
    //                     console.log('ответов нет')
    //                 }
    //               })
    //               .catch((err) => {
    //                 alert("Произошла ошибка");
    //               });
    //             exer_number += 1
    //             exercise.exer_number = exer_number
    //         })
    //         setExercises(res.data)
    //         console.log('exercises', exercises)
    //     }
    //     )
    // }

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
        console.log('answer', answer)
    }

    const updateAnswerStatus = async (id, status) => {
        const data = {
          id,
          status
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

    const updateAnswerComment = async (id, comment) => {
        const data = {
          id,
          comment
        }; 

        await axios({
          method: "put",
          url: `${globals.productionServerDomain}/updateAnswerComment`,
          data: data,
        })
          .then(function (res) {
            alert("Комментарий отправлен"); 
          })
          .catch((err) => {
            alert("Произошла ошибка"); 
          });
    }

	return ( 
        <>
            <div style={{backgroundColor: "#f1faff", width: '120%'}}>
                <HeaderTeacher white={true} teacher={teacher}/>

              	<div className={styles.cantainer}>
              		<div className={styles.selectBlock}>
              		    <h1>Домашние задания</h1>
                        <select
                            value={selectedStudentId} 
                            onChange={async (e) => {
                                setSelectedStudentId(e.target.value)
                                await loadPrograms(e.target.value)
                                // reloadButton()
                                console.log('selectedStudentId', selectedStudentId)
                                }
                            }
                        >
                            <option className={styles.studentOptions} value="0" selected>
                                Студенты
                            </option>
                            {students.map(student => (
                                <option value={student.student_id}>
                                    {student.surname} {student.name} {student.patronymic}
                                </option>
                                ))}
                        </select>
                        <select 
                            value={selectedProgramId}
                            onChange={(e) => {
                                setSelectedProgramId(e.target.value)
                                // value={programId}
                                loadStudentLessons(selectedStudentId, e.target.value)
                                console.log('selectedProgramId', selectedProgramId)
                                }
                            }
                        >
                            <option value="0" disabled selected>
                                Программы
                            </option>
                            {programs.map(program => (
                                <option value={program.id}>
                                    {program.course_title} ({program.title})
                                </option>
                                ))}
                        </select>
                        {/* <button 
                            className={styles.reloadButton}
                                onClick={() => {
                                reloadButton()
                        }}>
                            &#128472;
                        </button> */}
              		</div>

                    <div className={styles.lessons}>
                      {lessons.length > 0 ? <>{lessons.map(lesson => (
                                <TeacherHomeworksLessons lesson={lesson} showCheck={showCheck} selectedExerciseId={selectedExerciseId} answer={answer} teacherComment={teacherComment} setShowCheck={setShowCheck} setSelectedExerciseId={setSelectedExerciseId} setAnswer={setAnswer} setTeacherComment={setTeacherComment} setSelectedExerciseNumber={setSelectedExerciseNumber} setSelectedExerciseText={setSelectedExerciseText} setSelectedExerciseCorrectAnswer={setSelectedExerciseCorrectAnswer} getAnswer={getAnswer} selectedStudentId={selectedStudentId} selectedExerciseNumber={selectedExerciseNumber} selectedExerciseText={selectedExerciseText} selectedExerciseCorrectAnswer={selectedExerciseCorrectAnswer} updateAnswerStatus={updateAnswerStatus} updateAnswerComment={updateAnswerComment}/>
                            )
                        )}</> : ''}

                    </div>
              	</div>
              	
              	<Footer />
            </div>
        </>
       )
}

Homeworks.getInitialProps = async (ctx) => {
	console.log('lol',ctx)
    if(ctx.query.url !== undefined) {
        return {
            url: ctx.query.url,
        }
    }else{
        return {};
    }
}

export default Homeworks
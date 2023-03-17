import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import styles from './index.module.css'
import globals from "../../../../src/globals";
import axios from "axios";
import HeaderTeacher from "../../../../src/components/new_HeaderTeacher/new_HeaderTeacher";

const myStudents = () => {
  const router = useRouter();
  const teacherUrl = router.query.url
  const [teacher, setTeacher] = useState([])
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [courseId, setCourseId] = useState(0);
  const [lessonProgramId, setLessonProgramId] = useState(0);
  const [sortType, setSortType] = useState("");
  const [lessonsLoaded, setLessonsLoaded] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [showSort, setShowSort] = useState(false);
  const [sortMode, setSortMode] = useState(false)
  const [courses, setCourses] = useState([])
  const [programs, setPrograms] = useState([])

  const isInMainPage = true;

  const getCourses = async () => {
    console.log(teacher);
    let result = await axios.post(`${globals.productionServerDomain}/getCoursesByTeacherId/${teacher?.id}`)
    setCourses(result.data);
    console.log(courses)
  }

  const getPrograms = async () => {
    console.log(courseId);
    let result = await axios.post(`${globals.productionServerDomain}/getProgramsByCourseId/${courseId}`)
    setPrograms(result.data);
    console.log(result.data);
  }

  const loadStudentLessons = async (studentId, programId) => {
    setLessonsLoaded(true)
    const data = {
      studentId,
      programId
    };
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
        setLessons(lessons => [...lessons, ...res.data])
      })
      .catch((err) => {
        alert("Произошла ошибка");
      });
  }

  const loadTeacherData = async () => {
    let data = teacherUrl
    let getTeacherByUrl = await axios.post(`${globals.productionServerDomain}/getTeacherByUrl/` + data)
    setTeacher(getTeacherByUrl['data'][0])
    const teacherIdLocal = getTeacherByUrl['data'][0]?.id
    let lessonsOfAllStudents = []
    const dataStudents = {
      id: teacherIdLocal,
      sort: sortType
    }
    let teacherStudents = await axios.post(`${globals.productionServerDomain}/getStudentsByTeacherId/`, dataStudents)
    let teacherGroups = await axios.post(`${globals.productionServerDomain}/getGroupsByTeacherId/`, dataStudents)
    await teacherStudents['data'].forEach(async student => {
      // debugger
      student.check = 0
      let diff = 604800000 * 7
      if (!lessonsLoaded) { loadStudentLessons(student.student_id, student.program_id) }
      let answersCount = 0
      let studentCheck = 0
      let studentLessons = await axios.get(`${globals.productionServerDomain}/getLessonInfo?course_url=${student.course_url}&program_id=${student.program_id}&student_id=${student.student_id}`).then(async res => {
        let lessons = res.data
        console.log(lessons, "lessonsOfAllStudents");
        lessonsOfAllStudents.push(...lessons);
        await res.data.forEach(async lesson => {
          if (+lesson.all_exer !== 0 && +lesson.all_exer === +lesson.done_exer) {
            studentCheck += 1
            student.check = studentCheck
            student.progress = 100 / student.lessons_count * student.check
          };
          let currentDate = new Date().toLocaleDateString()
          let lessonDate
          if (lesson.personal_time) {
            lesson.fact_time = lesson.personal_time
            lessonDate = new Date(lesson.fact_time).toLocaleDateString()
          } else {
            lesson.fact_time = lesson.start_time
            lessonDate = new Date(lesson.fact_time).toLocaleDateString()
          }
          let dateStr = new Date(lesson.personal_time ? lesson.personal_time : lesson.start_time);
          let closerDate
          if ((Date.parse(dateStr) > Date.parse(new Date())) && (Date.parse(dateStr) - Date.parse(new Date()) < diff)) {
            // debugger
            closerDate = lessonDate
            let closerLesson
            if (closerLesson) {
              if (closerDate < new Date(closerLesson.fact_time).toLocaleDateString()) {
                // setCloserLesson(lesson)
              }
            } else {
              // setCloserLesson(lesson)
            }
            let curr_hours = dateStr.getHours();
            let curr_minutes = dateStr.getMinutes();
            student.lesson_date = lesson.fact_time
            // student.closer_date = closerDate 
            // student.curr_hours = curr_hours 
            // student.curr_minutes = curr_minutes 
            // debugger
          }
          let lessonExercises = await axios.post(`${globals.productionServerDomain}/getExercisesByLessonId/` + lesson.id).then(res => {
            let exercises = res.data
            if (exercises) {
              exercises.forEach(async exercise => {
                let studentId = student.student_id
                let exerciseId = exercise.id
                const data = {
                  studentId,
                  exerciseId
                };
                let exerciseAnswers = await axios({
                  method: "post",
                  url: `${globals.productionServerDomain}/getAnswersByStudExId`,
                  data: data,
                }).then(res => {
                  // let answers = res.data
                  // answersCount = answers.length
                  // if ((exercises.length > 0) && (exercises.length == answersCount)){
                  //     student.check += 1 
                  //     studentCheck += 1
                  //     console.log('studentCheck', studentCheck)
                  //     setCheck(student.check)
                  //     student.check = studentCheck 
                  //     student.progress = 100/student.lessons_count*student.check
                  // }  
                  // else{ 
                  //     console.log('')
                  //     setCheck(0)
                  //     studentCheck = 0
                  //     student.check = 0
                  //     student.progress = 0
                  // }
                })
              })
            }
          })
        })
        var lessonsFuture = lessons.filter(el => (new Date() - new Date(el.personal_time ? el.personal_time : el.start_time).getTime() < 0))
        var temp = lessonsFuture.map(d => Math.abs(new Date() - new Date(d.personal_time ? d.personal_time : d.start_time).getTime()));
        var withoutNan = temp.filter(function (n) { return !isNaN(n) })
        var idx = withoutNan.indexOf(Math.min(...withoutNan));
        if (lessonsFuture[idx] != undefined) {
          let curr_hours = new Date(lessonsFuture[idx]?.personal_time ? lessonsFuture[idx]?.personal_time : lessonsFuture[idx]?.start_time).getHours();
          let curr_minutes = new Date(lessonsFuture[idx]?.personal_time ? lessonsFuture[idx]?.personal_time : lessonsFuture[idx]?.start_time).getMinutes();
          student.closer_date = new Date(lessonsFuture[idx]?.personal_time ? lessonsFuture[idx]?.personal_time : lessonsFuture[idx]?.start_time).toLocaleDateString()
          student.closer_date_witout_local = lessonsFuture[idx]?.personal_time ? lessonsFuture[idx]?.personal_time : lessonsFuture[idx]?.start_time
          student.curr_hours = curr_hours
          student.curr_minutes = curr_minutes
          student.lesson_date = new Date(lessonsFuture[idx]?.personal_time ? lessonsFuture[idx]?.personal_time : lessonsFuture[idx]?.start_time).toLocaleDateString()
        } else {
          let curr_hours = undefined
          let curr_minutes = undefined
          student.closer_date = undefined
          student.closer_date_witout_local = undefined
          student.curr_hours = undefined
          student.curr_minutes = undefined
          student.lesson_date = undefined
        }

      })
    }
    );

    setStudents(teacherStudents['data'])
    setGroups(teacherGroups['data'])
    console.log(teacherStudents['data']);
  }

  useEffect(() => {
    // if (!baseDataLoaded || !teacher) {
    // loadBaseData()
    // setBaseDataLoaded(true)
    loadTeacherData();
    // }
    // getCourses()
    console.log('teacherUrl', teacherUrl)
    // console.log('teacher', teacher)

  }, [teacherUrl]);

  useEffect(() => {
    getPrograms();

  }, [courseId]);
  useEffect(() => {
    getCourses();

  }, [teacher]);


  // const loadBaseData = async () => {
  //   let data = teacherUrl
  //   let getTeacherByUrl = await axios.post(`${globals.productionServerDomain}/getTeacherByUrl/` + data)
  //   const teacherIdLocal = getTeacherByUrl['data'][0]?.id
  //   console.log('teacherIdLocal', teacherIdLocal)
  //   setTeacher(getTeacherByUrl['data'][0])
  //   // let teacherCourses = await axios.post(`${globals.productionServerDomain}/getCoursesByTeacherId/` + teacherIdLocal)
  //   // console.log('teacherCourses', teacherCourses)
  //   // setCourses(teacherCourses['data'])
  // }

  console.log(students);

  const ultimateSort = async (field) => {
    setSortMode(true)
    students.sort(byField(field));
    // loadTeacherData()
  }

  function byField(field) {
    return (a, b) => a[field] > b[field] ? 1 : -1;
  }

  return <>
    <div className={styles.container}>
      <HeaderTeacher
        white={true}
        url={teacherUrl}
        teacher={teacher}
        isInMainPage={isInMainPage}
      />
      <div className={styles.contentWrapper}>
        <div>
          <h3>Домашние задания</h3>
          <select
            className={styles.input_block}
            onChange={(e) => {
            setCourseId(e.target.value)
            console.log(e);
          }}
            value={courseId}
          >
          <option value="0" disabled>Выберите курс</option>
            {courses.map(course => (
              <option value={course.id}>{course.title}</option>
            ))}
          </select>
          <select
            className={styles.input_block}
            onChange={(e) => {
            setLessonProgramId(e.target.value)
            console.log(e);
          }}
            value={lessonProgramId}
                    >
                      <option value="0" disabled>Выберите программу</option>
                      {programs.map(program => (
                        <option value={program.id}>{program.title}</option>
                      ))}
                    </select>
        </div>
      </div>
    </div>
  </>;
};

export default myStudents;
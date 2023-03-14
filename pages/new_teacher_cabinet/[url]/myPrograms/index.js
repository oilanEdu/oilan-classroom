import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import styles from './index.module.css'
import globals from "../../../../src/globals";
import axios from "axios";
import HeaderTeacher from "../../../../src/components/new_HeaderTeacher/new_HeaderTeacher";

const myPrograms = () => {
  const router = useRouter();
  const teacherUrl = router.query.url
  const courseId = router.query.course
  const [teacher, setTeacher] = useState([])
  const [course, setCourse] = useState([])
  const [baseDataLoaded, setBaseDataLoaded] = useState(false)
  const [programs, setPrograms] = useState([])

  const isInMainPage = true;

  useEffect(() => {
    if (!baseDataLoaded || !teacher) {
      loadBaseData()
      setBaseDataLoaded(true)
    }
    console.log('teacherUrl', teacherUrl)
    console.log('teacher', teacher)
    console.log('router', router)

  }, [teacherUrl, teacher]);

  const loadBaseData = async () => {
    let data = teacherUrl
    let getTeacherByUrl = await axios.post(`${globals.productionServerDomain}/getTeacherByUrl/` + data)
    const teacherIdLocal = getTeacherByUrl['data'][0]?.id
    console.log('teacherIdLocal', teacherIdLocal)
    setTeacher(getTeacherByUrl['data'][0])
    let selectedCourse = await axios.post(`${globals.productionServerDomain}/getCourseById/`, { courseId })
    console.log('selectedCourse', selectedCourse['data'][0])
    setCourse(selectedCourse['data'][0])
    let teacherPrograms = await axios.post(`${globals.productionServerDomain}/getProgramsById/` + courseId)
    console.log('teacherPrograms', teacherPrograms)
    setPrograms(teacherPrograms['data'])
  }

  return <>
    <div className={styles.container}>
      <HeaderTeacher
        white={true}
        url={teacherUrl}
        teacher={teacher}
        isInMainPage={isInMainPage}
      />
      <div className={styles.titleRow}>
        <div className={styles.courseTitle}>
          {course?.title}
        </div>
        <div className={styles.mainRow}>
          <h1>Мои программы</h1>
          <button>Создать программу</button>
        </div>
      </div>
      <div className={styles.programWrapper}>
        {programs.map(program => (
          <div className={styles.programRow}>
            <div className={styles.programTitle}>
              {program.title}
            </div>
            <div className={styles.programSchedule}>
              <p>Расписание: индивидуально</p>
              <p>Время занятий: индивидуально</p>
            </div>
            <div className={styles.programStatistics}>
              <p>Всего уроков: {program.lessons_count}</p>
              <p>Всего учеников: {program.students_count}</p>
              <p>Формат: {program.type == 'individual'?'индивидуальная':'групповая'}</p>
            </div>
            <div className={styles.programButtons}>
              <button onClick={() => router.push(`/new_teacher_cabinet/${teacherUrl}/myLessons?program=${program.id}`)}>
                Перейти к урокам
              </button>
              <span>Редактировать информацию</span>
            </div>
          </div>    
        ))}
      </div>
    </div>
  </>;
};

export default myPrograms;
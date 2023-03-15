import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import styles from './index.module.css'
import globals from "../../../../src/globals";
import axios from "axios";
import HeaderTeacher from "../../../../src/components/new_HeaderTeacher/new_HeaderTeacher";

const myPrograms = () => {
  const router = useRouter();
  const teacherUrl = router.query.url
  const programId = router.query.program
  const [teacher, setTeacher] = useState([])
  const [program, setProgram] = useState([])
  const [baseDataLoaded, setBaseDataLoaded] = useState(false)
  const [lessons, setLessons] = useState([])

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
    let selectedProgram = await axios.post(`${globals.productionServerDomain}/getProgramById/`, { programId })
    console.log('selectedProgram', selectedProgram['data'][0])
    setProgram(selectedProgram['data'][0])
    let programLessons = await axios.post(`${globals.productionServerDomain}/getLessonsByProgramId/` + programId)
    console.log('programLessons', programLessons)
    setLessons(programLessons['data'])
  }

  return <>
    <div className={styles.container}>
      <HeaderTeacher
        white={true}
        url={teacherUrl}
        teacher={teacher}
        isInMainPage={isInMainPage}
      />
      <div className={styles.wrapperAll}>
        <div className={styles.titleRow}>
          {program?.course_title}
        </div>
        <div className={styles.mainRow}>
          <h1>{program?.title}</h1>
          <button>Создать урок</button>
        </div>
        {lessons.length > 0 ?
          <>
            <div className={styles.lessonWrapper}>
              {lessons.map(lesson => (
                <div className={styles.lessons_uploaded}>
                  <div className={styles.lessonRow}>
                    <div className={styles.lessonTitle}>
                      Урок {lesson.lesson_order}: {lesson.title}
                    </div>
                    <div className={styles.lessonDesc}>
                      <p>{lesson.tesis}</p>
                    </div>
                  </div>
                  <div className={styles.lessonButtons}>
                    <button>
                      Редактировать
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
          :
          <>
            <h1>Список уроков</h1>
            <p>Вы еще не добавили уроки к вашим занятиям</p>
          </>
        }
      </div>
    </div>
  </>;
};

export default myPrograms;
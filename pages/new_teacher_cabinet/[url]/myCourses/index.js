import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import styles from './index.module.css'
import globals from "../../../../src/globals";
import axios from "axios";
import HeaderTeacher from "../../../../src/components/new_HeaderTeacher/new_HeaderTeacher";

const myCourses = () => {
  const router = useRouter();
  const teacherUrl = router.query.url
  const [teacher, setTeacher] = useState([])
  const [baseDataLoaded, setBaseDataLoaded] = useState(false)
  const [courses, setCourses] = useState([]);
  const [programs, setPrograms] = useState([])
  const [showAllPrograms, setShowAllPrograms] = useState(false);

  const isInMainPage = true;

  useEffect(() => {
    if (!baseDataLoaded || !teacher) {
      loadBaseData()
      setBaseDataLoaded(true)
    }
    console.log('teacherUrl', teacherUrl)
    console.log('teacher', teacher)
    console.log('courses', courses)

  }, [teacherUrl, teacher]);

  const loadBaseData = async () => {
    let data = teacherUrl
    let getTeacherByUrl = await axios.post(`${globals.productionServerDomain}/getTeacherByUrl/` + data)
    const teacherIdLocal = getTeacherByUrl['data'][0]?.id
    console.log('teacherIdLocal', teacherIdLocal)
    setTeacher(getTeacherByUrl['data'][0])
    let teacherCourses = await axios.post(`${globals.productionServerDomain}/getCoursesByTeacherId/` + teacherIdLocal)
    console.log('teacherCourses', teacherCourses)
    setCourses(teacherCourses['data'])
    let teacherPrograms = await axios.post(`${globals.productionServerDomain}/getProgramsByTeacherId/` + teacherIdLocal)
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
      {courses.length > 0 ?
        <>
          <div className={styles.wrapperAll}>
            <div className={styles.mainRow}>
              <h1>Мои курсы</h1>
              <button>Создать курс</button>
            </div>
            <div className={styles.courseWrapper}>
              {courses.map(course => {
                const relevantPrograms = programs.filter(program => program.course_id === course.id);
                const visiblePrograms = showAllPrograms ? relevantPrograms : relevantPrograms.slice(0, 2);

                return (
                  <div className={styles.uploadedCoursesWrapper} key={course.id}>
                    <div className={styles.courseRow}>
                      <span className={styles.courseTitle}>{course.title}</span>
                      <hr />
                      <div className={styles.coursePrograms}>
                        <p>Предмет: {course.category_name}</p>
                        <p>Программа:
                          {visiblePrograms.length > 0 ? visiblePrograms.map((program, index) => (
                            <span key={program.id}>{program.title}{index !== visiblePrograms.length - 1 ? ', ' : ''}</span>
                          )) : <span>отсутствует</span>}
                          {relevantPrograms.length > 2 && (
                            <span className={styles.clickProgramm} onClick={() => setShowAllPrograms(!showAllPrograms)}>
                              {showAllPrograms ? '...' : ` и еще ${relevantPrograms.length - 2}`}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className={styles.courseButtons}>
                      <button onClick={() => router.push(`/new_teacher_cabinet/${teacherUrl}/myPrograms?course=${course.id}`)}>Перейти к программам</button>
                      <span>Редактировать информацию</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
        :
        <>
          <div className={styles.noCourses}>
            А курсов то и нет!
          </div>
        </>}
    </div>
  </>;
};

export default myCourses;
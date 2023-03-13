import React, {useEffect, useState} from "react";
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
    {courses?
      <>
        <div className={styles.myCourses}>
          <div className={styles.mainRow}>
            <span>Мои курсы</span>
            <button>Создать курс</button>
          </div>
          {courses.map(course => {
            const relevantPrograms = programs.filter(program => program.course_id === course.id);
            const visiblePrograms = showAllPrograms ? relevantPrograms : relevantPrograms.slice(0, 2);

            return (
              <div className={styles.courseRow} key={course.id}>
                <span className={styles.courseTitle}>{course.title}</span>
                <div className={styles.coursePrograms}>
                  <p>Предмет: {course.category_name}</p>
                  <p>Программа: 
                    {visiblePrograms.length > 0 ? visiblePrograms.map((program, index) => (
                      <span key={program.id}>{program.title}{index !== visiblePrograms.length - 1 ? ', ' : ''}</span>
                    )) : <span>отсутствует</span>}
                    {relevantPrograms.length > 2 && (
                      <span onClick={() => setShowAllPrograms(!showAllPrograms)}>
                        {showAllPrograms ? '...' : `и еще ${relevantPrograms.length - 2}`}
                      </span>
                    )}
                  </p>
                </div>
                <div className={styles.courseButtons}>
                  <button>Перейти к программам</button>
                  <button>Редактировать информацию</button>
                </div>
              </div>
            );
          })}
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
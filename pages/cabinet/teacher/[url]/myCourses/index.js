import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import styles from './index.module.css'
import globals from "../../../../../src/globals";
import axios from "axios";
import HeaderTeacher from "../../../../../src/components/new_HeaderTeacher/new_HeaderTeacher";
import { Image } from "react-bootstrap";
import GoToLessonWithTimerComponent from "../../../../../src/components/GoToLessonWithTimerComponent/GoToLessonWithTimerComponent";
import GuideModal from "../../../../../src/components/GuideModal/GuideModal";


const myCourses = () => {
  const router = useRouter();
  const teacherUrl = router.query.url
  const [teacher, setTeacher] = useState([])
  const [baseDataLoaded, setBaseDataLoaded] = useState(false)
  const [courses, setCourses] = useState([]);
  const [programs, setPrograms] = useState([])
  const [showAllPrograms, setShowAllPrograms] = useState(false);
  const [showGuide, setShowGuide] = useState(false)
  const [guide, setGuide] = useState()

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

  const [baseDataIsLoading, setBaseDataIsLoading] = useState(true)

  const loadGuide = async (id) => {
    let getGuideById = await axios.post(`${globals.productionServerDomain}/getGuideById/` + id)
    setGuide(getGuideById['data'][0])
    console.log('guide', getGuideById, guide)
  }

  const loadBaseData = async () => {
    setBaseDataIsLoading(true)
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
    setBaseDataIsLoading(false)
  }

  return <>
    <div className={styles.container}>
      <HeaderTeacher
        white={true}
        url={teacherUrl}
        teacher={teacher}
        isInMainPage={isInMainPage}
      />
             <GoToLessonWithTimerComponent isTeacher={true} url={router.query.url} />
            {baseDataIsLoading ? '' : <>      {courses.length > 0 ?
        <>
          <div className={styles.wrapperAll}>
            <GuideModal showGuide={showGuide} setShowGuide={setShowGuide} guide={guide}/>
            <div className={styles.mainRow}>
              <div style={{display: 'flex', flexDirection: 'row'}}>
                <h1>Мои курсы</h1>
                <Image 
                  src="https://realibi.kz/file/628410.png"
                  style={{marginLeft: '10px', width: '20px', height: '20px'}}
                  onClick={() => {
                    loadGuide(8)
                    setShowGuide(true)
                  }}
                />
              </div>
              <div style={{display: 'flex', flexDirection: 'row'}}>
                <button onClick={() => router.push(`/cabinet/teacher/${teacherUrl}/createCourse`)}>Создать курс</button>
                <Image 
                  src="https://realibi.kz/file/628410.png"
                  style={{marginLeft: '10px', width: '20px', height: '20px'}}
                  onClick={() => {
                    loadGuide(1)
                    setShowGuide(true)
                  }}
                />
              </div>
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
                      <button onClick={() => router.push(`/cabinet/teacher/${teacherUrl}/myPrograms?course=${course.id}`)}>Перейти к программам</button>
                      <span onClick={() => router.push(`/cabinet/teacher/${teacherUrl}/editCourse?course=${course.id}`)}>Редактировать информацию</span>
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
            <img src='https://realibi.kz/file/296080.png' />
            <h1>У вас еще нет созданных курсов</h1>
            <GuideModal showGuide={showGuide} setShowGuide={setShowGuide} guide={guide}/>
            <p>Для того, чтобы вести уроки на платформе, вам необходимо выбрать предмет, по которому будете обучать</p>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <button onClick={() => router.push(`/cabinet/teacher/${teacherUrl}/createCourse`)}>Создать курс</button>
              <Image 
                src="https://realibi.kz/file/628410.png"
                style={{marginLeft: '10px', width: '20px', height: '20px'}}
                onClick={() => {
                  loadGuide(3)
                  setShowGuide(true)
                }}
              />
            </div>
          </div>
        </>}</>}

    </div>
  </>;
};

export default myCourses;
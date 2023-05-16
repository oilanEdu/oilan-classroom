import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import styles from './index.module.css'
import globals from "../../../../../src/globals";
import { Image } from "react-bootstrap";
import axios from "axios";
import HeaderTeacher from "../../../../../src/components/new_HeaderTeacher/new_HeaderTeacher";
import GoToLessonWithTimerComponent from "../../../../../src/components/GoToLessonWithTimerComponent/GoToLessonWithTimerComponent";
import GuideModal from "../../../../../src/components/GuideModal/GuideModal";
import Footer from "../../../../../src/components/Footer/Footer";

const myPrograms = () => {
  const router = useRouter();
  const teacherUrl = router.query.url
  const courseId = router.query.course
  const [teacher, setTeacher] = useState([])
  const [course, setCourse] = useState([])
  const [baseDataLoaded, setBaseDataLoaded] = useState(false)
  const [programs, setPrograms] = useState([])
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
    console.log('router', router)

  }, [teacherUrl, teacher]);

  const loadGuide = async (id) => {
    let getGuideById = await axios.post(`${globals.productionServerDomain}/getGuideById/` + id)
    setGuide(getGuideById['data'][0])
    console.log('guide', getGuideById, guide)
  }

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
        <HeaderTeacher
        white={true}
        url={teacherUrl}
        teacher={teacher}
        isInMainPage={isInMainPage}
      />
    <div className={styles.container}>

       <GoToLessonWithTimerComponent isTeacher={true} url={router.query.url} />
      <div className={styles.wrapperAll}>
        <GuideModal showGuide={showGuide} setShowGuide={setShowGuide} guide={guide}/>
        <div className={styles.titleRow}>
          <div onClick={() => router.push(`/cabinet/teacher/${teacherUrl}/myCourses`)} className={styles.courseTitle}>
            {course?.title}
          </div>
          <div className={styles.mainRow}>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <h1>Мои программы</h1>
              <Image 
                src="https://realibi.kz/file/628410.png"
                style={{marginLeft: '10px', width: '20px', height: '20px'}}
                onClick={() => {
                  loadGuide(7)
                  setShowGuide(true)
                }}
              />
            </div>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <button onClick={() => router.push(`/cabinet/teacher/${teacherUrl}/createProgram?course=${courseId}`)}>Создать программу</button>
              <Image 
                src="https://realibi.kz/file/628410.png"
                style={{marginLeft: '10px', width: '20px', height: '20px'}}
                onClick={() => {
                  loadGuide(6)
                  setShowGuide(true)
                }}
              />
            </div>
          </div>
        </div>
        <div className={styles.programWrapper}>
          {programs.map(program => (
            <div className={styles.programms_uploaded}>
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
                  <p>Формат: {program.type == 'individual' ? 'индивидуальная' : 'групповая'}</p>
                </div>
              </div>
              <div className={styles.programButtons}>
                <button onClick={() => router.push(`/cabinet/teacher/${teacherUrl}/myLessons?program=${program.id}`)}>
                  Перейти к урокам
                </button>
                <span onClick={() => router.push(`/cabinet/teacher/${teacherUrl}/editProgram?program=${program.id}`)}>Редактировать информацию</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <Footer />
  </>;
};

export default myPrograms;
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import styles from './index.module.css'
import globals from "../../../../../src/globals";
import axios from "axios";
import HeaderTeacher from "../../../../../src/components/new_HeaderTeacher/new_HeaderTeacher";
import { Image } from "react-bootstrap";
import GoToLessonWithTimerComponent from "../../../../../src/components/GoToLessonWithTimerComponent/GoToLessonWithTimerComponent";
import Footer from "../../../../../src/components/Footer/Footer";

const createCourse = () => {
  const router = useRouter();
  const courseId = router.query.course
  const teacherUrl = router.query.url
  const [teacher, setTeacher] = useState([])
  const [course, setCourse] = useState([])
  const [baseDataLoaded, setBaseDataLoaded] = useState(false)
  const [courseCategories, setCourseCategories] = useState([])
  const [step, setStep] = useState(1)
  const [subject, setSubject] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (course?.category_id) {
      setSubject(course?.category_id)
    }
    if (course?.title) {
      setTitle(course?.title)
    }
    if (course?.description) {
      setDescription(course?.description)
    }
  }, [course])

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
    let subjects = await axios.get(`${globals.productionServerDomain}/getCategories`)
    setCourseCategories(subjects.data);
    let courseInfo = await axios.post(`${globals.productionServerDomain}/getCourseById/`, { courseId })
    setCourse(courseInfo['data'][0])
    console.log('courseInfo', courseInfo['data'][0])
  }

  const handleSubmit = () => {
    editCourse()
  }


  const editCourse = async () => {
    const data = {
      courseId,
      title, 
      description,
      courseCategory: subject, 
    };

    console.log(data);

    await axios({
      method: "put",
      url: `${globals.productionServerDomain}/updateNewCourse`,
      data: data,
    })
      .then(function (res) {
        alert("Курс успешно изменен"); 
      })
      .catch((err) => {
        alert("Произошла ошибка"); 
      });
  };

  const deleteCourse = async (id) => {
    const data = {
      id
    }; 

    await axios({
      method: "delete",
      url: `${globals.productionServerDomain}/deleteCourse`,
      data: data,
    })
      .then(function (res) {
        router.push(`/cabinet/teacher/${teacherUrl}/myCourses`)
      })
      .catch((err) => {
        alert("Произошла ошибка"); 
      });
  }

  const addressUndefinedFixer = async () => {
    await router.push(`/cabinet/teacher/${localStorage.login}`)
    window.location.reload()
  }
  useEffect(() => {
    if (router.query.url === "undefined") {
      addressUndefinedFixer()
    }
  }, [router])

  return <>
        <HeaderTeacher
        white={true}
        url={teacherUrl}
        teacher={teacher}
        isInMainPage={isInMainPage}
      />
    <div className={styles.container}>
       <GoToLessonWithTimerComponent isTeacher={true} url={router.query.url} />
      <div className={styles.createCourse}>
        <div className={styles.stepOne}>
          <div className={styles.row}>
            <h1>Редактирование курса</h1>
            <button onClick={() => {deleteCourse(courseId)}}>Удалить курс</button>
          </div>
          <div className={styles.contentWrapper}>
            <div className={styles.input_container}>
              <p>Выберите предмет</p>
              <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                {courseCategories.map(category => (
                  <option value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div className={styles.input_container}>
              <p>Название курса</p>
              <input value={title} placeholder="пр. Математика для 9 класса" onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className={styles.input_container}>
              <p>Описание курса</p>
              <textarea value={description} placeholder="пр. Проходим логарифмы и первообразные" onChange={(e) => setDescription(e.target.value)}></textarea>

            </div>
            <button className={styles.form_button} onClick={() => { handleSubmit() }}>Сохранить</button>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </>;
};

export default createCourse;
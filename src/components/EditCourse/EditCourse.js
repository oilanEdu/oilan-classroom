import styles from "./EditCourse.module.css";
import React, { useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import globals from "../../globals";

const axios = require("axios").default;

export default function EditCourse({ show, setShow, teacher, course }) {
  const [title, setTitle] = useState(course.title);
  const [courseUrl, setCourseUrl] = useState(course.url);
  const [courseCategory, setCourseCategory] = useState(course.category_id);
  const [showLogData, setShowLogData] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [teachers, setTeachers] = useState([])
  const [categories, setCategories] = useState([])
  const [courses, setCourses] = useState([])
  const [programs, setPrograms] = useState([])
  const [lessons, setLessons] = useState([])
  const [students, setStudents] = useState([])
  const [roles, setRoles] = useState([])

  console.log(course);

  const getTeachers = async () => {
    let result = await axios.get(`${globals.productionServerDomain}/getTeachers`)
      setTeachers(result.data);
      console.log(teachers)
  }

  const getCategories = async () => {
    let result = await axios.get(`${globals.productionServerDomain}/getCategories`)
      setCategories(result.data);
      console.log(categories)
  }

  const getCourses = async () => {
    let result = await axios.get(`${globals.productionServerDomain}/getCourses`)
      setCourses(result.data);
      console.log(courses)
  }

  const getPrograms = async () => {
    let result = await axios.get(`${globals.productionServerDomain}/getPrograms`)
      setPrograms(result.data);
      console.log(programs)
  }

  const getLessons = async () => {
    let result = await axios.get(`${globals.productionServerDomain}/getLessons`)
      setLessons(result.data);
      console.log(lessons)
  }

  const getStudents = async () => {
    let result = await axios.get(`${globals.productionServerDomain}/getStudents`)
      setStudents(result.data);
      console.log(students)
  }

  const getRoles = async () => {
    let result = await axios.get(`${globals.productionServerDomain}/getRoles`)
      setRoles(result.data);
      console.log(roles)
  }

  useEffect(() => {
    getTeachers()
    getCategories()
    getCourses()
    getPrograms()
    getLessons()
    getStudents()
    getRoles()
  },[])

  const updateCourse = async () => {
    const data = {
      courseId: course.id,
      title,
      courseUrl,
      courseCategory,
    };

    console.log(data);

    await axios({
      method: "put",
      url: `${globals.productionServerDomain}/updateCourse`,
      data: data,
    })
      .then(function (res) {
        alert("Курс успешно изменен"); 
        
      })
      .catch((err) => {
        alert("Произошла ошибка"); 
      });
  };

  return (
    <div 
      className={styles.modal}
      style={{
        // display: show ? "block" : "none"
        transform: `translate(${show ? "-50%, -50%" : "-50%, -100%"})`,
        top: show ? "50%" : "0%",
        opacity: show ? 1 : 0
      }}
      
    >
      <div className={styles.detailInfo}>
        <p 
          className={styles.close}
          onClick={() => setShow(!show)}
        >
          X
        </p>
        <div className={styles.showDetailInfoContain}>
          <div className={styles.detailInfoHeader}>
            <p>Добавить курс на платформу</p>
          </div>
          <div className={styles.dataBlock}>
            <div className={styles.formBlock}>
              <div className={styles.input_container}>
                <input
                  type="text"
                  value={title}
                  placeholder="Название курса"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <span>*</span>
              </div>
              <br/>
              <div className={styles.url_input}>
                <div className={styles.pass_data} style={{display: showLogData ? "block" : "none"}}>
                  <p className={styles.pass_data_head}>Для защиты данных наши условия для ссылки. </p>
                  <p className={styles.pass_data_head}>Он должен содержать:</p>
                  <p className={styles.pass_data_text}>8 и более символов</p>
                  <p className={styles.pass_data_text}>латинские буквы</p>
                  <p className={styles.pass_data_text}>цифры</p>
                  <p className={styles.pass_data_text}>знаки пунктуации (!”$%/:’@[]^_)</p>
                  <div className={styles.pass_data_left}></div>
                </div>
                <div className={styles.input_container}>
                  <input
                    type="text"
                    value={courseUrl}
                    placeholder="Короткая ссылка латиницей"
                    onChange={(e) => setCourseUrl(e.target.value)}
                  />
                  <span>*</span>
                </div>
                
                <span>Используется в адресной строке. Пример: oilan-classroom.com/[короткая_ссылка]</span>
                <span onClick={() => setShowLogData(!showLogData)} className={styles.login_cr}></span>
              </div>
              <div className={styles.input_container}>
                <select
                  onChange={(e) => setCourseCategory(e.target.value)}
                  value={courseCategory}
                >
                  <option value="0" disabled>Выберите направление</option>
                  {categories.map(category => (
                    <option value={category.id}>{category.name}</option>
                  ))}
                </select>
                <span>*</span>
              </div>
              <span 
                style={{display: errorMessage === "" ? "none" : "inline-block"}}  
                className={styles.error_message}
              >
                {errorMessage}
              </span>
              <span style={{color: "#3B3B3BC9"}}>
                Звездочками отмечены поля, обязательные для заполнения
              </span>
              <button 
                onClick={() => {
                  updateCourse();
                }}
              >Обновить</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

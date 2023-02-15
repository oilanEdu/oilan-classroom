import styles from "./NewCourse.module.css";
import React, { useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import globals from "../../globals";

const axios = require("axios").default;

export default function NewCourse({ show, setShow, teacher }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fullPrice, setFullPrice] = useState(0);
  const [monthlyPrice, setMonthlyPrice] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [program, setProgram] = useState("");
  const [courseUrl, setCourseUrl] = useState("");
  const [translationLink, setTranslationLink] = useState("");
  const [courseCategory, setCourseCategory] = useState(0);

  const [teachers, setTeachers] = useState([])
  const [categories, setCategories] = useState([])
  const [courses, setCourses] = useState([])
  const [programs, setPrograms] = useState([])
  const [lessons, setLessons] = useState([])
  const [students, setStudents] = useState([])
  const [roles, setRoles] = useState([])

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

  const createCourse = async () => {
  const data = {
    title,
    description,
    fullPrice,
    monthlyPrice,
    startDate: new Date(),
    endDate: new Date(),
    program,
    courseUrl,
    translationLink,
    teacherId: teacher?.id,
    courseCategory,
  };

  console.log(data);

  try {
    const res = await axios.post(`${globals.productionServerDomain}/createCourse`, data);

    if (res.status === 201) {
      alert("Курс успешно создан");
    } else {
      alert("Произошла ошибка");
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      alert(error.response.data);
    } else {
      alert("Произошла ошибка");
    }
  }
};

  return (
    <div 
      className={styles.modal}
      style={{
        // display: show ? "block" : "none"
        transform: `translate(${show ? "-50%, -50%" : "-50%, -100%"})`,
        top: show ? "55%" : "0%",
        opacity: show ? 1 : 0
      }}
      
    >
      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>Добавить курс</p>
          <p 
            className={styles.close}
            onClick={() => setShow(!show)}
          >
            X
          </p>
        </div>
        <div className={styles.showDetailInfoContain}>
          <div className={styles.dataBlock}>
            <div className={styles.formBlock}>
              Название курса: <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              /><br/>
              Описание курса: <textarea
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}></textarea><br/>
              {/*Стоимость курса: <input
                type="number"
                value={fullPrice}
                onChange={(e) => setFullPrice(e.target.value)}
              /><br/>
              Стоимость одного месяца: <input
                type="number"
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(e.target.value)}
              /><br/>
              Дата начала: <input 
                type="date"
                // value="2022-10-20"
                min="2022-01-01" 
                max="2025-12-31"
                onChange={(e) => setStartDate(e.target.value)}
              /><br/>
              Дата окончания: <input 
                type="date"
                // value="2022-10-20"
                min="2022-01-01" 
                max="2025-12-31"
                onChange={(e) => setEndDate(e.target.value)}
              /><br/>
              Программа: <textarea
                type="text"
                value={program}
                onChange={(e) => setProgram(e.target.value)}></textarea><br/>*/}
              URL: <input
                type="text"
                value={courseUrl}
                onChange={(e) => setCourseUrl(e.target.value)}
              /><br/>
              {/*Ссылка на трансляцию: <input
                type="text"
                value={translationLink}
                onChange={(e) => setTranslationLink(e.target.value)}
              /><br/>*/}
              {/* Преподаватель: <select
                onChange={(e) => setTeacherId(e.target.value)}
                value={teacherId}>
                  <option value="0" disabled>Выберите преподавателя</option>
                  {teachers.map(teacher => (
                    <option value={teacher.id}>{teacher.surname} {teacher.name} {teacher.patronymic}</option>
                    ))}
                </select><br/> */}
              Направление: <select
                onChange={(e) => setCourseCategory(e.target.value)}
                value={courseCategory}>
                  <option value="0" disabled>Выберите направление</option>
                  {categories.map(category => (
                    <option value={category.id}>{category.name}</option>
                    ))}
                </select><br/>
              <button 
                onClick={() => {
                  createCourse();
                  setShow(false);
                }}
              >Создать</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

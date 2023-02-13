import styles from "./styles.module.css";
import React, { useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import globals from "../../../../../src/globals";
import { useRouter } from "next/router";
import HeaderTeacher from "../../../../../src/components/HeaderTeacher/HeaderTeacher";
import Footer from "../../../../../src/components/Footer/Footer";

const axios = require("axios").default;

export default function EditCourse() {
  const router = useRouter()
  const [courseId, setCourseId] = useState(router.query.courseId);

  const [course, setCourse] = useState();
  console.log(courseId);
  console.log(course);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fullPrice, setFullPrice] = useState(0);
  const [monthlyPrice, setMonthlyPrice] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [program, setProgram] = useState("");
  const [courseUrl, setCourseUrl] = useState("");
  const [translationLink, setTranslationLink] = useState("");
  const [teacherId, setTeacherId] = useState(0);
  const [courseCategory, setCourseCategory] = useState(0);

  const [teachers, setTeachers] = useState([])
  const [categories, setCategories] = useState([])
  const [courses, setCourses] = useState([])
  const [programs, setPrograms] = useState([])
  const [lessons, setLessons] = useState([])
  const [students, setStudents] = useState([])
  const [roles, setRoles] = useState([])

  const [teacher, setTeacher] = useState([])

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

  const getCourse = async () => {
    const data = {
      courseId: courseId
    }
    let result = await axios.post(`${globals.productionServerDomain}/getCourseById`, data)
      setCourse(result.data[0]);
      setTitle(result.data[0].title);
      setDescription(result.data[0].description);
      setDescription(result.data[0].description);
      setFullPrice(result.data[0].full_price);
      setMonthlyPrice(result.data[0].monthly_price);
      setStartDate(result.data[0].start_date);
      setEndDate(result.data[0].end_date);
      setProgram(result.data[0].program);
      setCourseUrl(result.data[0].url);
      setTranslationLink(result.data[0].translation_link);
      setCourseCategory(result.data[0].category_id)
      console.log(course)
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
    getCourse()
  },[])

  function findTeacher(element, index, array) {
    const teacherId = course?.teacher_id
  
    return element.id === teacherId;
  };

  useEffect(() => {
    getCourse();
  },[courseId]);

  useEffect(() => {
    setTeacher(teachers.find(findTeacher));
  },[course])

  const createCourse = async () => {
    const data = {
      courseId,
      title,
      description,
      fullPrice,
      monthlyPrice,
      startDate,
      endDate,
      program,
      courseUrl,
      translationLink,
      teacherId: teacher?.id,
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
    <>
    <HeaderTeacher white={true} teacher={teacher} />
    <div className={styles.container}>
      
      <div className={styles.detailInfo}>
        <div className={styles.detailInfoHeader}>
          <p>Редактировать курс</p>
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
              Стоимость курса: <input
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
                onChange={(e) => setProgram(e.target.value)}></textarea><br/>
              URL: <input
                type="text"
                value={courseUrl}
                onChange={(e) => setCourseUrl(e.target.value)}
              /><br/>
              Ссылка на трансляцию: <input
                type="text"
                value={translationLink}
                onChange={(e) => setTranslationLink(e.target.value)}
              /><br/>
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
                }}
              >Обновить</button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
    <Footer />
    </>
  );
}

EditCourse.getInitialProps = async (ctx) => {
  console.log('lol',ctx)
  if(ctx.query.courseId !== undefined) {
      return {
          courseId: ctx.query.courseId,
      }
  }else{
      return {};
  }
}

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import styles from './index.module.css'
import globals from "../../../../../src/globals";
import axios from "axios";
import HeaderTeacher from "../../../../../src/components/new_HeaderTeacher/new_HeaderTeacher";

const AddNewStudent = () => {
  const router = useRouter();
  const teacherUrl = router.query.url
  const isInMainPage = true;

  const [studentSurname, setStudentSurname] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentPatronymic, setStudentPatronymic] = useState("");
  const [nickname, setNickname] = useState("");
  const [lessonProgramId, setLessonProgramId] = useState(0);
  const [courseId, setCourseId] = useState(0);
  const [gender, setGender] = useState("");

  const [teacher, setTeacher] = useState([])
  const [teachers, setTeachers] = useState([])
  const [categories, setCategories] = useState([])
  const [courses, setCourses] = useState([])
  const [programsAll, setProgramsAll] = useState([])
  const [lessons, setLessons] = useState([])
  const [students, setStudents] = useState([])
  const [roles, setRoles] = useState([])

  const [courseUrl, setCourseUrl] = useState("");
  const [showLogData, setShowLogData] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [succesMessage, setSuccesMessage] = useState("");

  const loadBaseData = async () => {
    let data = teacherUrl
    let getTeacherByUrl = await axios.post(`${globals.productionServerDomain}/getTeacherByUrl/` + data)
    const teacherIdLocal = getTeacherByUrl['data'][0]?.id
    console.log('teacherIdLocal', teacherIdLocal)
    setTeacher(getTeacherByUrl['data'][0])
  }

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
    console.log(teacher);
    let result = await axios.post(`${globals.productionServerDomain}/getCoursesByTeacherId/${teacher?.id}`)
    setCourses(result.data);
    console.log(courses)
  }

  const getPrograms = async () => {
    console.log(courseId);
    let result = await axios.post(`${globals.productionServerDomain}/getProgramsByCourseId/${courseId}`)
    setProgramsAll(result.data);
    console.log(result.data);
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
    loadBaseData()
    getTeachers()
    getCategories()
    getLessons()
    getStudents()
    getRoles()
  }, [])

  useEffect(() => {
    getPrograms();
  }, [courseId]);

  useEffect(() => {
    getCourses();
  }, [teacher]);

  const createStudentAndProgram = async () => {
    let result = await axios.post(`${globals.productionServerDomain}/getCourseByProgramId`, { programId: lessonProgramId });
    console.log('result', result.data.url)
    let courseURL = result.data.url
    setCourseUrl(result.data.url);
    const data = {
      studentSurname,
      studentName,
      studentPatronymic,
      nickname,
      programId: lessonProgramId
    };

    const dataAddProgram = {
      nickname,
      programId: lessonProgramId
    };

    console.log(data);

    if (studentSurname !== "" && studentName !== "" && nickname !== "" && lessonProgramId !== 0) {

      await axios({
        method: "post",
        url: `${globals.productionServerDomain}/createStudentAndProgram`,
        data: data,
      })
        .then(function (res) {
          console.log(res);
          setSuccesMessage("Учетная запись студента успешно создана!");
          setErrorMessage("");
        })
        .catch((err) => {
          console.log(err);
          setErrorMessage(err.response.data)
        });
    } else if (studentSurname === "" && studentName === "" && nickname !== "" && lessonProgramId !== 0) {
      await axios({
        method: "post",
        url: `${globals.productionServerDomain}/addStudentProgram`,
        data: dataAddProgram,
      })
        .then(function (res) {
          console.log(res);
          setSuccesMessage("Студент успешно добавлен в программу!");
          setErrorMessage("");
        })
        .catch((err) => {
          console.log(err);
          setErrorMessage(err.response.data)
        });
    } else {
      setErrorMessage("Заполните поля, обязательные для заполнения")
    }
  };

  return (
    <>
      <div className={styles.container}>
        <HeaderTeacher
          white={true}
          url={teacherUrl}
          teacher={teacher}
          isInMainPage={isInMainPage}
        />
        <div className={styles.contentWrapper}>
          <div className={styles.detailInfo}>
            <div className={styles.showDetailInfoContain}>
              <div className={styles.detailInfoHeader}>
                <p>Добавление нового студента</p>
              </div>
              <div className={styles.dataBlock}>
                <div className={styles.formBlock}>
                  <div className={styles.input_container}>
                    <p>Пол</p>
                    <div className={styles.wrapper_box}>
                      <div className={styles.wrapperLabel}>
                        <input className={styles.custom_checkbox} id='male' type="checkbox" name="languages" checked={gender === "male" ? true : false} onChange={() => setGender("male")} />
                        <label htmlFor="male">Мужской</label>
                        {/* <span>Мужской</span> */}
                      </div>
                      <div className={styles.wrapperLabel}>
                        <input className={styles.custom_checkbox} id='female' type="checkbox" checked={gender === "female" ? true : false} onChange={() => setGender("female")} />
                        <label htmlFor="female">Женский</label>
                        {/* <span>Женский</span> */}
                      </div>
                    </div>
                  </div>
                  <div className={styles.input_container}>
                    <p>Имя</p>
                    <input
                      className={styles.input_block}
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                    />
                  </div>
                  <div className={styles.input_container}>
                    <p>Отчество</p>
                    <input
                      className={styles.input_block}
                      type="text"
                      value={studentPatronymic}
                      onChange={(e) => setStudentPatronymic(e.target.value)}
                    />
                  </div>
                  <div className={styles.input_container}>
                    <p>Фамилия</p>
                    <input
                      className={styles.input_block}
                      type="text"
                      value={studentSurname}
                      onChange={(e) => setStudentSurname(e.target.value)}
                    />
                  </div>
                  <div className={styles.url_input}>
                    <div className={styles.input_container}>
                      <p>Логин</p>
                      <input
                        className={styles.input_block}
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                      />
                    </div>
                    <span onClick={() => setShowLogData(!showLogData)} className={styles.login_cr}></span>
                  </div>
                  <div className={styles.input_container}>
                    <p>Курс</p>
                    <select
                      className={styles.input_block}
                      onChange={(e) => {
                        setCourseId(e.target.value)
                        console.log(e);
                      }}
                      value={courseId}
                    >
                      <option value="0" disabled>Выберите курс</option>
                      {courses.map(course => (
                        <option value={course.id}>{course.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.input_container}>
                    <p>Программа</p>
                    <select
                      className={styles.input_block}
                      onChange={(e) => {
                        setLessonProgramId(e.target.value)
                        console.log(e);
                      }}
                      value={lessonProgramId}
                    >
                      <option value="0" disabled>Выберите программу</option>
                      {programsAll.map(program => (
                        <option value={program.id}>{program.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.input_container}>
                    <p>Ссылка для студента</p>
                    <textarea value={nickname !== "" && courseId !== 0 && lessonProgramId !== 0 ? "oilan-classroom.com/cabinet/student/" + nickname + "/course/" + courseUrl + "?program=" + lessonProgramId : "Ссылка будет создана после указания всех полей"}
                    />
                  </div>
                  <span
                    style={{ display: errorMessage === "" ? "none" : "flex" }}
                    className={styles.error_message}
                  >
                    {errorMessage}
                  </span>
                  <button
                    className={styles.form_button}
                    onClick={() => {
                      createStudentAndProgram();
                    }}
                  >
                    Добавить студента
                  </button>
                  <span
                    style={{ display: succesMessage === "" ? "none" : "inline-block" }}
                    className={styles.success_message}
                  >
                    {succesMessage}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddNewStudent;
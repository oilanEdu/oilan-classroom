import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import styles from './index.module.css'
import globals from "../../../../../../src/globals";
import axios from "axios";
import HeaderTeacher from "../../../../../../src/components/new_HeaderTeacher/new_HeaderTeacher";
import GoToLessonWithTimerComponent from "../../../../../../src/components/GoToLessonWithTimerComponent/GoToLessonWithTimerComponent";

const AddNewGroup = () => {
  const router = useRouter();
  const teacherUrl = router.query.url
  const isInMainPage = true;

  const [groupTitle, setGroupTitle] = useState("");
  const [lessonProgramId, setLessonProgramId] = useState(0);
  const [courseId, setCourseId] = useState(0);
  const [studentsByGroup, setStudentsByGroup] = useState([]);
  const [studentsByGroupInfo, setStudentsByGroupInfo] = useState([]);
  useEffect(() => {
    console.log(studentsByGroupInfo, "studentsByGroupInfo");
    studentsByGroupInfo
    // debugger
  }, [studentsByGroupInfo])

  const [teacher, setTeacher] = useState([])
  const [teachers, setTeachers] = useState([])
  const [categories, setCategories] = useState([])
  const [courses, setCourses] = useState([])
  const [programsAll, setProgramsAll] = useState([])
  const [lessons, setLessons] = useState([])
  const [students, setStudents] = useState([])
  const [roles, setRoles] = useState([])

  const [errorMessage, setErrorMessage] = useState("");
  const [succesMessage, setSuccesMessage] = useState("");
  const [selectedStudent, setSelectedStudent] = useState()

  const studentsHandler = () => {
    students.forEach(student => {
      studentsByGroup.forEach(id => {
        // // debugger
        if (student.student_id === id) {
          // // debugger
          if (!studentsByGroupInfo.includes(student)) {
            // setStudentsByGroupInfo.push(newObj);
            setStudentsByGroupInfo(prevState => {
              return [
                ...prevState,
                student
              ]
            });
          }
          // setStudentsByGroupInfo(Array.from(new Set([...studentsByGroupInfo, student])));
         
        }
       
      })
    })
  }


  const deleteStudHandler = (studId) => {
    console.log(studId);
    setStudentsByGroup(studentsByGroup.filter(stud => stud !== studId))
    setStudentsByGroupInfo(studentsByGroupInfo.filter(stud => stud.student_id !== studId))
  }

  useEffect(() => {
    studentsHandler();
  }, [studentsByGroup]);

  useEffect(() => {
    if (students.length<1) {getStudents()}
  }, [students]);

  console.log(studentsByGroupInfo);

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
    let onlyGroupPrograms = result.data.filter(el => el.type === "group")
    setProgramsAll(onlyGroupPrograms);
    console.log(onlyGroupPrograms);
  }

  const getLessons = async () => {
    let result = await axios.get(`${globals.productionServerDomain}/getLessons`)
    setLessons(result.data);
    console.log(lessons)
  }

  const getStudents = async () => {
    let result = await axios.post(`${globals.productionServerDomain}/getStudentsByTeacherId`, {id: teacher?.id, sort: 'name'})
    setStudents(result.data);
    setSelectedStudent(result.data[0]?.student_id)
    // debugger
    console.log('result.data', result.data)
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
    loadBaseData()
  }, [teacherUrl])

  useEffect(() => {
    getPrograms();
  }, [courseId]);

  useEffect(() => {
    getCourses();
  }, [teacher]);

  const createNewGroup = async () => {
    const data = {
      teacherId: teacher?.id,
      title: groupTitle,
      programId: lessonProgramId
    }

    if (groupTitle !== "" && lessonProgramId !== 0) {

      await axios({
        method: "post",
        url: `${globals.productionServerDomain}/createGroup`,
        data: data,
      })
        .then(function (res) {
          console.log(res.data.id);

          studentsByGroup.forEach(async student => {
            const data = {
              groupId: res.data.id,
              studentId: student,
              programId: lessonProgramId,
              courseId: courseId
            }
            await axios({
              method: "post",
              url: `${globals.productionServerDomain}/createStudentGroup`,
              data: data,
            })
          })
        })
        .catch((err) => {
          console.log(err);
          setErrorMessage(err.response.data)
        });

        for (let index = 0; index < studentsByGroup.length; index++) {
          const element = studentsByGroup[index];
          const dataMiddleware = {
            nickname: studentsByGroupInfo.find(el => el.student_id === element).nickname,
            courseId: courseId,
            programId: lessonProgramId
          };
          // debugger
          await axios({
            method: "post",
            url: `${globals.productionServerDomain}/addStudentProgram`,
            data: dataMiddleware,
          })
            .then(function (res) {
              // alert("Программа успешно обновлена");
            })
            .catch((err) => {
              // alert("Произошла ошибка");
            });
        }
        
        router.push(`/cabinet/teacher/${encodeURIComponent(teacherUrl)}/myStudents#groups`)
    } else {
      setErrorMessage("Заполните поля, обязательные для заполнения")
    }
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

  
  return (
    <>
      <div className={styles.container}>
        <HeaderTeacher
          white={true}
          url={teacherUrl}
          teacher={teacher}
          isInMainPage={isInMainPage}
        />
              <GoToLessonWithTimerComponent isTeacher={true} url={router.query.url} />
        <div className={styles.contentWrapper}>
          <div className={styles.detailInfo}>
            <div className={styles.showDetailInfoContain}>
              <div className={styles.detailInfoHeader}>
                <p>Создание новой группы</p>
              </div>
              <div className={styles.dataBlock}>
                <div className={styles.formBlock}>
                  <div className={styles.input_container}>
                    <p>Название группы</p>
                    <input
                      className={styles.input_block}
                      type="text"
                      value={groupTitle}
                      onChange={(e) => setGroupTitle(e.target.value)}
                    />
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
                    <p>Добавьте студентов</p>
                    <select
                      className={styles.input_block}
                      // onChange={() => {
                      //   console.log(e.target.value);
                      //   setStudentsByGroup(Array.from(new Set([...studentsByGroup, e.target.value])))
                      // }}
                      onChange={(e) => {setStudentsByGroup(prevState => {
                        let test = (+e.target.value)
                        // debugger
                        return [
                          ...prevState,
                          test
                        ]
                      })
                      // debugger
                    }}
                      
                    >
                      <option value={selectedStudent}>Студенты</option>
                      {students.map(student => (
                        <option value={student.student_id}>{student.surname} {student.name}</option>
                      ))}
                    </select>
                  </div>
                  <div
                    style={{ display: errorMessage === "" ? "none" : "block" }}
                    className={styles.error_message}
                  >
                    {errorMessage}
                  </div>
                  <button
                    className={styles.form_button}
                    onClick={() => {
                      createNewGroup();
                    }}
                  >
                    Создать группу
                  </button>
                  <div
                    style={{ display: succesMessage === "" ? "none" : "block" }}
                    className={styles.success_message}
                  >
                    {succesMessage}
                  </div>
                </div>
                <div className={styles.addedStudents}>
                  <p>Добавленные студенты</p>
                  {studentsByGroupInfo.map((stud) => (
                    <div className={styles.wrapper_students}>
                      <div className={styles.student_info}>
                        <img src="https://realibi.kz/file/185698.svg" alt="" />
                        <p>{stud.surname} {stud.name}</p>
                      </div>
                      <div onClick={() => deleteStudHandler(stud.student_id)}>
                        <img className={styles.student_delete} src="https://realibi.kz/file/775192.svg" alt="" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddNewGroup;
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import styles from './index.module.css'
import globals from "../../../../../../src/globals";
import axios from "axios";
import HeaderTeacher from "../../../../../../src/components/new_HeaderTeacher/new_HeaderTeacher";
import GoToLessonWithTimerComponent from "../../../../../../src/components/GoToLessonWithTimerComponent/GoToLessonWithTimerComponent";
import stylesOfEditLesson from "../../myLessons/index.module.css"
import NewDateAndTimePickerForLesson from "../../../../../../src/components/NewDateAndTimePickerForLesson/NewDateAndTimePickerForLesson";
import Footer from "../../../../../../src/components/Footer/Footer";

const AddNewGroup = () => {
  const router = useRouter();
  const teacherUrl = router.query.url
  const isInMainPage = true;

  const [groupTitle, setGroupTitle] = useState("");
  const [currentGroup, setCurrentGroup] = useState()
  const [currentCourseId, setCurrentCourseId] = useState()
  const [currentProgramId, setCurrentProgramId] = useState()
  const [lessonProgramId, setLessonProgramId] = useState(0);
  const [courseId, setCourseId] = useState(0);
  const [studentsByGroup, setStudentsByGroup] = useState([]);
  const [studentsByGroupPrevious, setStudentsByGroupPrevious] = useState([])
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

  const [saveIsClicked, setSaveIsClicked] = useState(false)
  const [editData, setEditData] = useState(false);

  const studentsHandler = () => {
    
    students.forEach(student => {
      studentsByGroup.forEach(id => {
        // // debugger
        if (student.student_id === id) {
          // // debugger
          
        //   if (!studentsByGroupInfo.includes(student)) {
          if (!studentsByGroupInfo.some(obj => obj.student_id === id)) {
            
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
    const dataStudents = {
        id: teacherIdLocal
      }
      // let teacherStudents = await axios.post(`${globals.productionServerDomain}/getStudentsByTeacherId/`, dataStudents)
    let teacherGroups = await axios.post(`${globals.productionServerDomain}/getStudentsGroupsByTeacherId/`, dataStudents)
    // let groupId = router.query.groupId
    // // debugger
    // let getStudentsByGroupId = await axios.post(`${globals.productionServerDomain}/getStudentsByGroupId/` + groupId)
    // debugger

    // setGroups(teacherGroups['data'])

    let currentGroupLocal = teacherGroups['data'].find(el => el.id === +router.query.groupId)
    // debugger
    setCurrentGroup(currentGroupLocal)
    // setCurrentCourseId(currentGroupLocal.course_id)
    setCourseId(currentGroupLocal?.course_id)
    // setCurrentProgramId(currentGroupLocal.program_id)
    setLessonProgramId(currentGroupLocal?.program_id)
    setGroupTitle(currentGroupLocal?.title)
    console.log(teacherGroups['data']);

    let groupId = router.query.groupId
    // debugger
    let getStudentsByGroupId = await axios.post(`${globals.productionServerDomain}/getStudentsByGroupId/` + groupId)

    let filteredStudents = teacherGroups['data'].filter(el => getStudentsByGroupId['data'].some(el2 => el.student_id === el2.student_id && el.course_id === el2.course_id && el.program_id === el2.program_id && el.title === currentGroupLocal.title))
    const idArrayFilteredStudents = filteredStudents.map(obj => obj.student_id);
    // setStudents(filteredStudents)
    
    setStudentsByGroup(idArrayFilteredStudents)
    setStudentsByGroupPrevious(idArrayFilteredStudents)
    setStudentsByGroupInfo(filteredStudents)

    let programLessons = await axios.post(`${globals.productionServerDomain}/getLessonsByProgramId/` + currentGroupLocal?.program_id)
    // setLessons(programLessons['data'])
    debugger

    await axios.get(`${globals.productionServerDomain}/getLessonInfo_v2?course_url=${currentGroupLocal?.course_url}&program_id=${currentGroupLocal?.program_id}&student_id=${currentGroupLocal?.student_id}`).then(res => {
      let array = res.data
      const uniqueLessons = array.filter((item, index, self) => 
        index === self.findIndex((t) => (
          t.id === item.id
        ))
      );
      const newArray = [];

      uniqueLessons.forEach(element => {
        newArray.push(element);
      });

      programLessons['data'].forEach(element => {
        const found = newArray.some(el => el.id === element.id);
        if (!found) {
          newArray.push(element);
        }
      });
      setLessons(newArray);
      console.log(newArray);
    });
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
    // setLessons(result.data);
    // console.log(lessons)
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
        router.push(`/cabinet/teacher/${encodeURIComponent(teacherUrl)}/myStudents#groups`)
    } else {
      setErrorMessage("Заполните поля, обязательные для заполнения")
    }
  }

  const editGroup = async() => {
    ///Update group data
      const data = {
        // const { id, title, programId } = request.body
        id: currentGroup.id,
        title: groupTitle,
        programId: lessonProgramId
      }; 
      await axios({
        method: "put",
        url: `${globals.productionServerDomain}/updateGroup`, 
        data: data,
      })
        .then(function (res) {
          // alert("Данные успешно изменены"); 
        })
        .catch((err) => {
          alert("Произошла ошибка");
        });
        ///////////////////////////////////////
        ///////////////////////////////////////
        ///Update group data 2
        const data2 = {
          // const { id, title, programId } = request.body
          groupId: currentGroup.id,
          courseId: courseId,
          programId: lessonProgramId
          // groupId, programId, courseId
        }; 
        await axios({
          method: "put",
          url: `${globals.productionServerDomain}/updateGroupMiddleware`, 
          data: data2,
        })
          .then(function (res) {
            // alert("Данные успешно изменены"); 
          })
          .catch((err) => {
            alert("Произошла ошибка");
          });

        
        /// middleware updates 
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

        ///Update students of group list
        const whichStudentsToAdd = studentsByGroup.filter(el => !studentsByGroupPrevious.includes(el))
        const whichStudentsToDelete = studentsByGroupPrevious.filter(el => !studentsByGroup.includes(el))
        debugger

        if (whichStudentsToAdd.length >= 1) {
          for (let index = 0; index < whichStudentsToAdd.length; index++) {
            const element = whichStudentsToAdd[index];
            const data = {
              groupId: currentGroup.id,
              courseId: courseId,
              programId: lessonProgramId,
              studentId: element
              // groupId, programId, studentId, courseId
            }; 
            await axios({
              method: "post",
              url: `${globals.productionServerDomain}/createGroupMiddleware`, 
              data: data,
            })
              .then(function (res) {
                // alert("Данные успешно изменены"); 
                setSaveIsClicked(!saveIsClicked)
              })
              .catch((err) => {
                alert("Произошла ошибка", err);
              });
          }

        }

        if (whichStudentsToDelete.length >= 1) {
          for (let index = 0; index < whichStudentsToDelete.length; index++) {
            const element = whichStudentsToDelete[index];
            const data = {
              groupId: currentGroup.id,
              courseId: courseId,
              programId: lessonProgramId,
              studentId: element
              // groupId, programId, studentId, courseId
            }; 
            await axios({
              method: "delete",
              url: `${globals.productionServerDomain}/deleteGroupMiddleware`, 
              data: data,
            })
              .then(function (res) {
                // alert("Данные успешно изменены"); 
              })
              .catch((err) => {
                alert("Произошла ошибка", err);
              });
          }
        }

        router.push(`/cabinet/teacher/${encodeURIComponent(teacherUrl)}/myStudents/group?groupId=${currentGroup.id}`)
  }

//   2) В странице редактирования:
// Помимо того что есть, внизу вывести все уроки, а так же по нажатию на редактировать,чтобы можно было менять дату и время

// let selectedProgram = await axios.post(`${globals.productionServerDomain}/getProgramById/`, { programId })


const saveLessonDateAndTime = async (dateAndTimeMerger, lesson_id, course_id) => {
  if (dateAndTimeMerger.length > 10) {
    for (let index = 0; index < studentsByGroupInfo.length; index++) {
      const element = studentsByGroupInfo[index];
      const dataForGetSchedule = {
        lesson_id,
        course_id,
        student_id: element.student_id
      };
      console.log("dataForGetSchedule", dataForGetSchedule)
      let schedule = await axios({
        method: "post",
        url: `${globals.productionServerDomain}/getScheduleByLessonIdAndCourseIdAndStudentId`,
        data: dataForGetSchedule,
      }).then(function (res) {
        let scheduleRes = res.data
        console.log("scheduleRes", scheduleRes);
        if (scheduleRes.length > 0) {
          return scheduleRes
        }
      })
        .catch((err) => {
          alert("Произошла ошибка");
        });
      console.log(schedule, "schedule1")
      if (schedule != undefined) {
        if (schedule.some(el => el.lesson_id == lesson_id) && schedule.some(el => el.course_id == course_id) && schedule.some(el => el.student_id == element.student_id)) {
          console.log("isscheduleRIGHT is RIGHT")
          const dataForUpdateSchedule = {
            dateAndTimeMerger,
            lesson_id,
            course_id,
            student_id: element.student_id
          };
          // console.log("dataForGetSchedule", dataForGetSchedule)
          let schedule = await axios({
            method: "put",
            url: `${globals.productionServerDomain}/updateSchedule`,
            data: dataForUpdateSchedule,
          }).then(response => {
            // getTeachers()
            // getCategories()
            // loadTeacherData()
            // getStudents()
            // getRoles()
          })
        }
      }
      else {
        console.log("isscheduleRIGHT is NOT RIGHT");
        const dataForCreateSchedule = {
          dateAndTimeMerger,
          lesson_id,
          course_id,
          student_id: element.student_id
        };
        let schedule = await axios({
          method: "post",
          url: `${globals.productionServerDomain}/createSchedule`,
          data: dataForCreateSchedule,
        }).then(response => {
          // getTeachers()
          // getCategories()
          // loadTeacherData()
          // getStudents()
          // getRoles()
        })
      }
    }
  }
}

  // useEffect(() => {
  //   setSaveIsClicked(!saveIsClicked)
  // }, [lessons])

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
            <HeaderTeacher
          white={true}
          url={teacherUrl}
          teacher={teacher}
          isInMainPage={isInMainPage}
        />
      <div className={styles.container}>

              <GoToLessonWithTimerComponent isTeacher={true} url={router.query.url} />
        <div className={styles.contentWrapper}>
          <div className={styles.detailInfo}>
            <div className={styles.showDetailInfoContain}>
              <div className={styles.detailInfoHeader}>
                <p>Редактирование группы</p>
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
                    // disabled
                    onClick={() => {
                      editGroup()
                    }}
                  >
                    Сохранить изменения
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
              {/* {lessons?.map(lesson =>
                  <NewDateAndTimePickerForLesson
                    lessons2={lessons}
                    setLessons2={setLessons}
                    lesson={lesson}
                    lesson_id={lesson.id}
                    lesson_order={lesson.lesson_order}
                    student={studentsByGroupInfo[0]}
                    studentsByGroupInfo={studentsByGroupInfo}
                    saveLessonDateAndTime={saveLessonDateAndTime}
                    saveIsClicked={saveIsClicked}
                    editData={editData}
                  />
                )} */}
              <div className={styles.lessonsBlock}>
              {editData
              ? <button
                className={styles.saveScheduleButton}
                onClick={() => {
                  setSaveIsClicked(!saveIsClicked)
                  setEditData(false)
                }}
              >
                Сохранить расписание
              </button>
              : <button onClick={() => setEditData(true)} className={styles.saveScheduleButton}>Редактировать расписание</button>
              }
              {lessons.map(lesson => (
                <div className={stylesOfEditLesson.lessons_uploaded}>
                  <div className={stylesOfEditLesson.lessonRow}>
                    <div className={stylesOfEditLesson.lessonTitle}>
                      Урок {lesson.lesson_order}: {lesson.title}
                    </div>
                    <div className={stylesOfEditLesson.lessonDesc}>
                      <p>{lesson.tesis}</p>
                      <NewDateAndTimePickerForLesson
                    lessons2={lessons}
                    setLessons2={setLessons}
                    lesson={lesson}
                    lesson_id={lesson.id}
                    lesson_order={lesson.lesson_order}
                    student={studentsByGroupInfo[0]}

                    studentsByGroupInfo={studentsByGroupInfo}
                    isGroup={true}

                    saveLessonDateAndTime={saveLessonDateAndTime}
                    saveIsClicked={saveIsClicked}
                    editData={editData}
                  />
                    </div>
                  </div>
                  <div className={stylesOfEditLesson.lessonButtons}>
                    <button onClick={() => router.push(`/cabinet/teacher/${teacherUrl}/editLesson?lesson=${lesson?.id}&fromEditGroup=${true}&groupId=${router.query.groupId}`)}>
                      Редактировать урок
                    </button>
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AddNewGroup;
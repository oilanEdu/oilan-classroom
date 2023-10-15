import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import styles from './index.module.css'
import globals from "../../../../../src/globals";
import axios from "axios";
import HeaderTeacher from "../../../../../src/components/new_HeaderTeacher/new_HeaderTeacher";
import { Image } from "react-bootstrap";
import GoToLessonWithTimerComponent from "../../../../../src/components/GoToLessonWithTimerComponent/GoToLessonWithTimerComponent";
import EditLessonHomeworkComponent from "../../../../../src/components/EditLessonHomeworkComponent/EditLessonHomeworkComponent";
import Footer from "../../../../../src/components/Footer/Footer";

const createCourse = () => {
  const router = useRouter();
  const teacherUrl = router.query.url
  const lessonId = router.query.lesson
  const [teacher, setTeacher] = useState([])
  const [baseDataLoaded, setBaseDataLoaded] = useState(false)
  const [students, setStudents] = useState([]);

  const [lesson, setLesson] = useState()
  const [lessonTitle, setLessonTitle] = useState(lesson?.title)
  const [lessonDesc, setLessonDesc] = useState(lesson?.tesis)
  const [exercises, setExercises] = useState([])
  const [selectedExercise, setSelectedExercise] = useState([])

  const [exerciseText, setExerciseText] = useState('')
  const [exerciseAnswer, setExerciseAnswer] = useState('')

  const [firstExerPress, setFirstExerPress] = useState(false)

  const [localAttendance, setLocalAttendance] = useState([])

  const [materialTitle, setMaterialTitle] = useState()
  const [materialDescription, setMaterialDescription] = useState()
  const [materialLink, setMaterialLink] = useState()
  const [showMaterial, setShowMaterial] = useState(false)
  const [dateAndTimeMerger, setDateAndTimeMerger] = useState()
  const [dateState, setDateState] = useState();
  const [timeState, setTimeState] = useState()
  const [selectedOption, setSelectedOption] = useState('linkRadio');
  const [links, setLinks] = useState(undefined)
  const [materials, setMaterials] = useState()
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const [files, setFiles] = useState([])


  useEffect(() => {
    if (lesson?.title) {
      setLessonTitle(lesson?.title)
    }
    if (lesson?.tesis) {
      setLessonDesc(lesson?.tesis)
    }
  }, [lesson])

  const isInMainPage = true;

  useEffect(() => {
    if (!baseDataLoaded || !teacher) {
      loadBaseDataFirst()
      setBaseDataLoaded(true)
    }
    console.log('teacherUrl', teacherUrl)
    console.log('teacher', teacher)

  }, [teacherUrl, teacher]);

  const loadBaseDataFirst = async () => {
    let data = teacherUrl
    let getTeacherByUrl = await axios.post(`${globals.productionServerDomain}/getTeacherByUrl/` + data)
    const teacherIdLocal = getTeacherByUrl['data'][0]?.id
    console.log('teacherIdLocal', teacherIdLocal)
    setTeacher(getTeacherByUrl['data'][0])
    let lessonInfo = await axios.post(`${globals.productionServerDomain}/getLessonById/`, { lessonId })
    console.log(lessonInfo['data'][0])
    setLesson(lessonInfo['data'][0])
    let count = 0
    let getExercises = await axios.post(`${globals.productionServerDomain}/getExercisesByLessonId/` + lessonInfo['data'][0]?.id).then(res => {
      console.log('exercises', res.data)
      res.data.forEach(async row => {
        count += 1
        row.exercise_order = count
        const data = {
          new_order: count,
          exercise_id: row.id
        }
        await axios.put(`${globals.productionServerDomain}/updateExerNumber/`, data)
      })
      setExercises(res.data)
      // debugger
    })


    const dataStudents = {
      id: teacherIdLocal,
      sort: 'sort'
    }
    let teacherStudents = await axios.post(`${globals.productionServerDomain}/getStudentsByTeacherId/`, dataStudents)

    function filterByRepetitiveId(objects) {
      // Group objects by ID
      const groupedById = {};
      objects.forEach((obj) => {
        if (groupedById[obj.student_id]) {
          groupedById[obj.student_id].push(obj);
        } else {
          groupedById[obj.student_id] = [obj];
        }
      });

      // Filter objects by closest date
      const result = [];
      Object.values(groupedById).forEach((group) => {
        if (group.length > 1) {
          result.push(group[0]);
        } else {
          result.push(group[0]);
        }
      });

      return result;
    }
    setStudents(filterByRepetitiveId(teacherStudents['data']))

    const dataLesson = {
      lesson_id: lessonId
    }
    let getLessonAttendance = await axios.post(`${globals.productionServerDomain}/getLessonAttendance/`, dataLesson)
    setLocalAttendance(getLessonAttendance['data'])
    // debugger

    fetch()
  }

  const loadBaseDataSecond = async () => {
    let data = teacherUrl
    let getTeacherByUrl = await axios.post(`${globals.productionServerDomain}/getTeacherByUrl/` + data)
    const teacherIdLocal = getTeacherByUrl['data'][0]?.id
    console.log('teacherIdLocal', teacherIdLocal)
    setTeacher(getTeacherByUrl['data'][0])
    let lessonInfo = await axios.post(`${globals.productionServerDomain}/getLessonById/`, { lessonId })
    console.log(lessonInfo['data'][0])
    // setLesson(lessonInfo['data'][0])
    let count = 0
    let getExercises = await axios.post(`${globals.productionServerDomain}/getExercisesByLessonId/` + lessonInfo['data'][0]?.id).then(res => {
      console.log('exercises', res.data)
      res.data.forEach(async row => {
        count += 1
        row.exercise_order = count
        const data = {
          new_order: count,
          exercise_id: row.id
        }
        await axios.put(`${globals.productionServerDomain}/updateExerNumber/`, data)
      })
      setExercises(res.data)
    })

  }

  const handleSubmit = () => {
    updateLesson()
  }

  const updateLesson = async () => {
    const data = {
      lessonId,
      lessonTitle,
      lessonDesc,
      exerciseId: selectedExercise?.id,
      exerciseText,
      exerciseAnswer,
    };

    console.log('data', data)

    if (!lessonId) {
      alert("Урок не найден")
    } else {
      await axios({
        method: "put",
        url: `${globals.productionServerDomain}/updateNewLesson`,
        data: data,
      })
        .then(function (res) {
          alert("Урок успешно изменен");
        })
        .catch((err) => {
          alert("Произошла ошибка");
        });
    }
  }

  const deleteLesson = async (id) => {
    const data = {
      id
    };

    await axios({
      method: "delete",
      url: `${globals.productionServerDomain}/deleteLesson`,
      data: data,
    })
      .then(function (res) {
        router.push(`/cabinet/teacher/${teacherUrl}/myLessons?program=${lesson?.program_id}`)
      })
      .catch((err) => {
        alert("Произошла ошибка");
      });
  }



  const createEmptyExercise = async () => {
    const exerciseText = 'Текст'
    const exerciseLessonId = lesson?.id
    const correctlyAnswer = 'Ответ'
    const status = "not verified"

    const data = {
      exerciseText,
      exerciseLessonId,
      correctlyAnswer,
      status
    };
    console.log(data)
    if (!exerciseLessonId) {
      alert("Урок не найден")
    } else {
      await axios({
        method: "post",
        url: `${globals.productionServerDomain}/createExercise`,
        data: data,
      })
        .then(function (res) {
          alert("Задание успешно создано");
          // let idOfNewExercise = res['data']
          // let localExercisesArray1 = exercises
          // const newExercise = {id: idOfNewExercise, text: exerciseText, lesson_id: exerciseLessonId, correct_answer: correctlyAnswer, status: status}
          // localExercisesArray1.push(newExercise)
          // setExercises(localExercisesArray1)
          // debugger
          // debugger
        })
        .catch((err) => {
          alert("Произошла ошибка");
        });
    }
  }

  const updateExercise = async (exerciseId, exerciseText, exerciseAnswer) => {
    const data = {
      exerciseId,
      exerciseText,
      exerciseAnswer
    };

    await axios({
      method: "put",
      url: `${globals.productionServerDomain}/updateExercise`,
      data: data,
    })
      .then(function (res) {
        alert("Задание успешно изменено");
      })
      .catch((err) => {
        alert("Произошла ошибка");
      });
  }

  const deleteExercise = async (id) => {
    const data = {
      id
    };

    await axios({
      method: "delete",
      url: `${globals.productionServerDomain}/deleteExercise`,
      data: data,
    })
      .then(function (res) {
        alert("Задание успешно удалено");
      })
      .catch((err) => {
        alert("Произошла ошибка");
      });
  }

  const [handleSubmitIsClicked, setHandleSubmitIsClicked] = useState(false)

  const addressUndefinedFixer = async () => {
    await router.push(`/cabinet/teacher/${localStorage.login}`)
    window.location.reload()
  }
  useEffect(() => {
    if (router.query.url === "undefined") {
      addressUndefinedFixer()
    }
  }, [router])

  const attendanceAll = async () => {
    let newArray = [...localAttendance]
    for (let index = 0; index < students.length; index++) {
      const element = students[index];
      const data = {
        person_id: element.student_id,
        lesson_id: lessonId
      }
      const create = await axios.post(`${globals.productionServerDomain}/createAttendanceControlTeacher/`, data)
      const newData = {
        ...data,
        id: create['data']['id']
      }
      newArray.push(newData)

    }
    setLocalAttendance(newArray)
  }

  const handleAttendanceSumbit = async (person_id, lesson_id) => {
    const data = {
      person_id,
      lesson_id
    }
    const create = await axios.post(`${globals.productionServerDomain}/createAttendanceControlTeacher/`, data)

    const newData = {
      ...data,
      id: create['data']['id']
    }
    let localAttendance2 = [...localAttendance]
    localAttendance2.push(newData)
    setLocalAttendance(localAttendance2)
  }


  const fetch = async () => {
    const response = await axios.post(`${globals.productionServerDomain}/getLessonMaterialsOC`, { lessonId: lessonId });
    const links = response['data']['data'].filter(obj => obj.is_lesson_link === true);
    const materials = response['data']['data'].filter(obj => obj.is_lesson_link === false);
    setLinks(links)
    setMaterials(materials)
    console.log(materials, "materials")
    console.log(links, "links")
    // debugger 
  }
  // useEffect(() => {
  //   fetch()
  // }, [])

  const handleSubmit2 = async () => {
    if (selectedOption === 'fileRadio') {
      files
      // event.preventDefault();
      const formData = new FormData();
      formData.append('file', files[0]);
      axios.post(`${globals.productionServerDomain}/file/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(async (response) => {
        console.log(response)
        const uploadedFileName = response.data;
        console.log('uploadedFileName', uploadedFileName)

        let format = uploadedFileName.split('.').pop()
        const data = {
          title: materialTitle,
          description: materialDescription,
          file_type: format,
          // link: materialLink,
          link: selectedOption === 'fileRadio' ? uploadedFileName : materialLink,
          is_lesson_link: false,
          lesson_id: lessonId
        }
        try {
          const create = await axios.post(`${globals.productionServerDomain}/addLessonMaterialOC/`, data)
          if (create.status === 200) {
            // addAlert("Материал успешно загружен", "accepted", alerts, setAlerts);

            // setMaterialTitle('')
            // setMaterialDescription('')
            // setMaterialLink('')
            // setShowMaterial(false)
            // setSelectedOption('linkRadio')
            fetch()
          } else {
            // addAlert("Ошибка при загрузке материала", "error", alerts, setAlerts);
            // return { success: false, message: 'Error in creating program' };
          }
        } catch (error) {
          // addAlert("Ошибка сети", "error", alerts, setAlerts);
          // console.error('Error:', error);
          // return { success: false, message: 'Network error or unexpected issue occurred' };
        }


        const filePath = `${globals.ftpDomain}${uploadedFileName}`;
        console.log('filePath', filePath)
        filePath
      }).catch((error) => {
        console.log(error);
      });
    } else {
      const data = {
        title: materialTitle,
        description: materialDescription,
        file_type: 'link',
        // link: materialLink,
        link: selectedOption === 'fileRadio' ? uploadedFileName : materialLink,
        is_lesson_link: false,
        lesson_id: lessonId
      }
      try {
        const create = await axios.post(`${globals.productionServerDomain}/addLessonMaterialOC/`, data)
        if (create.status === 200) {
          // addAlert("Материал успешно загружен", "accepted", alerts, setAlerts);

          // setMaterialTitle('')
          // setMaterialDescription('')
          // setMaterialLink('')
          // setShowMaterial(false)
          // setSelectedOption('linkRadio')
          fetch()
        } else {
          // addAlert("Ошибка при загрузке материала", "error", alerts, setAlerts);
          // return { success: false, message: 'Error in creating program' };
        }
      } catch (error) {
        // addAlert("Ошибка сети", "error", alerts, setAlerts);
        console.error('Error:', error);
        // return { success: false, message: 'Network error or unexpected issue occurred' };
      }

    }
  }


  const handleLessonLinkSubmit = async () => {
    const data = {
        title: 'Ссылка на видеоконференцию',
        description: 'Ссылка',
        file_type: 'link_lesson',
        // link: materialLink,
        link: selectedOption === 'fileRadio' ? uploadedFileName : materialLink,
        is_lesson_link: true,
        lesson_id: lessonId
    }
    try {
        const create = await axios.post(`${globals.productionServerDomain}/addLessonMaterialOC/`, data)
        debugger
        if (create.status === 200) {
            // addAlert("Ссылка отправлена", "accepted", alerts, setAlerts);

            setMaterialTitle('')
            setMaterialDescription('')
            setMaterialLink('')
            setShowMaterial(false)
            setSelectedOption('linkRadio')
            // return { success: true, message: 'Program created succesfully' };
        } else {
            // addAlert("Ошибка при отправлении ссылки", "error", alerts, setAlerts);
            // return { success: false, message: 'Error in creating program' };
        }
    } catch (error) {
        // addAlert("Ошибка сети", "error", alerts, setAlerts);
        // console.error('Error:', error);
        // return { success: false, message: 'Network error or unexpected issue occurred' };
    }
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
      <div className={styles.editLesson}>
        <span className={styles.whichProgramm}>Программа {lesson?.program_title}</span>
        <div className={styles.row}>
          <h1>Изменение урока</h1>
          <span onClick={() => {
            deleteLesson(lessonId)
          }}>Удалить урок</span>
        </div>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: 'space-between', marginBottom: '40px' }}>
          <div style={{ width: '40%', marginRight: '40px' }} className={styles.input_container}>
            <span>Название урока</span>
            <input
              className={styles.lessonTitle}
              type="text"
              value={lessonTitle}
              placeholder="Текст"
              onChange={(e) => setLessonTitle(e.target.value)}
            />
            <span>Описание урока</span>
            <textarea
              className={styles.lessonContent}
              type="text"
              value={lessonDesc}
              placeholder="Текст"
              onChange={(e) => setLessonDesc(e.target.value)}>
            </textarea>

            <div style={{marginTop: '40px'}}>
        {links?.length > 0 ? <div className={styles.lessonInfoBlock}>
                        <label className={styles.label}>Ссылка на онлайн-урок: </label>
                        <a className={styles.label} style={{ wordBreak: 'break-word', width: '45%' }} href={links[0].link}>{links[0].link}</a></div> : <div className={styles.lessonInfoBlock}>
                        <label htmlFor="title" className={styles.label}>Ссылка на онлайн-урок: </label>
                        <input id="tesis" className={styles.input} value={materialLink} onChange={(e) => setMaterialLink(e.target.value)} placeholder="Приложить ссылку на онлайн-урок"></input>
                        <button className={styles.saveButton} onClick={() => {
                            handleLessonLinkSubmit()
                            setLinks([{ link: materialLink }])
                        }}>Отправить ссылку на онлайн-урок</button>

                    </div>}
        </div>

            <div style={{ marginTop: '60px' }} ></div>
            {/* ////////// */}
            {materials?.length > 0 ?
              <div className={styles.lessonInfoBlock}>
                <p style={{ marginBottom: '20px' }} className={styles.answer_text}>
                  Материалы:
                </p>
                <div style={{display: 'flex', alignItems: 'flex-start'}}
                 className={styles.materials}>
                  {materials.map(el => (
                    <div className={styles.material}
                      // onClick={() => deleteMaterial(el.link)}
                      style={{ width: '100px', wordBreak: 'break-all' }}
                    >
                      <img src="https://realibi.kz/file/146797.png"></img>
                      <p>{el.title}.{el.file_type}</p>
                    </div>))}
                </div>
              </div>
              : ''}
            <div className={styles.lessonInfoBlock}>
              <span className={styles.label}>Материал:</span>
              <input className={styles.input} onChange={(e) => setMaterialTitle(e.target.value)} value={materialTitle} placeholder="Название"></input>
              <input className={styles.input} onChange={(e) => setMaterialDescription(e.target.value)} value={materialDescription} placeholder="Описание"></input>
            </div>
            <div className={styles.lessonInfoBlock}>
              <span className={styles.label}>Тип материала:</span>
              <span
                style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center' }}>
                <input
                  type="radio"
                  id="radio1"
                  name="radioGroup"
                  value="linkRadio"
                  checked={selectedOption === 'linkRadio'}
                  onChange={handleOptionChange}
                />
                <label htmlFor="radio1">Ссылка на материал</label>
              </span>
              <span
                style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center' }}>
                <input
                  type="radio"
                  id="radio2"
                  name="radioGroup"
                  value="fileRadio"
                  checked={selectedOption === 'fileRadio'}
                  onChange={handleOptionChange}
                />
                <label htmlFor="radio2">Приложить материал как файл</label>
              </span>
            </div>
            <div className={styles.lessonInfoBlock}>
              {selectedOption === 'fileRadio' ?
                <input type="file" name="file" onChange={(event) => {
                  setFiles(event.target.files)
                }} />
                :
                <input className={styles.input} value={materialLink} onChange={(e) => setMaterialLink(e.target.value)} placeholder="Ссылка на материал"></input>
              }
            </div>
            <div className={styles.lessonInfoBlock}>
              <button className={styles.saveButton} onClick={() => handleSubmit2()}>Отправить материал</button>
            </div>
            {/* ////////// */}
          </div>
          <div className={styles.attendanceWrapper}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ marginBottom: '40px' }}>Посещаемость урока</span>
              <div style={{ display: 'flex', gap: '10px', cursor: 'pointer' }}
                onClick={() => {
                  attendanceAll()
                }}>
                <p>Отметить всех</p>
                <img src="https://realibi.kz/file/638719.png"
                  style={{ cursor: 'pointer', width: '24px', height: '24px' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '15px', flexDirection: 'column' }}>
              {students.map(el => (
                <div className={styles.attendanceItem} style={{ display: "flex" }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <img src="https://realibi.kz/file/100841.png" />
                    <p>{el.name} {el.surname}</p>
                  </div>
                  {/* <input
                                    checked={localAttendance.find(el2 => el2.lesson_id === lessonId && el2.person_id === el.id) === undefined ? false : true}
                                    disabled={localAttendance.find(el2 => el2.lesson_id === lessonId && el2.person_id === el.id) === undefined ? false : true}
                                    onChange={() => { handleAttendanceSumbit(el.id, lessonId) }}
                                    type="checkbox"></input> */}
                  <img src="https://realibi.kz/file/638719.png"
                    style={{ cursor: 'pointer', opacity: (localAttendance.find(el2 => +el2.lesson_id === +lessonId && +el2.person_id === +el.student_id) === undefined ? false : true) ? '0.4' : '1' }}
                    onClick={() => { handleAttendanceSumbit(el.student_id, lessonId) }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.exercisesData}>
          <div className={styles.exerciseSelectBlock}>
            {exercises.map(exercise => (
              <div className={styles.exerItem}
                style={exercise.id == selectedExercise.id ? { backgroundColor: '#2E8CF2' } : { backgroundColor: '#A3CEFD' }}
                onClick={async () => {
                  await setSelectedExercise(exercise)
                  await setExerciseText(exercise.text)
                  await setFirstExerPress(true)
                  await setExerciseAnswer(exercise.correct_answer)
                  await loadBaseDataSecond()
                }}
              >
                Задание {exercise.exer_order}
              </div>
            ))}
            <div className={styles.wrapperPlusMinus}>
              <div
                className={styles.plusMinusButton}
                onClick={async () => {
                  await createEmptyExercise()
                  await loadBaseDataSecond()
                  await setSelectedExercise('')
                  // await loadBaseDataSecond()
                  await loadBaseDataSecond()
                }}
              >+</div>
              <div
                className={styles.plusMinusButton}
                onClick={async () => {
                  await deleteExercise(selectedExercise.id)
                  await loadBaseDataSecond()
                  await setSelectedExercise('')
                }}
              >-</div>
            </div>
          </div>
          {exercises.map(el => (
            <EditLessonHomeworkComponent el={el} selectedExercise={selectedExercise} firstExerPress={firstExerPress}
              handleSubmitIsClicked={handleSubmitIsClicked}
              setHandleSubmitIsClicked={setHandleSubmitIsClicked}
              lessonTitle={lessonTitle}
              lessonDesc={lessonDesc}
              lesson={lesson}
            />
          ))}

        </div>
      </div>
    </div>
    {/* Footer /> */}
  </>;
};

export default createCourse;
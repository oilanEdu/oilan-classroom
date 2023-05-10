import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import styles from './index.module.css'
import globals from "../../../../../src/globals";
import axios from "axios";
import HeaderTeacher from "../../../../../src/components/new_HeaderTeacher/new_HeaderTeacher";
import { Image } from "react-bootstrap";
import GoToLessonWithTimerComponent from "../../../../../src/components/GoToLessonWithTimerComponent/GoToLessonWithTimerComponent";
import { addDays, getDay } from "date-fns";

const createCourse = () => {
  const router = useRouter();
  const teacherUrl = router.query.url
  const [teacher, setTeacher] = useState([])
  const [baseDataLoaded, setBaseDataLoaded] = useState(false)
  const [courseCategories, setCourseCategories] = useState([])
  const [step, setStep] = useState(1)
  const [subject, setSubject] = useState(1)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [program, setProgram] = useState()
  const [programTitle, setProgramTitle] = useState('')
  const [programType, setProgramType] = useState('individual')
  const [programLessCount, setProgramLessCount] = useState('1 занятие')
  const [programSchedule, setProgramSchedule] = useState('Понедельник')
  const [programLessTime, setProgramLessTime] = useState('16:30 - 18:00')
  const [viewModal, setViewMidal] = useState(false)
  const [autoLessonsCancelled, setAutoLessonsCancelled] = useState(false)
  const [daysOfTheWeek, setDaysOfTheWeek] = useState([])
  const [newProgramTimes, setDewProgramTimes] = useState()

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
  }

  const handleSubmit2 = () => {
    if (step === 1 && subject && title && description) {
      setStep(2)
    } else if (step === 2 && programTitle && programType  && daysOfTheWeek.length !== 0 && newProgramTimes !== undefined) {
      if (autoLessonsCancelled) {
        setViewMidal(true)
      } else {

      }
      createNewCourse()
    }
  }

  const handleSubmit = () => {
    if (step === 1 && subject && title && description) {
      setStep(2)
    } else if (step === 2 && programTitle && programType) {
      if (autoLessonsCancelled) {
        setViewMidal(true)
      } else {

      }
      createNewCourse()
    }
    // if (programTitle && programType) {
    //   createNewCourse
    //   setViewMidal(true)
    // }
  }

  const generateUrl = (length) => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let url = '';
    for (let i = 0; i < length; i++) {
      url += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return url;
  }

  const courseUrl = generateUrl(10);

  const createNewCourse = async () => {
    const courseUrl = generateUrl(10);

    const courseData = {
      course: {
        title: title,
        description: description,
        courseUrl: courseUrl,
        teacherId: teacher?.id,
        categoryId: subject,
      },
      program: {
        programTitle: programTitle,
        programType: programType,
      }
    };

    console.log('courseData', courseData)
    debugger
    await axios.post(`${globals.productionServerDomain}/createCourseAndProgram/`, courseData)
      .then(async response => {
        console.log(response.data);
        setProgram(response.data.programId)
        // handle success
        // debugger
        if (autoLessonsCancelled) {
           
        } else {
                  // auto lessons
        let localProgramId = response.data.programId
        let localCourseId = response.data.courseId
        const a = daysOfTheWeek; // Дни недели, которые нужно проверять
        let count = 0;
        const [hours, minutes] = newProgramTimes.split(":");
        let currentDate = new Date();
        currentDate.setHours(hours);
        currentDate.setMinutes(minutes);
        currentDate.setSeconds(0);
        currentDate.setMilliseconds(0);
        console.log(true, "ITS SOME");
        while (count < programLessCount) {
          currentDate = addDays(currentDate, 1);
          const dayOfWeek = getDay(currentDate);
          if (a.includes(dayOfWeek)) {
            console.log(true, "ITS TRUEEE", currentDate);
            const lessonData = {
              lessonTitle: "Название " + ((+count) + 1),
              lessonOrder: ((+count) + 1),
              lessonCourseId: localCourseId,
              lessonTesis: "Тезис " + ((+count) + 1),
              lessonStartTime: currentDate,
              lessonProgramId: localProgramId,
            };
            debugger
            await axios.post(`${globals.productionServerDomain}/createLesson/`, lessonData)
            .then(response => {
              console.log(response.data);
              setProgram(response.data.programId)
              // handle success
            })
            .catch(error => {
              console.log(error.response.data);
              // handle error
            });
            count++;
          } else {
            console.log(true, "ITS NOT TRUEEE");
          }
          
        } 
        if (autoLessonsCancelled) {
          // setViewMidal(true)
        } else {
          await router.push(`/cabinet/teacher/${teacherUrl}/myCourses`)
          window.location.reload()
        }
        }
      })
      .catch(error => {
        console.log(error.response.data);
        debugger
        // handle error
      });

  }

  // const handleSubmit2 = () => {
  //   if (programTitle && programType) {
  //     createNewProgram2()
  //     setViewMidal(true)
  //   }
  // }
  // const createNewProgram2 = async () => {
  //   let localProgramId
  //   const programData = {
  //     programTitle: programTitle,
  //     programType: programType,
  //     programCourseId: courseId,
  //     programTeacherId: teacher?.id
  //   };

  //   console.log('programData', programData)

  //   await axios.post(`${globals.productionServerDomain}/createNewProgram/`, programData)
  //     .then(response => {
  //       console.log(response.data);
  //       setProgram(response.data.programId)
  //       localProgramId = response.data.programId
  //       // handle success
  //     })
  //     .catch(error => {
  //       console.log(error.response.data);
  //       // handle error
  //     });
        
  //       const a = daysOfTheWeek; // Дни недели, которые нужно проверять
  //       let count = 0;
  //       const [hours, minutes] = newProgramTimes.split(":");
  //       let currentDate = new Date();
  //       currentDate.setHours(hours);
  //       currentDate.setMinutes(minutes);
  //       currentDate.setSeconds(0);
  //       currentDate.setMilliseconds(0);
  //       console.log(true, "ITS SOME");
  //       while (count < programLessCount) {
  //         currentDate = addDays(currentDate, 1);
  //         const dayOfWeek = getDay(currentDate);
  //         if (a.includes(dayOfWeek)) {
  //           console.log(true, "ITS TRUEEE", currentDate);
  //           const lessonData = {
  //             lessonTitle: "Название " + count + 1,
  //             lessonOrder: count + 1,
  //             lessonCourseId: courseId,
  //             lessonTesis: "Тезис " + count + 1,
  //             lessonStartTime: currentDate,
  //             lessonProgramId: localProgramId,
  //           };
  //           await axios.post(`${globals.productionServerDomain}/createLesson/`, lessonData)
  //           .then(response => {
  //             console.log(response.data);
  //             setProgram(response.data.programId)
  //             // handle success
  //           })
  //           .catch(error => {
  //             console.log(error.response.data);
  //             // handle error
  //           });
  //           count++;
  //         } else {
  //           console.log(true, "ITS NOT TRUEEE");
  //         }
          
  //       }
  //     // const { lessonTitle, lessonOrder, lessonCourseId, lessonTesis, lessonStartTime, lessonProgramId } = request.body

  // }

  return <>
    <div className={styles.container}>
      <HeaderTeacher
        white={true}
        url={teacherUrl}
        teacher={teacher}
        isInMainPage={isInMainPage}
      />
      <GoToLessonWithTimerComponent isTeacher={true} url={router.query.url} />
      <div className={styles.modal} style={viewModal ? { display: 'flex' } : { display: 'none' }}>
        <h1>Поздравляем, вы создали новый курс</h1>
        <p>Теперь вам нужно добавить уроки к программе занятий и вы можете приступать к обучению</p>
        <div className={styles.modal_button__wrapper}>
          <button onClick={() => router.push(`/cabinet/teacher/${teacherUrl}/createLesson?program=${program}`)}>Добавить уроки</button>
          <span onClick={() => router.push(`/cabinet/teacher/${teacherUrl}/myCourses`)}>Спасибо, позже</span>
        </div>
      </div>
      <div className={styles.createCourse}>
        {step === 1 && (
          <>
            <div className={styles.stepOne}>
              <h1>Создание курса</h1>
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
                  <input placeholder="пр. Математика для 9 класса" onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className={styles.input_container}>
                  <p>Описание курса</p>
                  <textarea placeholder="пр. Проходим логарифмы и первообразные" onChange={(e) => setDescription(e.target.value)}></textarea>

                </div>
                <button className={styles.form_button} onClick={() => { handleSubmit() }}>Продолжить</button>
              </div>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div className={styles.stepTwo}>
              <h1>Добавление программы занятий</h1>
              <div className={styles.contentWrapper}>
                <div className={styles.input_container}>
                  <p>Название программы</p>
                  <input placeholder="Для Алишера 9 класс" onChange={(e) => setProgramTitle(e.target.value)} />
                </div>
                <div className={styles.input_container}>
                  <p>Выберите формат</p>
                  <div className={styles.radio_wrapper}>
                    <div className={styles.wrapperLabel}>
                      <input
                        className={styles.custom_radio}
                        id='group'
                        type="radio"
                        name="programType"
                        value="group"
                        checked={programType === 'group'}
                        onChange={(e) => setProgramType(e.target.value)}
                      />
                      <label htmlFor="group">Групповая</label>
                    </div>
                    <div className={styles.wrapperLabel}>
                      <input
                        className={styles.custom_radio}
                        id='individual'
                        type="radio"
                        name="programType"
                        value="individual"
                        checked={programType === 'individual'}
                        onChange={(e) => setProgramType(e.target.value)}
                      />
                      <label htmlFor="individual"> Индивидуальная </label>
                    </div>
                  </div>
                </div>
                <div className={styles.input_container}>
              <p>Количество занятий в неделю</p>
              <div className={styles.input_with_checkbox}>
                <select disabled={autoLessonsCancelled} value={programLessCount} onChange={() => setProgramLessCount(event.target.value)}>
                  <option value={1}>1 занятие</option>
                  <option value={2}>2 занятие</option>
                  <option value={3}>3 занятие</option>
                  <option value={4}>4 занятие</option>
                  <option value={5}>5 занятие</option>
                  <option value={6}>6 занятие</option>
                  <option value={7}>7 занятие</option>
                  <option value={8}>8 занятие</option>
                  <option value={9}>9 занятие</option>
                  <option value={10}>10 занятие</option>
                  <option value={11}>11 занятие</option>
                  <option value={12}>12 занятие</option>
                  <option value={13}>13 занятие</option>
                  <option value={14}>14 занятие</option>
                  <option value={15}>15 занятие</option>
                </select>
                <div className={styles.wrapperLabelCheckbox}>
                  <input className={styles.custom_checkbox} id="skip_1" type="checkbox" />
                  <label onClick={() => setAutoLessonsCancelled(!autoLessonsCancelled)} htmlFor="skip_1">Пропустить</label>
                </div>
              </div>
            </div>
            {autoLessonsCancelled ? '' : <>            <div className={styles.input_container}>
              <p>Расписание занятий</p>
              <div className={styles.input_with_checkbox}>
                {/* <input placeholder={programSchedule} /> */}
                <div className={styles.daysOfTheWeek}>
                  <div 
                  className={daysOfTheWeek.find(el => el === 1) ? styles.dayOfTheWeekSelected : styles.dayOfTheWeek} 
                  onClick={() => {if (daysOfTheWeek.find(el => el === 1)) {
                    
                    let test = daysOfTheWeek
                    test = test.filter(item => item !== 1); 
                    setDaysOfTheWeek(test)
                    debugger
                  } else {
                    debugger
                    setDaysOfTheWeek(prevState => {
                      return [
                        ...prevState,
                        1
                      ]
                    });
                  }}}>ПН</div>
                  <div className={daysOfTheWeek.find(el => el === 2) ? styles.dayOfTheWeekSelected : styles.dayOfTheWeek} 
                  onClick={() => {if (daysOfTheWeek.find(el => el === 2)) {
                    
                    let test = daysOfTheWeek
                    test = test.filter(item => item !== 2); 
                    setDaysOfTheWeek(test)
                    debugger
                  } else {
                    debugger
                    setDaysOfTheWeek(prevState => {
                      return [
                        ...prevState,
                        2
                      ]
                    });
                  }}}>ВТ</div>
                  <div className={daysOfTheWeek.find(el => el === 3) ? styles.dayOfTheWeekSelected : styles.dayOfTheWeek} 
                  onClick={() => {if (daysOfTheWeek.find(el => el === 3)) {
                    
                    let test = daysOfTheWeek
                    test = test.filter(item => item !== 3); 
                    setDaysOfTheWeek(test)
                    
                  } else {
                    
                    setDaysOfTheWeek(prevState => {
                      return [
                        ...prevState,
                        3
                      ]
                    });
                  }}}>СР</div>
                  <div className={daysOfTheWeek.find(el => el === 4) ? styles.dayOfTheWeekSelected : styles.dayOfTheWeek} 
                  onClick={() => {if (daysOfTheWeek.find(el => el === 4)) {
                    
                    let test = daysOfTheWeek
                    test = test.filter(item => item !== 4); 
                    setDaysOfTheWeek(test)
                    
                  } else {
                    
                    setDaysOfTheWeek(prevState => {
                      return [
                        ...prevState,
                        4
                      ]
                    });
                  }}}>ЧТ</div>
                  <div className={daysOfTheWeek.find(el => el === 5) ? styles.dayOfTheWeekSelected : styles.dayOfTheWeek} 
                  onClick={() => {if (daysOfTheWeek.find(el => el === 5)) {
                    
                    let test = daysOfTheWeek
                    test = test.filter(item => item !== 5); 
                    setDaysOfTheWeek(test)
                    
                  } else {
                    
                    setDaysOfTheWeek(prevState => {
                      return [
                        ...prevState,
                        5
                      ]
                    });
                  }}}>ПТ</div>
                  <div className={daysOfTheWeek.find(el => el === 6) ? styles.dayOfTheWeekSelected : styles.dayOfTheWeek} 
                  onClick={() => {if (daysOfTheWeek.find(el => el === 6)) {
                    
                    let test = daysOfTheWeek
                    test = test.filter(item => item !== 6); 
                    setDaysOfTheWeek(test)
                    
                  } else {
                    
                    setDaysOfTheWeek(prevState => {
                      return [
                        ...prevState,
                        6
                      ]
                    });
                  }}}>СБ</div>
                  <div className={daysOfTheWeek.find(el => el === "0") ? styles.dayOfTheWeekSelected : styles.dayOfTheWeek} 
                  onClick={() => {if (daysOfTheWeek.find(el => el === "0")) {
                    
                    let test = daysOfTheWeek
                    test = test.filter(item => item !== "0"); 
                    setDaysOfTheWeek(test)
                    debugger
                  } else {
                    debugger
                    setDaysOfTheWeek(prevState => {
                      return [
                        ...prevState,
                        "0"
                      ]
                    });
                  }}}>ВС</div>
                </div>
                <div className={styles.wrapperLabelCheckbox}>
                  <input className={styles.custom_checkbox} id="skip_2" type="checkbox" />
                  {/* <label onClick={() => setAutoLessonsCancelled(!autoLessonsCancelled)} htmlFor="skip_2">Пропустить</label> */}
                </div>
              </div>
            </div>
            <div className={styles.input_container}>
              <p>Время занятий</p>
              {/* <input placeholder={programLessTime} /> */}
              <input value={newProgramTimes} onChange={() => setDewProgramTimes(event.target.value)} className={styles.time} type="time"/>
            </div></>}
            <button className={styles.form_button} 
            // onClick={() => { handleSubmit() }}
            onClick={() => {if (autoLessonsCancelled) {
              handleSubmit() 
            } else {
              handleSubmit2() 
            }}}
            
            >Создать курс</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  </>;
};

export default createCourse;
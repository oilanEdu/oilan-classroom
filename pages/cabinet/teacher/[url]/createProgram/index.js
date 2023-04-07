import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import styles from './index.module.css'
import globals from "../../../../../src/globals";
import axios from "axios";
import HeaderTeacher from "../../../../../src/components/new_HeaderTeacher/new_HeaderTeacher";
import { Image } from "react-bootstrap";
import GoToLessonWithTimerComponent from "../../../../../src/components/GoToLessonWithTimerComponent/GoToLessonWithTimerComponent";
import { addDays, getDay } from "date-fns";

const createProgram = () => {
  const router = useRouter();
  const courseId = router.query.course
  const teacherUrl = router.query.url
  const [teacher, setTeacher] = useState([])
  const [baseDataLoaded, setBaseDataLoaded] = useState(false)
  const [program, setProgram] = useState()
  const [programTitle, setProgramTitle] = useState('')
  const [programType, setProgramType] = useState('individual')
  const [programLessCount, setProgramLessCount] = useState(1)
  const [programSchedule, setProgramSchedule] = useState('Понедельник')
  const [programLessTime, setProgramLessTime] = useState('16:30 - 18:00')
  const [viewModal, setViewMidal] = useState(false)
  const [daysOfTheWeek, setDaysOfTheWeek] = useState([])
  const [newProgramTimes, setDewProgramTimes] = useState()
  useEffect(() => {
    newProgramTimes
    // debugger
  }, [newProgramTimes])
  const [autoLessonsCancelled, setAutoLessonsCancelled] = useState(false)

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
  }

  const handleSubmit = () => {
    if (programTitle && programType) {
      createNewProgram()
      setViewMidal(true)
    }
  }

  const handleSubmit2 = () => {
    if (programTitle && programType && daysOfTheWeek.length !== 0 && newProgramTimes !== undefined) {
      createNewProgram2()
      if (autoLessonsCancelled) {
        setViewMidal(true)
      } else {

      }
    }
  }
  const createNewProgram = () => {

    const programData = {
      programTitle: programTitle,
      programType: programType,
      programCourseId: courseId,
      programTeacherId: teacher?.id
    };

    console.log('programData', programData)

    axios.post(`${globals.productionServerDomain}/createNewProgram/`, programData)
      .then(response => {
        console.log(response.data);
        setProgram(response.data.programId)
        // handle success
      })
      .catch(error => {
        console.log(error.response.data);
        // handle error
      });

  }
  const createNewProgram2 = async () => {
    let localProgramId
    const programData = {
      programTitle: programTitle,
      programType: programType,
      programCourseId: courseId,
      programTeacherId: teacher?.id
    };

    console.log('programData', programData)

    await axios.post(`${globals.productionServerDomain}/createNewProgram/`, programData)
      .then(response => {
        console.log(response.data);
        setProgram(response.data.programId)
        localProgramId = response.data.programId
        // handle success
      })
      .catch(error => {
        console.log(error.response.data);
        // handle error
      });

        // let numXExecutions = 0;
        // const a = newProgramTimes
        // const [hours, minutes] = a.split(":");
        // const today = new Date();
        // today.setHours(hours);
        // today.setMinutes(minutes);
        // today.setSeconds(0);
        // today.setMilliseconds(0);

        // while (numXExecutions < programLessCount) {
        //   for (let j = 0; j < daysOfTheWeek.length; j++) {
        //     if (today.getTime() > new Date().getTime()) {
        //       //с сегодня
        //       if (condition) {
                
        //       }
        //     } else {
        //       //с завтра
        //     }
        //     // if (b.includes(m[j])) {
        //     //   // console.log(Found a match: ${m[j]} equals a number in b);
        //     //   numXExecutions++;
        //     //   if (numXExecutions === n) {
        //     //     break;
        //     //   }
        //     //   // здесь можно добавить любое действие, которое должно быть выполнено при совпадении
        //     // }
        //   }
        //   if (numXExecutions === n) {
        //     break;
        //   }
        // }

        
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
              lessonCourseId: courseId,
              lessonTesis: "Тезис " + ((+count) + 1),
              lessonStartTime: currentDate,
              lessonProgramId: localProgramId,
            };
            // debugger
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
          await router.push(`/cabinet/teacher/${teacherUrl}/myPrograms?course=${courseId}`)
          window.location.reload()
        }
      // const { lessonTitle, lessonOrder, lessonCourseId, lessonTesis, lessonStartTime, lessonProgramId } = request.body

  }

  return <>
    <div className={styles.container}>
      <HeaderTeacher
        white={true}
        url={teacherUrl}
        teacher={teacher}
        isInMainPage={isInMainPage}
      />
       <GoToLessonWithTimerComponent isTeacher={true} url={router.query.url} />
      <div className={styles.modal} style={viewModal?{display: 'flex'}:{display: 'none'}}>
        <h1>Поздравляем, вы создали новую программу</h1>
        <p>Теперь вам нужно добавить уроки к программе занятий и вы можете приступать к обучению</p>
        <div className={styles.modal_button__wrapper}>
          <button onClick={() => router.push(`/cabinet/teacher/${teacherUrl}/createLesson?program=${program}`)}>Добавить уроки</button>
          <button onClick={() => router.push(`/cabinet/teacher/${teacherUrl}/myPrograms?course=${courseId}`)}>Спасибо, позже</button>
        </div>
      </div>
      <div className={styles.createProgram}>
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

            <button className={styles.form_button} onClick={() => {if (autoLessonsCancelled) {
              handleSubmit() 
            } else {
              handleSubmit2() 
            }}}>Создать программу</button>
          </div>
        </div>
      </div>
    </div>
  </>;
};

export default createProgram;
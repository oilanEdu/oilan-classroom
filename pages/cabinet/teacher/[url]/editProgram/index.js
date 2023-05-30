import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import styles from './index.module.css'
import globals from "../../../../../src/globals";
import axios from "axios";
import HeaderTeacher from "../../../../../src/components/new_HeaderTeacher/new_HeaderTeacher";
import { Image } from "react-bootstrap";
import GoToLessonWithTimerComponent from "../../../../../src/components/GoToLessonWithTimerComponent/GoToLessonWithTimerComponent";
import Footer from "../../../../../src/components/Footer/Footer";

const editProgramPage = () => {
  const router = useRouter();
  const programId = router.query.program
  const teacherUrl = router.query.url
  const [teacher, setTeacher] = useState([])
  const [program, setProgram] = useState([])
  const [baseDataLoaded, setBaseDataLoaded] = useState(false)
  const [title, setTitle] = useState('')
  const [type, setType] = useState('')
  const [programLessCount, setProgramLessCount] = useState('1 занятие')
  const [programSchedule, setProgramSchedule] = useState('Понедельник')
  const [programLessTime, setProgramLessTime] = useState('16:30 - 18:00')

  useEffect(() => {
    if (program?.title) {
      setTitle(program?.title)
    }
    if (program?.type) {
      setType(program?.type)
    }
  }, [program])

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
    let programInfo = await axios.post(`${globals.productionServerDomain}/getProgramById/`, { programId })
    setProgram(programInfo['data'][0])
    console.log('programInfo', programInfo['data'][0])
  }

  const handleSubmit = () => {
    editProgram()
  }


  const editProgram = async () => {
    const data = {
      programId,
      title, 
      type,
      courseId: program?.course_id, 
      teacherId: teacher?.id,
    };

    console.log(data);

    await axios({
      method: "put",
      url: `${globals.productionServerDomain}/updateNewProgram`,
      data: data,
    })
      .then(function (res) {
        alert("программа успешно изменена"); 
      })
      .catch((err) => {
        alert("Произошла ошибка"); 
      });
  };

  const deleteProgram = async (id) => {
    const data = {
      id
    }; 

    await axios({
      method: "delete",
      url: `${globals.productionServerDomain}/deleteProgram`,
      data: data,
    })
      .then(function (res) {
        router.push(`/cabinet/teacher/${teacherUrl}/myPrograms?course=${program?.course_id}`)
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
      <div className={styles.editProgram}>
        <div className={styles.stepTwo}>
          <div className={styles.row}>
            <h1>Изменение программы занятий</h1>
            <button onClick={() => {deleteProgram(programId)}}>Удалить программу</button>
          </div>
          <div className={styles.input_container}>
            <p>Название программы</p>
            <input value={title} placeholder="Для Алишера 9 класс" onChange={(e) => setTitle(e.target.value)} />
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
                  checked={type === 'group'}
                  onChange={(e) => setType(e.target.value)}
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
                  checked={type === 'individual'}
                  onChange={(e) => setType(e.target.value)}
                />
                <label htmlFor="individual"> Индивидуальная </label>
              </div>
            </div>
          </div>
          {/* <div className={styles.input_container}>
            <p>Количество занятий в неделю</p>
            <div className={styles.input_with_checkbox}>
              <select value="1">
                <option value="1">{programLessCount}</option>
              </select>
              <div className={styles.wrapperLabelCheckbox}>
                <input className={styles.custom_checkbox} id="skip_1" type="checkbox" />
                <label htmlFor="skip_1">Пропустить</label>
              </div>
            </div>
          </div>
          <div className={styles.input_container}>
            <p>Расписание занятий</p>
            <div className={styles.input_with_checkbox}>
              <input placeholder={programSchedule} />
              <div className={styles.wrapperLabelCheckbox}>
                <input className={styles.custom_checkbox} id="skip_2" type="checkbox" />
                <label htmlFor="skip_2">Пропустить</label>
              </div>
            </div>
          </div>
          <div className={styles.input_container}>
            <p>Время занятий</p>
            <input placeholder={programLessTime} />
          </div> */}
          <button className={styles.form_button} onClick={() => {handleSubmit()}}>Сохранить</button>
        </div>
      </div>
    </div>
    <Footer />
  </>;
};

export default editProgramPage;
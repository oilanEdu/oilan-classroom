import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import styles from './index.module.css'
import globals from "../../../../src/globals";
import axios from "axios";
import HeaderTeacher from "../../../../src/components/new_HeaderTeacher/new_HeaderTeacher";
import { Image } from "react-bootstrap";

const createProgram = () => {
  const router = useRouter();
  const courseId = router.query.course
  const teacherUrl = router.query.url
  const [teacher, setTeacher] = useState([])
  const [baseDataLoaded, setBaseDataLoaded] = useState(false)
  const [program, setProgram] = useState()
  const [programTitle, setProgramTitle] = useState('')
  const [programType, setProgramType] = useState('individual')
  const [programLessCount, setProgramLessCount] = useState('1 занятие')
  const [programSchedule, setProgramSchedule] = useState('Понедельник')
  const [programLessTime, setProgramLessTime] = useState('16:30 - 18:00')
  const [viewModal, setViewMidal] = useState(false)

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

  return <>
    <div className={styles.container}>
      <HeaderTeacher
        white={true}
        url={teacherUrl}
        teacher={teacher}
        isInMainPage={isInMainPage}
      />
      <div className={styles.modal} style={viewModal?{display: 'flex'}:{display: 'none'}}>
        <h1>Поздравляем, вы создали новую программу</h1>
        <p>Теперь вам нужно добавить уроки к программе занятий и вы можете приступать к обучению</p>
        <div>
          <button onClick={() => router.push(`/new_teacher_cabinet/${teacherUrl}/createLesson?program=${program}`)}>Добавить уроки</button>
          <button onClick={() => router.push(`/new_teacher_cabinet/${teacherUrl}/myPrograms?course=${courseId}`)}>Спасибо, позже</button>
        </div>
      </div>
      <div className={styles.createProgram}>
        <div className={styles.contentContainer}>
          <h1>Добавление программы занятий</h1>
          <p>Название программы</p>
          <input placeholder="Для Алишера 9 класс" onChange={(e) => setProgramTitle(e.target.value)} />
          <p>Выберите формат</p>
          <div>
            <label>
              <input
                type="radio"
                name="programType"
                value="group"
                checked={programType === 'group'}
                onChange={(e) => setProgramType(e.target.value)}
              />
              Групповая
            </label>
            <label>
              <input
                type="radio"
                name="programType"
                value="individual"
                checked={programType === 'individual'}
                onChange={(e) => setProgramType(e.target.value)}
              />
              Индивидуальная
            </label>
          </div>
          <p>Количество занятий в неделю</p>
          <div>
            <select value="1">
              <option value="1">{programLessCount}</option>
            </select>
            <input type="checkbox" />
            <span>Пропустить</span>
          </div>
          <p>Расписание занятий</p>
          <div>
            <input placeholder={programSchedule} />
            <input type="checkbox" />
            <span>Пропустить</span>
          </div>
          <p>Время занятий</p>
          <input placeholder={programLessTime} />
          <button onClick={() => {handleSubmit()}}>Создать программу</button>
        </div>
      </div>
    </div>
  </>;
};

export default createProgram;
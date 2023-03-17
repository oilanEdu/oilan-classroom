import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import styles from './index.module.css'
import globals from "../../../../src/globals";
import axios from "axios";
import HeaderTeacher from "../../../../src/components/new_HeaderTeacher/new_HeaderTeacher";
import { Image } from "react-bootstrap";

const createCourse = () => {
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
        router.push(`/new_teacher_cabinet/${teacherUrl}/myPrograms?course=${program?.course_id}`)
      })
      .catch((err) => {
        alert("Произошла ошибка"); 
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
      <div className={styles.editProgram}>
        <div className={styles.contentContainer}>
          <div className={styles.row}>
            <h1>Изменение программы занятий</h1>
            <button onClick={() => {deleteProgram(programId)}}>Удалить программу</button>
          </div>
          <p>Название программы</p>
          <input value={title} placeholder="Для Алишера 9 класс" onChange={(e) => setTitle(e.target.value)} />
          <p>Выберите формат</p>
          <div>
            <label>
              <input
                type="radio"
                name="programType"
                value="group"
                checked={type === 'group'}
                onChange={(e) => setType(e.target.value)}
              />
              Групповая
            </label>
            <label>
              <input
                type="radio"
                name="programType"
                value="individual"
                checked={type === 'individual'}
                onChange={(e) => setType(e.target.value)}
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
          <button onClick={() => {handleSubmit()}}>Сохранить</button>
        </div>
      </div>
    </div>
  </>;
};

export default createCourse;
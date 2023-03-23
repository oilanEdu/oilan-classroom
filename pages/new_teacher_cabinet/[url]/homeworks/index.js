import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import styles from './index.module.css'
import globals from "../../../../src/globals";
import axios from "axios";
import HeaderTeacher from "../../../../src/components/new_HeaderTeacher/new_HeaderTeacher";
import HomeworksByTeacher from "../../../../src/components/HomeworksByTeacher/HomeworksByTeacher";

const homeworks = () => {
  const router = useRouter();
  const teacherUrl = router.query.url
  const programId = router.query.program
  const [teacher, setTeacher] = useState([])
  const [baseDataLoaded, setBaseDataLoaded] = useState(false)
  const [lessons, setLessons] = useState([])
  const [answers, setAnswers] = useState([])
  const [lessonData, setLessonData] = useState([])
  const [students, setStudents] = useState([]);

  const isInMainPage = true;

  useEffect(() => {
    if (!baseDataLoaded || !teacher || !students) {
      loadBaseData()
      setBaseDataLoaded(true)
    }
    console.log('teacherUrl', teacherUrl)
    console.log('teacher', teacher)
    console.log('router', router)
    console.log('students', students)

  }, [teacherUrl, teacher, students]);

  const loadBaseData = async () => {
    let data = teacherUrl
    let getTeacherByUrl = await axios.post(`${globals.productionServerDomain}/getTeacherByUrl/` + data)
    const teacherIdLocal = getTeacherByUrl['data'][0]?.id
    console.log('teacherIdLocal', teacherIdLocal)
    setTeacher(getTeacherByUrl['data'][0])
    let megadata = await axios.post(`${globals.productionServerDomain}/getAnswersStatistics/`, { id: teacherIdLocal })
    console.log('megadata', megadata['data'])
    megadata['data'].forEach(answer => {
      answer.isExpanded = false
    })
    setAnswers(megadata['data'])
    let studentsData = await axios.post(`${globals.productionServerDomain}/getStudentsByTeacherId/`, { id: teacherIdLocal, sort: 'id' })
    console.log('studentsData', studentsData['data'])
    setStudents(studentsData['data'])
    let megadata2 = await axios.post(`${globals.productionServerDomain}/getAssignmentsByTeacherId/`, { id: teacherIdLocal })
    console.log('megadata2', megadata2['data'])
    let uniqueData = megadata2['data'].reduce((acc, curr) => {
      const key = curr.answer_id;
      if (!acc.map.has(key)) {
        acc.map.set(key, true);
        acc.data.push(curr);
      }
      return acc;
    }, { map: new Map(), data: [] }).data;

    console.log('uniqueData', uniqueData);
    setLessonData(uniqueData)
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}.${month}.${year}, ${hours}:${minutes}`;
  }

  const toggleAnswer = (index) => {
    setAnswers(prevAnswers => {
      const newAnswers = [...prevAnswers];
      newAnswers[index].isExpanded = !newAnswers[index].isExpanded;
      return newAnswers;
    });
  };

  return <>
    <div className={styles.container}>
      <HeaderTeacher
        white={true}
        url={teacherUrl}
        teacher={teacher}
        isInMainPage={isInMainPage}
      />
      <div className={styles.wrapperAll}>
        <div><h1>Домашние задания</h1></div>
        <div className={styles.wrapperAnswers}>
          {answers.map((answer, index) => (
            <>
              <div className={styles.wrapper_answersRow}>
                <div className={styles.answerRow}>
                  <div className={styles.lesson_title_wrapper}>
                    <p>{answer?.name} {answer?.surname}</p>
                    <p>Урок {answer?.lesson_orsder}: {answer?.lesson_title}</p>
                  </div>
                  <div className={styles.lesson_tesis}>
                    <p>Курс: {answer?.course_title}</p>
                    <p>Программа: {answer?.program_title}</p>
                    <p>Дата урока: {answer?.student_lesson_start_time ? formatDate(answer?.student_lesson_start_time) : answer?.lesson_start_time ? formatDate(answer?.lesson_start_time) : 'не назначено'}</p>
                  </div>
                  <div className={styles.answer_comment}>
                    <p>{answer?.student_comment ? 'Ученик оставил комментарий к заданию' : 'Студент не оставил комментарий'}</p>
                  </div>
                  <div className={styles.lesson_grade_wrapper}>
                    <p id={styles.lesson_grade} className={answer?.total_obtained_mark ? styles.green : styles.white}>
                      {answer?.total_obtained_mark ? `Оценка - ${answer?.average_mark} (${answer?.percent_completed}%)` : 'Ждет проверки'}
                    </p>
                  </div>
                </div>
                <button className={styles.plusButton} onClick={() => toggleAnswer(index)}>{answer.isExpanded ? "-" : "+"}</button>
              </div>
              {answer.isExpanded && (
                <div className={styles.answerText}>
                  {lessonData.map((LD, i) => {
                    console.log('LD', LD)
                    console.log('answer', answer)
                    return (
                      <div key={i}>
                        {(LD?.lesson_id == answer?.lesson_id && LD?.student_id == answer?.student_id) ?
                          <>
                            {answer?.student_id} : {LD?.student_id} - {LD?.student_name}
                            <div>
                              <div className={styles.lesson_work}
                                data-index={i}
                              >
                                Задание {LD?.exercise_order}
                              </div>
                            </div>
                          </>
                          :
                          <></>
                        }
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    </div>
  </>;
};

export default homeworks;
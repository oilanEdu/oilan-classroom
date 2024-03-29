import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./NewStudentCourseStatics.module.css";
import axios from "axios";
import globals from "../../globals";
import { PieChart, Pie, Sector, Cell } from "recharts";
import GoToLessonWithTimer from "../GoToLessonWithTimer/GoToLessonWithTimer";
import GoToLessonWithTimerComponent from "../GoToLessonWithTimerComponent/GoToLessonWithTimerComponent";

const NewStudentCourseStatics = ({ programDesc, student, lesson, lessons, scores, nickname, courseId, courseUrl }) => {
  const [days, setDays] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [total, setTotal] = useState(0);
  const [lotalLesson, setTotalLesson] = useState(0);
  const [lessonScores, setLessonScores] = useState([]);
  const [doneLessons, setDoneLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(lesson)
  const [loadedData, setLoadedData] = useState(false)
  const [closerLesson, setCloserLesson] = useState(lesson)
  const router = useRouter();
  const [disableButton, setDisableButton] = useState(true)

  const [lessonIsGoing, setLessonIsGoing] = useState(false)

  const [currentCourse, setCurrentCourse] = useState()

  let baseMark = 0;
  let count = 0;
  useEffect(() => {
    console.log(closerLesson, "closerLesson");
  }, [closerLesson])

  const updateTimer = () => {
    const future = Date.parse(closerLesson?.personal_time);
    const now = new Date();
    const diff = future - now;

    const y = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor(diff / (1000 * 60));
    const s = Math.floor(diff / 1000);

    setDays(d - y * 365);
    setHours(h - d * 24);
    setMinutes(m - h * 60);
    setSeconds(s - m * 60);
  };

  useEffect(() => {
    if (lessonIsGoing) {
      setDisableButton(false)
    } else {
      if ((hours * 60 + minutes) * 60 + seconds >= 600 && hours != NaN && minutes != NaN && seconds != NaN) {
        setDisableButton(true)
      }
      if ((hours * 60 + minutes) * 60 + seconds < 600 && hours != NaN && minutes != NaN && seconds != NaN) {
        setDisableButton(false)
      }
    }
  }, [seconds])

  // setInterval(() => { updateTimer() }, 1000);
  useEffect(() => {
    const interval = setInterval(() => {
      // Ваш код, который должен выполняться с определенным интервалом
      if (closerLesson.length > 0 || closerLesson != undefined) {
        updateTimer() 
      }
    }, 1000); // Интервал в миллисекундах (здесь 1000 миллисекунд = 1 секунда)

    return () => {
      clearInterval(interval); // Очистка интервала при размонтировании компонента
    };
  }, []);

  const overalScores = () => {
    lessons.forEach(lesson => {
      // baseMark += lesson.score
      if (+lesson.all_exer !== 0 && +lesson.all_exer === +lesson.done_exer) {
        baseMark += lesson.score
        count += 1
      };
      console.log(baseMark);
      setTotal(Math.ceil(baseMark / count));
      setLoadedData(true)
      let currentDate = new Date().toLocaleDateString()
      let lessonFactDate
      if (lesson.personal_time) {
        lessonFactDate = new Date(lesson.personal_time)
      } else {
        lessonFactDate = new Date(lesson.start_time)
      }
      lesson.fact_date = lessonFactDate
      // let dateStr = new Date(lesson.start_time);
      let closerDate
      let diff = 604800000
      console.log('currentDate', Date.parse(new Date(lessonFactDate)) - Date.parse(new Date()))
      if (Date.parse(new Date(lessonFactDate)) > Date.parse(new Date()) && (Date.parse(new Date(lessonFactDate) - Date.parse(new Date())) < diff) && (Date.parse(new Date(lesson.fact_date)) < Date.parse(new Date(closerLesson.fact_date))) && (closerLesson)) {
        console.log('check', 1)
        diff = Date.parse(new Date()) - Date.parse(new Date(lesson.fact_date))
        closerDate = lessonFactDate
        // setCloserLesson(lesson) 
      } else {
        // setCloserLesson(lesson) 
      }
    })
    let lessonsForNearestDate = lessons.filter(el => (new Date() - new Date(el.personal_time).getTime() < 0))
    var temp = lessonsForNearestDate.map(d => Math.abs(new Date() - new Date(d.personal_time ? d.personal_time : d.start_time).getTime()));
    // var withoutNan = temp.filter(function(n) { return !isNaN(n)}) 
    var idx = temp.indexOf(Math.min(...temp));
    let closerLessonLocal = lessonsForNearestDate[idx];

    let lessonIsGoingHandler = lessons.find(el => new Date().getTime() - new Date(el.personal_time ? el.personal_time : el.start_time).getTime() <= 3600000)
    setCloserLesson(lessonIsGoingHandler ? lessonIsGoingHandler : closerLessonLocal)
    setLessonIsGoing(lessonIsGoingHandler ? true : false)
    console.log('TOTAL', baseMark, total)
    console.log('CloserLesson', closerLesson)
    console.log('lessons', lessons)
    lessons.map(el => console.log(new Date().getTime() - new Date(el.personal_time ? el.personal_time : el.start_time).getTime(), "lessons.map"))
    console.log();
  };

  const totalLesson = () => {
    const total = scores.reduce((ttl, score) => {
      if (lesson.id === score.lesson_id) {
        setLessonScores(prevState => {
          return [
            ...prevState,
            score
          ]
        });
        return ttl + score.teacher_mark;
      } else {
        return ttl + 0;
      };
    }, 0);
    setTotalLesson(total);
  };

  const doneLessonsHandler = () => {
    setDoneLessons([]);
    lessons.forEach(lesson => {
      console.log(lesson);
      if (+lesson.all_exer !== 0 && +lesson.all_exer === +lesson.done_exer) {
        setDoneLessons(prevState => {
          return [
            ...prevState,
            lesson
          ]
        });
      }
    });
  };

  // console.log(lessons);

  useEffect(() => {
    overalScores();
    if (!closerLesson) {
      overalScores();
    }
    totalLesson();
    doneLessonsHandler();
    console.log('TOTAL2', baseMark, total);
    console.log('DL', doneLessons)
  }, []);

  const startLessonLink = async (translationLink) => {
    console.log('proverkha1')
    const role = 'student'
    const redirectUrl = `/lesson?room=${encodeURIComponent(translationLink)}&role=${role}&id=${student[0].id}`
    console.log(student);

    await router.push(redirectUrl)
  }

  const startNewLesson = async () => {
    console.log('proverkha2')
    let alphabet = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789";
    let roomKey = "";
    while (roomKey.length < 12) {
      roomKey += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    console.log(roomKey);
    if (closerLesson.personal_time) {
      let data = {
        lessonId: closerLesson.id,
        lessonKey: roomKey,
        studentId: closerLesson.student_id
      }
      await axios({
        method: "put",
        url: `${globals.productionServerDomain}/createPersonalRoom`,
        data: data,
      })
        .then(function (res) {
          console.log('DATA', data)
          startLessonLink(roomKey)
        })
        .catch((err) => {
          alert("Произошла ошибка");
        });
    } else {
      let data = {
        lessonId: closerLesson.id,
        lessonKey: roomKey
      }
      await axios({
        method: "put",
        url: `${globals.productionServerDomain}/createDefaultRoom`,
        data: data,
      })
        .then(function (res) {
          console.log('DATA', data)
          startLessonLink(roomKey)
        })
        .catch((err) => {
          alert("Произошла ошибка");
        });
    }
  }

  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  useEffect(() => {
    console.log(width, "width");
  }, [width])

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [coursesOfStudent, setCoursesOfStudent] = useState([])
  const getStudentCoursesAndPrograms = async () => {
    const response = await axios.get(`${globals.productionServerDomain}/getAllCoursesAndProgramsOfStudent?studentId=${student[0].id}`)
    const allCoursesOfStudent = response.data
    // let massiveOfUrls = []
    // for (let index = 0; index < allCoursesOfStudent.length; index++) {
    //   const element = allCoursesOfStudent[index];
    //   const data = {
    //     courseId: element.course_id
    //   }
    //   let result = await axios.post(`${globals.productionServerDomain}/getCourseById`, data)
    //   massiveOfUrls.push({ url: result.data[0].url, programId: element.program_id })
    // }
    // massiveOfUrls
    setCoursesOfStudent(allCoursesOfStudent)
    setCurrentCourse(allCoursesOfStudent.find(el => el.url === courseUrl && el.program_id === (+router.query.program)))
  }
  useEffect(() => {
    if (student != undefined) {
      getStudentCoursesAndPrograms()
    }
  }, [student])

  const changeCurrentCourseAndProgram = async (coureMiddleWareId) => {
    await router.push(`/cabinet/student/${student[0]?.nickname}/course/${coursesOfStudent.find(el => el.id === (+coureMiddleWareId))?.url}?program=${coursesOfStudent.find(el => el.id === (+coureMiddleWareId))?.program_id}`);
    window.location.reload()
  }

  return <div className={styles.container}>
    <div className={styles.yourCourses}>
    <p>Ваши курсы:</p>
    <select value={currentCourse?.id} onChange={(e) => {
      setCurrentCourse(e.target.value)
      changeCurrentCourseAndProgram(e.target.value)
      }}>
      {coursesOfStudent?.map(el => <option value={el.id}>Курс - {el.courseTitle}, программа - {el.programTitle}</option>)}
    </select>
    </div>
    <GoToLessonWithTimerComponent isTeacher={false} url={student[0].nickname} nickname={nickname} courseUrl={courseUrl} />
    <div className={styles.course_container}>
      <div className={styles.course_container_1}>
        <h2>{student[0]?.title}</h2>
        <p>{programDesc ? programDesc : student[0]?.description}</p>

        <p className={styles.prepod}>Преподаватель курса: {student[0]?.teach_surname} {student[0]?.teach_name}</p>
        {closerLesson ? <p>Занятие №{closerLesson?.number} {closerLesson?.title}</p> : ''}
        <div>
          <button
            className={styles.goToLessonButton}
            disabled={disableButton}
            onClick={() => {
              (closerLesson.personal_lesson_link || closerLesson.default_lesson_link) ?
                startLessonLink(closerLesson.personal_lesson_link ? closerLesson.personal_lesson_link : closerLesson.default_lesson_link) :
                startNewLesson()
            }}
          >Присоединиться к уроку</button>
        </div>
      </div>
      <div>
        <PieChart width={width <= 480 ? 350 : 400} height={400}>
          <text className={styles.pie_text_score} x={width <= 480 ? 173 : 208} y={170} textAnchor="middle" dominantBaseline="middle">
            {isNaN(total) ? 0 : total}
          </text>
          <text className={styles.pie_text} x={width <= 480 ? 173 : 208} y={220} textAnchor="middle" dominantBaseline="middle">
            Общая оценка
          </text>
          <text className={styles.pie_text} x={width <= 480 ? 173 : 208} y={260} textAnchor="middle" dominantBaseline="middle">
            за курс
          </text>
          <Pie
            data={lessons}
            cx={width <= 480 ? 165 : 200}
            cy={200}
            innerRadius={140}
            outerRadius={width <= 480 ? 170 : 180}
            fill="#CAE3FF"
            paddingAngle={1}
            dataKey="course_id"
          >
            {doneLessons.map((score, index, id) => (
              <Cell
                onClick={() => {
                  console.log('UROK', id)
                  console.log('what', score, index, id)
                  setSelectedLesson(score)
                  console.log('selectedLesson', selectedLesson)
                }
                }
                key={`cell-${index}`}
                fill={+score.score === 0 ? "#CAE3FF" : +score.score < 50 ? "#EA6756" : +score.score < 80 ? "#F8D576" : "#74C87D"}
                style={{ border: "1px solid" }}
                stroke={selectedLesson === score ? '#4299FF' : ""}
                type='monotone'
              />
            ))}
          </Pie>
        </PieChart>
        <div>№ {selectedLesson !== lesson ? selectedLesson.lesson_order : lesson.lesson_order}. {selectedLesson !== lesson ? selectedLesson.title : lesson.title}</div>
        <div style={{
          width: width <= 480 ? "auto" : "380px",
          height: "22px",
          border: "1px solid #CAE3FF",
          background: "#fff",
          borderRadius: "4px"
        }}>
          <div
            style={{
              width: `${selectedLesson !== lesson ? selectedLesson.score : lesson.score}%`,
              height: "20px",
              background: +selectedLesson.score === 0
                ? "#CAE3FF"
                : +selectedLesson.score < 50
                  ? "#EA6756"
                  : +selectedLesson.score < 80
                    ? "#F8D576" : "#74C87D",
              borderRadius: "4px 0 0 4px"
            }}
          >
          </div>
        </div>
      </div>
    </div>
    <div className={styles.course_success_wrapper}>
      <h5>Прохождение курса</h5>
      <div className={styles.course_success}>
        {lessons.map(lesson => {
          return <>
            <div className={styles.lesson_complete_wrapper}>
              <div className={styles.lesson_complete}>
                <span className={+lesson.score > 0 ? styles.lesson_item_done : styles.lesson_item}>{lesson.lesson_order}</span>
              </div>
              {/* <p className={styles.lesson_date}>
              {+lesson.score > 0 ? "Пройден" : lesson.personal_time ? new Date(lesson.personal_time).toLocaleDateString() : new Date(lesson.start_time).toLocaleDateString()}
              </p> */}
                      <p className={styles.lesson_date}>
                        {lesson.personal_time ? new Date(lesson.personal_time).toLocaleDateString() : new Date(lesson.start_time).toLocaleDateString()}
                      </p>
                      <p>{new Date(lesson.personal_time ? lesson.personal_time : lesson.start_time).getHours().toString().padStart(2, "0")}:{new Date(lesson.personal_time ? lesson.personal_time : lesson.start_time).getMinutes().toString().padStart(2, "0")}-{(new Date(lesson.personal_time ? lesson.personal_time : lesson.start_time).getHours() + 1).toString().padStart(2, "0")}:{new Date(lesson.personal_time ? lesson.personal_time : lesson.start_time).getMinutes().toString().padStart(2, "0")} </p>

            </div>
          </>
        })}
      </div>
    </div>
  </div>
};

export default NewStudentCourseStatics;
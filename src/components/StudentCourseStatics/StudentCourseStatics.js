import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./StudentCourseStatics.module.css";
import { PieChart, Pie, Sector, Cell } from "recharts";

const StudentCourseStatic = ({student, lesson, lessons, scores}) => {
  // console.log('stat data', student, lesson, lessons, scores)
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
  let baseMark = 0;
  let count = 0;

  const updateTimer = () => {
    const future = Date.parse(closerLesson.start_time);
    const now = new Date();
    const diff = future - now;
    
    const y = Math.floor( diff / (1000*60*60*24*365) );
    const d  = Math.floor( diff / (1000*60*60*24) );
    const h = Math.floor( diff / (1000*60*60) );
    const m  = Math.floor( diff / (1000*60) );
    const s  = Math.floor( diff / 1000 );

    // const hour = (h - d  * 24) + (days * 24);
    
    setDays(d  - y * 365);
    setHours(h - d  * 24);
    setMinutes(m  - h * 60);
    setSeconds(s  - m  * 60);
  };

  setInterval(() => {updateTimer()}, 1000);

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
              if (lesson.personal_time){
                lessonFactDate = new Date(lesson.personal_time)
              }else{
                lessonFactDate = new Date(lesson.start_time) 
              }
              lesson.fact_date = lessonFactDate
              // let dateStr = new Date(lesson.start_time);
              let closerDate
              let diff = 604800000  
              console.log('currentDate', Date.parse(new Date(lessonFactDate)) - Date.parse(new Date()))
              if (Date.parse(new Date(lessonFactDate)) > Date.parse(new Date()) && (Date.parse(new Date(lessonFactDate) - Date.parse(new Date())) < diff) && (Date.parse(new Date(lesson.fact_date)) < Date.parse(new Date(closerLesson.fact_date))) && (closerLesson)){
                  console.log('check', 1)
                  diff = Date.parse(new Date()) - Date.parse(new Date(lesson.fact_date)) 
                  closerDate = lessonFactDate
                  setCloserLesson(lesson) 
                }else{
                  setCloserLesson(lesson) 
                }
    })
    console.log('TOTAL', baseMark, total)
    console.log('CloserLesson', closerLesson)
    console.log('lessons', lessons)
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
    if (!closerLesson){
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
    const redirectUrl = `/lesson?room=${encodeURIComponent(translationLink)}&role=${role}`
        
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
        if (closerLesson.personal_time){
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
        }else{
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
  
  return <div className={styles.container}>     
    <div className={styles.next_lesson}>
      <img src="https://realibi.kz/file/498086.png"/>
      <div className={styles.next_lesson_content}>
        <div>
          <p>Следующие занятие через {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')} часов</p>
          <p>Занятие №{closerLesson.number} {closerLesson.title}</p>
        </div>
        <button
          onClick={() => {
            (closerLesson.personal_lesson_link || closerLesson.default_lesson_link)?
              startLessonLink(closerLesson.personal_lesson_link?closerLesson.personal_lesson_link:closerLesson.default_lesson_link):
              startNewLesson() 
          }}
        >Перейти к занятию</button>
      </div>
    </div>
    <div className={styles.course_container}>
      <div>
        <p>Онлайн-курс</p>
        <h2>{student[0]?.title}</h2>
        <p>{student[0]?.description}</p>

        <h2>Преподаватель курса</h2>
        
        <p>{student[0]?.teach_surname} {student[0]?.teach_name}</p>
        <p>Занятие №{closerLesson.number} {closerLesson.title}</p>
        <div>
          <button
          onClick={() => {
            (closerLesson.personal_lesson_link || closerLesson.default_lesson_link)?
              startLessonLink(closerLesson.personal_lesson_link?closerLesson.personal_lesson_link:closerLesson.default_lesson_link):
              startNewLesson() 
          }}
          >Перейти к занятию</button>
        </div>
      </div>
      <div>
        <PieChart width={400} height={400}>
          <text className={styles.pie_text_score} x={208} y={170} textAnchor="middle" dominantBaseline="middle">
            {total}
          </text>
          <text className={styles.pie_text} x={208} y={220} textAnchor="middle" dominantBaseline="middle">
            Общая оценка
          </text>
          <text className={styles.pie_text} x={208} y={260} textAnchor="middle" dominantBaseline="middle">
            за курс
          </text>
          <Pie
            data={lessons}
            cx={200}
            cy={200}
            innerRadius={140}
            outerRadius={180}
            fill="#CAE3FF"
            paddingAngle={1}
            dataKey="course_id"
          >
            {doneLessons.map((score, index, id) => (
              <Cell 
                onClick={() => {
                  console.log('UROK', id)
                  console.log('what', score, index, id)
                  console.log("score", score);
                  setSelectedLesson(score)
                  console.log('selectedLesson', selectedLesson)
                  }
                }
                key={`cell-${index}`} 
                fill={+score.score === 0 ? "#CAE3FF" : +score.score < 50 ? "#EA6756" : +score.score < 80 ? "#F8D576" : "#74C87D"} 
                style={{border: "1px solid"}}
                stroke={selectedLesson === score ? '#4299FF' : ""}
                type='monotone'
              />
            ))}
          </Pie>
        </PieChart>
        <div>№ {selectedLesson !== lesson?selectedLesson.lesson_order:lesson.lesson_order}. {selectedLesson !== lesson?selectedLesson.title:lesson.title}</div> 
        <div style={{
          width: "380px",
          height: "22px",
          border: "1px solid #CAE3FF",
          background: "#fff",
          borderRadius: "4px"
        }}>
          <div
            style={{
              width: `${selectedLesson !== lesson?selectedLesson.score:lesson.score}%`,
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
  </div> 
};

export default StudentCourseStatic;
import { useEffect, useState } from "react";
import styles from "./StudentCourseStatics.module.css";
import { PieChart, Pie, Sector, Cell } from "recharts";
import GoToLessonWithTimer from "../GoToLessonWithTimer/GoToLessonWithTimer";
import GoToLessonWithTimerComponent from "../GoToLessonWithTimerComponent/GoToLessonWithTimerComponent";

const COLORS = ["#74C87D"];

const StudentCourseStatic = ({student, lesson, lessons, scores, nickname, courseId}) => {
  // console.log('stat data', student, lesson, lessons, scores)
  const [total, setTotal] = useState(0);
  const [lotalLesson, setTotalLesson] = useState(0);
  const [lessonScores, setLessonScores] = useState([]);
  const [doneLessons, setDoneLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(lesson)
  const [loadedData, setLoadedData] = useState(false)
  const [closerLesson, setCloserLesson] = useState(lesson)
  let baseMark = 0   
  useEffect(() => {
    console.log(closerLesson, "closerLesson");
  }, [closerLesson])

  const overalScores = () => {
    lessons.forEach(lesson => {
      baseMark += lesson.score 
      setTotal(baseMark);
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
      if (+lesson.score > 0) {
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
  
  
  return <div className={styles.container}>     
    <GoToLessonWithTimerComponent isTeacher={false} url={student.nickname} student={student} lesson={lesson} lessons={lessons} scores={scores} nickname={nickname} courseId={courseId}/>
    <div className={styles.course_container}>
      <div>
        <p>Онлайн-курс</p>
        <h2>{student[0]?.title}</h2>
        <p>{student[0]?.description}</p>

        <h2>Преподаватель курса</h2>
        
        <p>{student[0]?.teach_surname} {student[0]?.teach_name}</p>
        <p>Занятие №{closerLesson.lesson_order} {closerLesson.title}</p>
        <div>
          <button>Перейти к занятию</button>
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
                  setSelectedLesson(score)
                  console.log('selectedLesson', selectedLesson)
                  }
                }
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
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
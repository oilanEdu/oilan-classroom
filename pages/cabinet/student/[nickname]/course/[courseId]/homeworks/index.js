import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import globals from "../../../../../../../src/globals";
import axios from "axios";
import HeaderStudent from "../../../../../../../src/components/HeaderStudent/HeaderStudent";
import Footer from "../../../../../../../src/components/Footer/Footer";
import StudentHomeworks from "../../../../../../../src/components/StudentHomeworks/StudentHomeworks";
import GoToLessonWithTimerComponent from "../../../../../../../src/components/GoToLessonWithTimerComponent/GoToLessonWithTimerComponent";

const Homeworks = (props) => { 
  const router = useRouter();

  const [ courseId, setCourseId ] = useState(router.query.courseId);
  const [ nickname, setNickname ] = useState(router.query.nickname);
  const [ student, setStudent ] = useState([]);
  const [ lesson, setLesson ] = useState('');
  const [ lessons, setLessons ] = useState([]);
  const [ scores, setScores ] = useState([]);
  const [ exercises, setExercises ] = useState([]);
  

  const fetchData = async () => {
    console.log('hi', router.query.courseId) 
    const response = await axios.get(`${globals.productionServerDomain}/getStudentCourseInfo?student_nick=${router.query.nickname}&couse_id=${router.query.courseId}`).then(async (res) => {
      setStudent(res.data[0]);
      await axios.get(`${globals.productionServerDomain}/getLessonInfo?couse_id=${router.query.courseId}&program_id=${res.data[0].program_id}&student_id=${res.data[0].id}`).then(async (res2) => {
        setLesson(res2.data[0]);
        setLessons(res2.data);

        await axios.get(`${globals.productionServerDomain}/getLessonExercises?lesson_id=${res2.data[0].id}&student_id=${res.data[0].id}`).then(res3 => {
          setExercises(res3.data);
        });
      });
    });

    const scoresForAnswers = await axios.get(`${globals.productionServerDomain}/getStudentScores?student_nick=${router.query.nickname}&couse_id=${router.query.courseId}`);

    await setScores(scoresForAnswers.data);
  };

  useEffect(() => {
    console.log(router);
    console.log('hi', courseId, nickname) 
    fetchData();
  }, []);

  console.log(student);
  console.log(lesson);
  console.log(lessons);
  console.log(scores);
  console.log(exercises);
  
  return <>
    <HeaderStudent white={true} name={student?.name} surname={student[0]?.surname} />
    <div style={{padding: "82px 120px", backgroundColor: "#F1FAFF"}}>
    <GoToLessonWithTimerComponent isTeacher={false} url={student.nickname} nickname={nickname} courseId={courseId}/>
      {lessons.map((lesson) => {
        return <StudentHomeworks lesson={lesson} student={student.id}/>
      })}
    </div>
    <Footer />
  </>
};

Homeworks.getInitialProps = async (ctx) => {
    if(ctx.query.courseId !== undefined && ctx.query.nickname !== undefined) {
        return {
            courseId: ctx.query.courseId,
            nickname: ctx.query.nickname
        }
    }else{
        return {};
    }
}

export default Homeworks;
import { useRouter } from "next/router";
import globals from "../../../../../../src/globals";
import axios from "axios";
import { useEffect, useState } from "react";
import HeaderStudent from "../../../../../../src/components/HeaderStudent/HeaderStudent";
import Footer from "../../../../../../src/components/Footer/Footer";
import StudentCourseStatics from "../../../../../../src/components/StudentCourseStatics/StudentCourseStatics";
import StudentLessonsProgram from "../../../../../../src/components/StudentLessonsProgram/StudentLessonsProgram";

const StudentCourse = (props) => {

  const router = useRouter();
  const [courseId, setCourseId] = useState(router.query.courseId);
  const [nickname, setNickname] = useState(router.query.nickname);
  const [dataLoaded, setDataLoaded] = useState(false)
  const [ student, setStudent ] = useState([]);
  const [ lesson, setLesson ] = useState('');
  const [ lessons, setLessons ] = useState([]);
  const [ scores, setScores ] = useState([]);

  const isInMainPage = true

  const fetchData = async () => {
    const response = await axios.get(`${globals.productionServerDomain}/getStudentCourseInfo?student_nick=${nickname}&couse_id=${courseId}`).then(async (res) => {
      setStudent(res.data);
      await axios.get(`${globals.productionServerDomain}/getLessonInfo?couse_id=${courseId}&program_id=${res.data[0].program_id}&student_id=${res.data[0].id}`).then(res => {
        setLesson(res.data[0]);
        setLessons(res.data);
        setDataLoaded(true)
      });
    });

    // const lessons = await axios.get(`${globals.productionServerDomain}/getLessonInfo?couse_id=${router.query.courseId}&program_id=${programId}`);
    const scoresForAnswers = await axios.get(`${globals.productionServerDomain}/getStudentScores?student_nick=${nickname}&couse_id=${courseId}`);

    // await setStudent(response.data);
    // await setLesson(lessons.data[0]);
    // await setLessons(lessons.data);
    await setScores(scoresForAnswers.data); 
  };

  useEffect(() => {
    // fetchData()
    if (!dataLoaded || !student || !lessons || !lesson || !scores){
      fetchData()
    };
  }, []);

  console.log('student', student);
  console.log('lessons!!!', lessons);
  console.log('lesson', lesson);
  console.log('scores', scores);

  return <>
    <HeaderStudent white={true} name={student[0]?.name} surname={student[0]?.surname} />
    <div>
      {
        (!dataLoaded || !student || !lessons || !lesson || !scores)?
          (<></>):
          (
            <>
              <StudentCourseStatics student={student} lesson={lesson} lessons={lessons} scores={scores} />
              <StudentLessonsProgram courseId={courseId} nickname={nickname} lessons={lessons} />
            </>
          )
      }
      <Footer />
    </div>
  </>
};

StudentCourse.getInitialProps = async (ctx) => {
    if(ctx.query.courseId !== undefined && ctx.query.nickname !== undefined) {
        return {
            courseId: ctx.query.courseId,
            nickname: ctx.query.nickname
        }
    }else{
        return {};
    }
}

export default StudentCourse;

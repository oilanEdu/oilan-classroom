import { useRouter } from "next/router";
import globals from "../../../../../../../src/globals";
import axios from "axios";
import styles from './index.module.css'
import { useEffect, useState } from "react";
import NewHeaderStudent from "../../../../../../../src/components/NewHeaderStudent/NewHeaderStudent";
import Footer from "../../../../../../../src/components/Footer/Footer";
import NewStudentCourseStatics from "../../../../../../../src/components/NewStudentCourseStatics/NewStudentCourseStatics";
import NewStudentLessonsProgram from "../../../../../../../src/components/NewStudentLessonsProgram/NewStudentLessonsProgram";
import NewStudentHomeworks from "../../../../../../../src/components/NewStudentHomeworks/NewStudentHomeworks";

const StudentPrograms = (props) => {

  const router = useRouter();
  const [courseUrl, setCourseUrl] = useState(router.query.courseUrl);
  const [nickname, setNickname] = useState(router.query.nickname);
  const [programId, setProgramId] = useState(router.query.program);
  const [dataLoaded, setDataLoaded] = useState(false)
  const [student, setStudent] = useState([]);
  const [lesson, setLesson] = useState('');
  const [lessons, setLessons] = useState([]);
  const [scores, setScores] = useState([]);

  console.log(router);

  const isInMainPage = true

  const fetchData = async () => {
    const response = await axios.get(`${globals.productionServerDomain}/getStudentCourseInfo?student_nick=${nickname}&course_url=${courseUrl}`).then(async (res) => {
      let localStudent = res.data.filter(el => el.program_id === (+router.query.program))
      setStudent(localStudent[0]);
      console.log(res.data);
      console.log(res.data[0] !== undefined);
      if (localStudent.length !== 0) {
        await axios.get(`${globals.productionServerDomain}/getLessonInfo_v2?course_url=${courseUrl}&program_id=${programId == !undefined ? programId : localStudent[0]?.program_id}&student_id=${localStudent[0]?.id}`).then(async res => {
          let array = res.data
          // debugger 
          const uniqueLessons = array.filter((item, index, self) => 
          index === self.findIndex((t) => (
            t.id === item.id
          ))
          );
            debugger
          let programLessons = await axios.post(`${globals.productionServerDomain}/getLessonsByProgramId/` + programId)

          const newArray = [];
    
          uniqueLessons.forEach(element => {
            newArray.push(element);
          });
    
          programLessons['data'].forEach(element => {
            const found = newArray.some(el => el.id === element.id);
            if (!found) {
              newArray.push(element);
            }
          });
          debugger
          setLesson(newArray[0]);
          setLessons(newArray);
          setDataLoaded(true)
        });
      } else {
        return;
      }
    });
    const scoresForAnswers = await axios.get(`${globals.productionServerDomain}/getStudentScores?student_nick=${nickname}&course_url=${courseUrl}`);

    await setScores(scoresForAnswers.data);
  };

  useEffect(() => {
    if (!dataLoaded || !student || !lessons || !lesson || !scores) {
      fetchData()
    };
  }, []);

  console.log('student', student);
  console.log('lessons!!!', lessons);
  console.log('lesson', lesson);
  console.log('scores', scores);

  return <>
    <NewHeaderStudent white={true} name={student[0]?.name} surname={student[0]?.surname} courseUrl={courseUrl} nickname={nickname} programId={programId} />
    <div className={styles.WrapperAll}>
      <h2>Домашние задания</h2>
      {
        (!dataLoaded || !student || !lessons || !lesson || !scores) ?
          (<></>) :
          (
            <>
              {lessons.map((lesson, index) => {
                return <NewStudentHomeworks index={index} lesson={lesson} student={student.id} padding={"40px 120px"} />
              })}
            </>
          )
      }
      {/* <Footer /> */}
    </div>
    <Footer />
  </>
}

StudentPrograms.getInitialProps = async (ctx) => {
  if (ctx.query.courseUrl !== undefined && ctx.query.nickname !== undefined) {
    return {
      courseUrl: ctx.query.courseUrl,
      nickname: ctx.query.nickname,
      program: ctx.query.program
    }
  } else {
    return {};
  }
}

export default StudentPrograms;

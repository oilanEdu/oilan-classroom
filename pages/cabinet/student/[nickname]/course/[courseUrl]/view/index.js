import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import globals from "../../../../../../../src/globals";
import axios from "axios";
import HeaderStudent from "../../../../../../../src/components/HeaderStudent/HeaderStudent";
import LessonContain from "../../../../../../../src/components/LessonContain/LessonContain";
import LessonExercisesForStudent from "../../../../../../../src/components/LessonExercisesForStudent/LessonExercisesForStudent";
import Footer from "../../../../../../../src/components/Footer/Footer";

const CourseView = () => {
  const router = useRouter();

  const [ courseUrl, setCourseUrl ] = useState(router.query.courseUrl);
  const [ nickname, setNickname ] = useState(router.query.nickname);
  const [ student, setStudent ] = useState([]);
  const [ lesson, setLesson ] = useState('');
  const [ lessons, setLessons ] = useState([]);
  const [ scores, setScores ] = useState([]);
  const [ exercises, setExercises ] = useState([]);

  const fetchData = async () => {
    const response = await axios.get(`${globals.productionServerDomain}/getStudentCourseInfo?student_nick=${nickname}&couse_url=${courseUrl}`).then(async (res) => {
      setStudent(res.data[0]);
      
      if (res.data[0] !== undefined) {
        await axios.get(`${globals.productionServerDomain}/getLessonInfo?couse_url=${courseUrl}&program_id=${res.data[0]?.program_id}&student_id=${res.data[0]?.id}`).then(async (res2) => {
          setLesson(res2.data[0]);
          setLessons(res2.data);

          await axios.get(`${globals.productionServerDomain}/getLessonExercises?lesson_id=${res2.data[0].id}&student_id=${res.data[0]?.id}`).then(res3 => {
            setExercises(res3.data);
          });
        });
      }
    });

    const scoresForAnswers = await axios.get(`${globals.productionServerDomain}/getStudentScores?student_nick=${nickname}&couse_url=${courseUrl}`);

    await setScores(scoresForAnswers.data);
  };

  useEffect(() => {
    console.log(router);
    fetchData();
  }, []);

  console.log(student);
  console.log(lesson);
  console.log(lessons);
  console.log(scores);
  console.log(exercises);
  
  return <>
    <HeaderStudent white={true} name={student?.name} surname={student?.surname} />
    <div>
      <LessonContain student={student} lessons={lessons} />
      <LessonExercisesForStudent bg={"rgb(241, 250, 255)"} exercises={exercises}/>
    </div>
    <Footer />
  </>  
};

export default CourseView;
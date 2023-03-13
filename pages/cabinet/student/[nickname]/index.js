import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import styles from "./styles.module.css"
import globals from "../../../../src/globals";
import { PieChart, Pie, Sector, Cell } from "recharts";
import GoToLessonWithTimer from "../../../../src/components/GoToLessonWithTimer/GoToLessonWithTimer";
import GoToLessonWithTimerComponent from "../../../../src/components/GoToLessonWithTimerComponent/GoToLessonWithTimerComponent";

const StudentProfile = () => {
  // console.log('stat data', student, lesson, lessons, scores)
    
  const router = useRouter();
  const [courseUrl, setCourseUrl] = useState(router.query.courseUrl);
  const [nickname, setNickname] = useState(router.query.nickname);
  const [ student, setStudent ] = useState([]);

  console.log(router);

  const loadStudentProfileInfo = async () => {
    const studentUrl = nickname
    const data = { 
        studentUrl
      }
    // const getStudentInfo = await axios.post(`${globals.productionServerDomain}/getStudentByUrl` + data)
    let getStudent = await axios({
        method: "post",
        url: `${globals.productionServerDomain}/getStudentByUrl`,
        data: data,
      })
        .then(function (res) {
          if (res.data[0]){
            const studentInfo = res.data[0]
            console.log(studentInfo, "studentInfo");
            setStudent(studentInfo)
            // setStudentFIO(studentInfo.surname + ' ' + studentInfo.name + ' ' + studentInfo.patronymic)
            // setStudentEmail(studentInfo.email)
            // setStudentPhone(studentInfo.phone)
            // setStudentPassword()
            // setStudentLogin(studentInfo.nickname)
          }else{

          }
        })
        .catch((err) => {
          alert("Произошла ошибка");   
        });
}
useEffect(() => {
    loadStudentProfileInfo()
}, [])
  
    const [coursesOfStudent, setCoursesOfStudent] = useState([])
    const getStudentCoursesAndPrograms = async () => {
      const response = await axios.get(`${globals.productionServerDomain}/getAllCoursesAndProgramsOfStudent?studentId=${student.id}`)
      const allCoursesOfStudent = response.data
      let massiveOfUrls = []
      for (let index = 0; index < allCoursesOfStudent.length; index++) {
        const element = allCoursesOfStudent[index];
        const data = {
          courseId: element.course_id
        }
        let result = await axios.post(`${globals.productionServerDomain}/getCourseById`, data)
        massiveOfUrls.push({url: result.data[0].url, programId: element.program_id})
      } 
      massiveOfUrls
      // massiveOfUrls.filter((item, index) => item === index);
      // let test2 = [...new Set(massiveOfUrls)]
      setCoursesOfStudent(massiveOfUrls)  
  }
  useEffect(() => {
      if (student != undefined) {
          getStudentCoursesAndPrograms()
      }
  }, [student])
  // url={"oilan-classroom.com/cabinet/student/" + student?.nickname + "/course/" + program.course_url + "?program=" + program.program_id}

  return <div className={styles.container}>     
    <GoToLessonWithTimerComponent isTeacher={false} url={student?.nickname} nickname={nickname} courseUrl={courseUrl}/>
    <div>
        <h3>Ваши программы</h3>
        <div className={styles.linksToOtherPrograms}>
        {coursesOfStudent.map(el => <a href={"https://oilan-classroom.com/cabinet/student/" + student?.nickname + "/course/" + el.url + "?program=" + el.programId}>
          {"https://oilan-classroom.com/cabinet/student/" + student?.nickname + "/course/" + el.url + "?program=" + el.programId}
        </a>)}
      </div>
      </div>
  </div> 
};

StudentProfile.getInitialProps = async (ctx) => {
    debugger
    if(ctx.query.nickname !== undefined) {
        return {
            nickname: ctx.query.nickname,
        }
    }else{
        return {};
    }
}

export default StudentProfile;
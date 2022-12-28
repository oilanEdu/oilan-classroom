import axios from "axios";
import { useEffect, useState } from "react";
import styles from './CourseComment.module.css'
import globals from "../../globals";

function CourseComment(props) {
    const [student, setStudent] = useState()
    const [course, setCourse] = useState()

    useEffect(() => {
      if (props.comment != undefined) {
        console.log(props, "courseCommentProps");
        getData()  
      }
    }, [props.comment])
    useEffect(() => {
      console.log(new Date(), "studentstudentstudentstudentstudent");
    }, [student])
    useEffect(() => {
      console.log(course, "coursecoursecoursecourse");
    }, [course])

    const getData = async () => {
        let studentId = props.comment?.student_id 
        let data = {
            studentId,
        };
        let getStudent = await axios({
          method: "post",
          url: `${globals.productionServerDomain}/getStudentById`,
          data: data,
        })
          .then(function (res) {
            if (res.data[0]){
                setStudent(res.data[0])
                // console.log('EXE', res.data[0].status)
                // exercise.answer_status = res.data[0].status
                // exercise.teacher_comment = res.data[0].comment 
            }else{
                console.log('ответов нет')
                // setStudent()
            }
          })
          .catch((err) => {
            alert("Произошла ошибка");   
          });


        let courseId = props.comment?.course_id 
        let data2 = {
          courseId,
        };
        let getCourse = await axios({
          method: "post",
          url: `${globals.productionServerDomain}/getCourseById`,
          data: data2,
        })
          .then(function (res) {
            if (res.data[0]){
                setCourse(res.data[0])
                // console.log('EXE', res.data[0].status)
                // exercise.answer_status = res.data[0].status
                // exercise.teacher_comment = res.data[0].comment 
            }else{
                console.log('ответов нет')
                setCourse()
            }
          })
          .catch((err) => {
            alert("Произошла ошибка");   
          });
    }

    const [windowSize, setWindowSize] = useState(getWindowSize());
    useEffect(() => {
      function handleWindowResize() {
        setWindowSize(getWindowSize());
      }
  
      window.addEventListener('resize', handleWindowResize);
  
      return () => {
        window.removeEventListener('resize', handleWindowResize);
      };
    }, []);

  return (
            <div className={styles.comment}>
              {windowSize.innerWidth > 391 ? <div className={styles.wrapper1}>
                <img src={student?.img} className={styles.avatar}/>
                <div className={styles.wrapper2}>
                    <div className={styles.wrapper3}>
                        <p className={styles.name}>{student?.name} {student?.surname}</p>
                        <p className={styles.date}>{props.comment?.date}</p>
                    </div>
                    <div className={styles.wrapper4}>
                        <p className={styles.subAbout}>О курсе</p>
                        <p className={styles.about}> «{course?.title}»</p>
                    </div> 
                    <div className={styles.wrapper5}>
                        <p className={styles.rating}>Оценка - {props.comment?.rating},0</p>
                        <div className={styles.stars}>
                            <img src="https://realibi.kz/file/601212.png" className={styles.star}/>
                            <img src="https://realibi.kz/file/601212.png" className={styles.star}/>
                            <img src="https://realibi.kz/file/601212.png" className={styles.star}/>
                            <img src="https://realibi.kz/file/601212.png" className={styles.star}/>
                            <img src="https://realibi.kz/file/601212.png" className={styles.star}/>
                        </div>
                    </div>
                    <p className={styles.text}>
                        {props.comment?.text}
                    </p>
                </div>
            </div> : <div className={styles.wrapper1_1}>
              <div className={styles.wrapper1_2}>
                <img src={student?.img} className={styles.avatar}/>
                <div className={styles.wrapper2}>
                    <div className={styles.wrapper3}>
                        <p className={styles.name}>{student?.name} {student?.surname}</p>
                        <p className={styles.date}>{props.comment?.date}</p>
                    </div>
                    <div className={styles.wrapper4}>
                        <p className={styles.subAbout}>О курсе</p>
                        <p className={styles.about}> «{course?.title}»</p>
                    </div> 
                </div>
              </div>
              <div className={styles.wrapper1_3}>
              <div className={styles.wrapper5}>
                        <p className={styles.rating}>Оценка - {props.comment?.rating},0</p>
                        <div className={styles.stars}>
                            <img src="https://realibi.kz/file/601212.png" className={styles.star}/>
                            <img src="https://realibi.kz/file/601212.png" className={styles.star}/>
                            <img src="https://realibi.kz/file/601212.png" className={styles.star}/>
                            <img src="https://realibi.kz/file/601212.png" className={styles.star}/>
                            <img src="https://realibi.kz/file/601212.png" className={styles.star}/>
                        </div>
                    </div>
                    <p className={styles.text}>
                        {props.comment?.text}
                    </p>
              </div>
            </div>}

            </div>
  );
}

function getWindowSize() {
  const {innerWidth, innerHeight} = window;
  return {innerWidth, innerHeight};
}

export default CourseComment;

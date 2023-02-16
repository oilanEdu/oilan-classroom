import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import globals from "../../globals";
import GoToLessonWithTimer from "../GoToLessonWithTimer/GoToLessonWithTimer";

function GoToLessonWithTimerComponent({ isTeacher, url, nickname, courseUrl }) {
    const [showTimer, setShowTimer] = useState(false)
    const [teacher, setTeacher] = useState([])
    const [programs, setPrograms] = useState([])
    const [students, setStudents] = useState([])
    const [check, setCheck] = useState(0) 
    const [closerLesson, setCloserLesson] = useState([]) 
    const [days, setDays] = useState('');
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [dataLoaded, setDataLoaded] = useState(false)
    
    const [emptyProgramCourseId, setEmptyProgramCourseId] = useState(0)
    const [emptyProgramTeacherId, setEmptyProgramTeacherId] = useState(0)
    
    const [lessons, setLessons] = useState([''])
    const [showModalLesson, setShowModalLesson] = useState(false)
    const [studentForModal, setStudentForModal] = useState()

    const [showSort, setShowSort] = useState(false);
    const [sortType, setSortType] = useState("");
    

    const [currentPage, setCurrentPage] = useState(1);
    const [cardsPerPage] = useState(10);
    const indexOfLastPost = currentPage * cardsPerPage;
    const indexOfFirstPost = indexOfLastPost - cardsPerPage;
    const currentPosts = students?.slice(indexOfFirstPost, indexOfLastPost)
    const howManyPages = Math.ceil(students?.length/cardsPerPage)

    const isInMainPage = true

    const [idOfNearest, setIdOfNearest] = useState()
    const [lessonsForNearestDate, setLessonsForNearestDate] = useState([])
    useEffect(() => { 
      if (lessonsForNearestDate.length >= 1) {
        nearestDate(lessonsForNearestDate, Date.now()) 
      }
    }, [lessonsForNearestDate])
    useEffect(() => {

      if (idOfNearest != undefined && isTeacher == true) {

        let closerLessonLocal =  lessonsForNearestDate[idOfNearest];
        setCloserLesson(closerLessonLocal) 
      } 
      if (idOfNearest != undefined && isTeacher == false) {

        let closerLessonLocal =  lessonsForNearestDate[idOfNearest];
        setCloserLesson(closerLessonLocal) 
      }
    }, [idOfNearest])


    function nearestDate (dates, target) {
      // debugger
      // if (!target) {
      //   target = Date.now()
      // } else if (target instanceof Date) {
      //   target = target.getTime()
      // }
    
      // let nearest = Infinity
      // let winner = -1
      // lesson.personal_time ? lesson.personal_time : lesson.start_time
      // var smallest = Math.min.apply(null, arrayOfNumbers.filter(function(n) { return !isNaN(n); }));
      
      // var temp0 = dates.filter(el => (new Date() - new Date(el.personal_time).getTime() < 0))
      var temp = dates.map(d => Math.abs(new Date() - new Date(d.personal_time).getTime()));
      var withoutNan = temp.filter(function(n) { return !isNaN(n)}) 
      var idx = withoutNan.indexOf(Math.min(...withoutNan));
      

      setIdOfNearest(idx)  
      // dates.forEach(function (date, index) { 
      //   date = new Date(date.personal_time)
      //   // if (date instanceof Date) {
      //   //   date = date.getTime()
      //   //   debugger
      //   // }
      //   // let distance = Math.abs(date - target)
      //   // if (distance < nearest) {
      //   //   nearest = distance
      //   //   winner = index
      //   // }
      // })
      // console.log("winner", winner);
      // console.log("datesWinner", dates.index == winner);
      // // const found = array1.find(element => element > 10);
      // console.log("datesWinner2", dates.find(el => el.index == winner));
      // setWinnerIndex(Number(winner))
    }
    useEffect(() => {
      if (lessons.length > 1) { 
        // setCloserLesson(lessons[winnerIndex])

        setLessonsForNearestDate(lessons.filter(el => (new Date() - new Date(el.personal_time).getTime() < 0)))
        // nearestDate(lessons, Date.now())  
      }   

    }, [lessons])
    
    const updateTimer = () => {
        const future = Date.parse(isTeacher ? closerLesson.personal_time : closerLesson.fact_date);
        const now = new Date();
        const diff = future - now; 
          
        const y = Math.floor( diff / (1000*60*60*24*365) );
        const d  = Math.floor( diff / (1000*60*60*24) );
        const h = Math.floor( diff / (1000*60*60) );
        const m  = Math.floor( diff / (1000*60) );
        const s  = Math.floor( diff / 1000 );


        // const hour = (h - d  * 24) + (days * 24);
        
        setDays(d  - y * 365);
        setHours(h + d  * 24);
        setMinutes(m  - h * 60);
        setSeconds(s  - m  * 60);
      };

      const [count, setCount] = useState(0);
      //ниже 11 строк кода сделаны чтобы предотвратить конвулсьсии таймера. Автор кода - Ануар.
      const prevCountRefDays = useRef(0);
      const prevCountRefHours = useRef(0);
      const prevCountRefMinutes = useRef(0);
      const prevCountRefSeconds = useRef(0);
      useEffect(() => {
        //assign the ref's current value to the count Hook
        prevCountRefDays.current = days;
        prevCountRefHours.current = hours
        prevCountRefMinutes.current = minutes
        prevCountRefSeconds.current = seconds
      }, [seconds]); //run this code when the value of count changes

      
     
    const router = useRouter() 

    useEffect(() => {
        if (isTeacher === true) {

          // console.log('PROPS', props)

          loadTeacherData()          
        }   
    }, []) 
    
    setInterval(() => {updateTimer()}, 1000);  

    const loadStudentLessons = async (studentId, programId) => {
        const data = {
            studentId,
            programId
        };

        await axios({
            method: "post",
            url: `${globals.productionServerDomain}/getStudentLessonsByProgramId`,
            data: data,
        })
            .then(function (res) { 
                let lessons = res.data
                let lesson_number = 0
                res.data.forEach(lesson => {
                    lesson_number += 1
                    lesson.lesson_number = lesson_number
                })
                setLessons(lessons => [...lessons, ...res.data])
            })
            .catch((err) => {
                alert("Произошла ошибка");
            });

    }
    
    const loadTeacherData = async () => {
        let data = url
        let getTeacherByUrl = await axios.post(`${globals.productionServerDomain}/getTeacherByUrl/` + data)
        const teacherIdLocal = getTeacherByUrl['data'][0]?.id
        setEmptyProgramTeacherId(teacherIdLocal)
        let teacherCourses = await axios.post(`${globals.productionServerDomain}/getCoursesByTeacherId/` + teacherIdLocal)
          teacherCourses['data'].forEach(course => { 
            setEmptyProgramCourseId(course.id)
            }
           ); 
        let teacherPrograms = await axios.post(`${globals.productionServerDomain}/getProgramsByTeacherId/` + teacherIdLocal)
        let count = 0
          teacherPrograms['data'].forEach(program => {  
            count += 1 
            program.number = count
             setEmptyProgramCourseId(program.course_id)
            }
           ); 
        const dataStudents = {
            id: teacherIdLocal,
            sort: sortType
        }
        let teacherStudents = await axios.post(`${globals.productionServerDomain}/getStudentsByTeacherId/`, dataStudents)
        setTeacher(getTeacherByUrl['data'][0])
        setPrograms(teacherPrograms['data'])
        let lessonsOfAllStudents = []
        teacherStudents['data'].forEach(async student => {

        let diff = 604800000*7
            // loadStudentLessons(student.student_id, student.program_id) 
            let answersCount = 0 
            let studentCheck = 0
            let studentLessons = await axios.post(`${globals.productionServerDomain}/getStudentLessonsByProgramId/`, {studentId: student.student_id, programId: student.program_id}).then(res => {
                let lessons = res.data
                lessonsOfAllStudents.push(...lessons);
                // nearestDate(res.data, Date.now())
                // setLessons(lessons => [...lessons, ...res.data])
                res.data.forEach(async lesson => { 
                    // student.check = 0 
                    let currentDate = new Date().toLocaleDateString()
                    let lessonDate 
                    if (lesson.personal_time){
                        lesson.fact_time = lesson.personal_time
                        lessonDate = new Date(lesson.fact_time).toLocaleDateString()
                    }else{
                        lesson.fact_time = lesson.start_time
                        lessonDate = new Date(lesson.fact_time).toLocaleDateString()
                    }
                    let dateStr = new Date(lesson.personal_time ? lesson.personal_time : lesson.start_time);
                    let closerDate 
                    if ((Date.parse(new Date(lesson.personal_time ? lesson.personal_time : lesson.start_time)) > Date.parse(new Date())) && (Date.parse(new Date(lesson.personal_time ? lesson.personal_time : lesson.start_time)) - Date.parse(new Date()) < diff)){ 
                        closerDate = lessonDate
                        if (closerLesson){
                            if (closerDate < new Date(closerLesson.fact_time).toLocaleDateString()){
                                // setCloserLesson(lesson)
                            }
                        }else{
                            // setCloserLesson(lesson)
                        }
                        let curr_hours = dateStr.getHours();
                        let curr_minutes = dateStr.getMinutes();
                        student.lesson_date = lesson.fact_time
                        student.closer_date = closerDate 
                        student.curr_hours = curr_hours 
                        student.curr_minutes = curr_minutes 
 
                    }
                    // console.log(lesson)
                    let lessonExercises = await axios.post(`${globals.productionServerDomain}/getExercisesByLessonId/` + lesson.id).then(res => {
                        let exercises = res.data
                        if (exercises) {
                            exercises.forEach(async exercise => {
                                let studentId = student.student_id 
                                let exerciseId = exercise.id   
                                const data = {
                                  studentId, 
                                  exerciseId 
                                };
                                let exerciseAnswers = await axios({ 
                                  method: "post",
                                  url: `${globals.productionServerDomain}/getAnswersByStudExId`,
                                  data: data,
                                }).then(res =>{
                                    let answers = res.data
                                    answers.forEach(answer => {
                                        answersCount += 1 
                                    })
                                    if ((exercises.length > 0) && (exercises.length == answersCount)){
                                        student.check += 1 
                                        studentCheck += 1

                                        setCheck(student.check)
                                        student.check = studentCheck  
                                        student.progress = 100/student.lessons_count*student.check 
                                    }  
                                    else{ 

                                        // setCheck(0)
                                        // studentCheck = 0
                                        // student.check = 0
                                        // student.progress = 0
                                    }
                                })
                            }) 
                        }
                    })
                })   
            })
            setLessons(lessonsOfAllStudents)
            }
           );  
        

        setStudents(teacherStudents['data'])
        setDataLoaded(true) 

                // setCheckIsLoaded(true)
      }

    const createEmptyProgram = async () => { 
        const emptyProgramTitle = 'emptyProgram'
        const data = {
          emptyProgramTitle,
          emptyProgramCourseId,
          emptyProgramTeacherId, 
        }; 

        await axios({
          method: "post",
          url: `${globals.productionServerDomain}/createEmptyProgram`,
          data: data,
        })
          .then(function (res) {
            alert("Программа успешно создана"); 
          })
          .catch((err) => {
            alert("Произошла ошибка");
          });
      };

    const updateStudentProgram = async (studentId, courseId, programId) => { 
        const data = {
          studentId,
          courseId,
          programId
        }; 

        await axios({
          method: "put",
          url: `${globals.productionServerDomain}/updateStudentProgram`, 
          data: data,
        })
          .then(function (res) {
            alert("Программа успешно изменена"); 
          })
          .catch((err) => {
            alert("Произошла ошибка");
          });
      };

    const personalLink = async (studentId, prigramId) => {
        const redirectUrl = `${encodeURIComponent(url)}/homeworks?programId=${encodeURIComponent(prigramId)}&studentId=${encodeURIComponent(studentId)}`
        
        await router.push(redirectUrl)
    }

    const startLessonLink = async (translationLink) => {
        loadTeacherData()
        const role = 'teacher'
        const redirectUrl = `/lesson?room=${encodeURIComponent(translationLink)}&role=${role}`
        
        await router.push(redirectUrl)
    }

    const startLessonLinkStudent = async (translationLink) => {

      const role = 'student'
      const redirectUrl = `/lesson?room=${encodeURIComponent(translationLink)}&role=${role}`
          
      await router.push(redirectUrl)
    }

    const startNewLesson = async () => {
        let alphabet = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789";
        let roomKey = "";
        while (roomKey.length < 12) {
            roomKey += alphabet[Math.floor(Math.random() * alphabet.length)];
        }

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

                 startLessonLink(roomKey)
              })
              .catch((err) => {
                alert("Произошла ошибка");
              });
        }
    }

    const startNewLessonStudent = async () => {

      let alphabet = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789";
      let roomKey = "";
      while (roomKey.length < 12) {
          roomKey += alphabet[Math.floor(Math.random() * alphabet.length)];
      }

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

               startLessonLink(roomKey)
            })
            .catch((err) => {
              alert("Произошла ошибка");
            });
      }
  }

    const sortABC = async () => {
        const dataStudents = {
            id: emptyProgramTeacherId,
            sort: "oc_students.surname"
        }
        let teacherStudents = await axios.post(`${globals.productionServerDomain}/getStudentsByTeacherId/`,  dataStudents)
        setStudents(teacherStudents['data'])
    }

    const sortCourse = async () => {
        const dataStudents = {
            id: emptyProgramTeacherId,
            sort: "oc_programs.title"
        }
        let teacherStudents = await axios.post(`${globals.productionServerDomain}/getStudentsByTeacherId/`,  dataStudents)
        setStudents(teacherStudents['data'])
    };

    //STUDENT
    const [data2Loaded, setData2Loaded] = useState(false)
    const fetchData = async () => {

      const response = await axios.get(`${globals.productionServerDomain}/getStudentCourseInfo?student_nick=${nickname}&course_url=${courseUrl}`).then(async (res) => {
        await axios.get(`${globals.productionServerDomain}/getLessonInfo?course_url=${courseUrl}&program_id=${res.data[0]?.program_id}&student_id=${res.data[0]?.id}`).then(res => {
          setLessons(res.data);
          setData2Loaded(true)
        });
      });
    };
    useEffect(() => {
      // fetchData()
      if (isTeacher === false) {
        fetchData()  
      }
    }, []);

    const overalScores = () => {
      lessons.forEach(lesson => {
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

                if (Date.parse(new Date(lessonFactDate)) > Date.parse(new Date()) && (Date.parse(new Date(lessonFactDate) - Date.parse(new Date())) < diff) && (Date.parse(new Date(lessonFactDate)) < Date.parse(new Date(closerLesson.fact_date))) && (closerLesson)){
                    console.log('check', 1)
                    diff = Date.parse(new Date()) - Date.parse(new Date(lesson.fact_date)) 
                    closerDate = lessonFactDate
                    // setCloserLesson(lesson) 
                  }else{     
                    // setCloserLesson(lesson) 
                  }
      })

    };

    useEffect(() => {
      if (data2Loaded == true){
        overalScores();
      }
    }, [data2Loaded]);
    useEffect(() => {

    }, [lessons])
    useEffect(() => {

    }, [closerLesson])
    // useEffect(() => {
    //   if ((prevCountRefHours.current * 60 + prevCountRefMinutes.current) * 60 + prevCountRefSeconds.current < 3600) {
    //     setShowTimer(true)
    //     console.log("showTimer");
    //     console.log("timerIsTrue", (prevCountRefHours.current * 60 + prevCountRefMinutes.current) * 60 + prevCountRefSeconds.current < 3600);
    //   }
    // }, [])
    useEffect(() => {
      const interval = setInterval(() => {
        if ((prevCountRefHours.current * 60 + prevCountRefMinutes.current) * 60 + prevCountRefSeconds.current < 3600) {
          setShowTimer(true)
          
        } else {
          
        }
      }, 2000);
      return () => clearInterval(interval);
    }, []);
    
  return ( 
    (showTimer ?     
    <GoToLessonWithTimer 
      closerLesson={closerLesson}
      hours={hours ? hours : 0}
      minutes={minutes ? minutes : 0}
      seconds={seconds ? seconds : 0}
      isTeacher={isTeacher}
      startLessonLink={startLessonLink}
      startNewLesson={startNewLesson}
      loadTeacherData={loadTeacherData}
      prevCountRefDays={prevCountRefDays.current ? prevCountRefDays.current : 0}
      prevCountRefHours={prevCountRefHours.current ? prevCountRefHours.current : 0}
      prevCountRefMinutes={prevCountRefMinutes.current ? prevCountRefMinutes.current : 0}
      prevCountRefSeconds={prevCountRefSeconds.current ? prevCountRefSeconds.current : 0}
      startLessonLinkStudent={startLessonLinkStudent}
      startNewLessonStudent={startNewLessonStudent}
    />  : '')

  );
}

export default GoToLessonWithTimerComponent;

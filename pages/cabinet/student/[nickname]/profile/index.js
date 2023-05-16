import axios from "axios";
import { useRouter } from "next/router";
import React, {useEffect, useState, useRef} from "react";
import Footer from "../../../../../src/components/Footer/Footer";
import HeaderStudent from "../../../../../src/components/NewHeaderStudent/NewHeaderStudent";
import HeaderTeacher from "../../../../../src/components/new_HeaderTeacher/new_HeaderTeacher";
import globals from "../../../../../src/globals";
import styles from './styles.module.css'
///getTeacherByUrl/:url
// фамилия имя отчество, почта, телефон, пароль, о себе, навыки, опыт работы, никнеймн-логин лучше логин
function StudentProfile(props) {
    const [files, setFiles] = useState([]);
    const [fileName, setFileName] = useState()
    const [link, setLink] = useState()
    const [student, setStudent] = useState()
    const [studentFIO, setStudentFIO] = useState()
    const [studentEmail, setStudentEmail] = useState()
    const [studentPhone, setStudentPhone] = useState()
    const [studentPassword, setStudentPassword] = useState()
    const [studentAboutSelf, setStudentAboutSelf] = useState()
    const [studentSkills, setStudentSkills] = useState()
    const [studentExp, setStudentExp] = useState()
    const [studentLogin, setStudentLogin] = useState()
    const [courseUrl, setCourseUrl] = useState()
    const [passwordIsChanging, setPasswordIsChanging] = useState(false)
    const [passwordIsChanged, setPasswordIsChanged] = useState()
    const [studentLoginIsChanged, setStudentLoginIsChanged] = useState(false)
    useEffect(() => {
        console.log(studentLoginIsChanged, "studentLoginIsChanged");
    }, [studentLoginIsChanged])
    const router = useRouter();

    const handleSubmit = (event) => {
        files
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', files[0]);
        axios.post(`${globals.productionServerDomain}/file/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
          }).then((response) => {
            console.log(response)
              const uploadedFileName = response.data;
              console.log('uploadedFileName', uploadedFileName)
              setFileName(uploadedFileName)
              const filePath = `${globals.ftpDomain}${uploadedFileName}`;
              console.log('filePath', filePath)
              setLink(filePath)
          }).catch((error) => {
              console.log(error);
          });
    }

    // updateTeacherData
    // const handleSubmitNewTeacherData = async() => { 
    //     let studentFIOsplitter = studentFIO.split(' ')
    //     const data = {
    //       surname: studentFIOsplitter[0],
    //       name: studentFIOsplitter[1],
    //       patronymic: studentFIOsplitter[2],
    //       email: studentEmail,
    //       phone: studentPhone,
    //       skills: studentSkills,
    //       experience: studentExp, 
    //       avatar: fileName,
    //       url: studentLogin,
    //       studentDescription: studentAboutSelf 
    //     }; 
    
    //     console.log(data);
    //     await axios({
    //       method: "put",
    //       url: `${globals.productionServerDomain}/updateTeacherData/` + 12, 
    //       data: data,
    //     })
        
    //     // if (studentLoginIsChanged === true) {
    //     //     console.log("IMHERE");
    //     //     router.push('/auth')
    //     // }
    //   };

    const handleSubmitNewStudentData = async() => { 
        let studentFIOsplitter = studentFIO.split(' ')
        const data = {
          surname: studentFIOsplitter[0],
          name: studentFIOsplitter[1],
          patronymic: studentFIOsplitter[2],
          email: studentEmail,
          phone: studentPhone,
          img: fileName,
          id: student.id,
          nickname: studentLogin
        }; 
      
        console.log(data);
      
        try {
          await axios({
            method: "put",
            url: `${globals.productionServerDomain}/updateStudentDataFromProfile`,
            data: data,
          });
        } catch (error) {
          console.error(error);
        }

        if (studentLoginIsChanged) {
            updateStudentLogin()   
        }
        if (passwordIsChanged) {
            updateStudentPassword()
        }
      };

    const getStudentCoursesAndPrograms = async () => {
        const response = await axios.get(`${globals.productionServerDomain}/getAllCoursesAndProgramsOfStudent?studentId=${student.id}`)
        const data = {
            courseId: response.data[0].course_id
          }
        let result = await axios.post(`${globals.productionServerDomain}/getCourseById`, data)
        setCourseUrl(result.data[0].url)
    }
    useEffect(() => {
        if (student != undefined) {
            getStudentCoursesAndPrograms()
        }
    }, [student])
    const loadStudentProfileInfo = async () => {
        const studentUrl = props.nickname
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
                setStudentFIO(studentInfo.surname + ' ' + studentInfo.name + ' ' + studentInfo.patronymic)
                setStudentEmail(studentInfo.email)
                setStudentPhone(studentInfo.phone)
                setStudentPassword()
                setStudentLogin(studentInfo.nickname)
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

    const updateStudentLogin = async () => {
        const data = {
            nick: studentLogin,
            id: student.id,
            roleId: 3
        }; 
        console.log(data);
        try {
          await axios({
            method: "put",
            url: `${globals.productionServerDomain}/updateUserLogin`,
            data: data,
          });
        } catch (error) {
          console.error(error);
        }
    }
    const updateStudentPassword = async () => {
        const data = {
            password: studentPassword,
            id: student.id,
            roleId: 3
        }; 
        console.log(data);
        try {
          await axios({
            method: "put",
            url: `${globals.productionServerDomain}/updateUserPassword`,
            data: data,
          });
        } catch (error) {
          console.error(error);
        }
    }

	return ( 
        <>
            <HeaderStudent white={true} name={studentFIO?.split(' ')[1]} surname={studentFIO?.split(' ')[0]} courseUrl={courseUrl} nickname={studentLogin} />
            <div className={styles.mainWrapperOfEditProgram} 
            >
                {/* <HeaderTeacher white={true} student={student} /> */}

                <div className={styles.cantainer}>
                    <div className={styles.mainTitle}>
                        <span>Профиль</span>
                    </div>
                    <div className={styles.programBlock}>
                        <h2>Фото профиля</h2> 
                        <form onSubmit={handleSubmit}>
                            <input type="file" name="file" onChange={(event) => setFiles(event.target.files)} />
                            <input type="submit" value="Upload" />
                        </form>
                        <h2>Ф.И.О</h2> 
                        <input type="text" 
                            onChange={(event) => setStudentFIO(event.target.value)}
                            value={studentFIO}/>
                        <h2>Почта</h2>
                        <input type="text" 
                            onChange={(event) => setStudentEmail(event.target.value)}
                            value={studentEmail}/>
                        <h2>Телефон</h2>
                        <input type="text" 
                            onChange={(event) => setStudentPhone(event.target.value)}
                            value={studentPhone}/>
                        <h2>Пароль</h2>
                        <button style={{display: passwordIsChanging ? 'none' : 'block'}} onClick={() => setPasswordIsChanging(true)}>Изменить пароль</button>
                        <input type="password" 
                            style={{display: passwordIsChanging ? 'block' : 'none'}}
                            onChange={(event) => setStudentPassword(event.target.value)}
                            value={studentPassword}/>
                        <button style={{display: passwordIsChanging ? 'block' : 'none'}} 
                            onClick={() => {setPasswordIsChanging(false)
                                setPasswordIsChanged(true)
                            }}>OK
                        </button>
                        <h2>Логин</h2>
                        <input type="text" 
                        // disabled
                            onChange={(event) => {setStudentLogin(event.target.value)
                                                setStudentLoginIsChanged(true)}}
                            value={studentLogin}/>
                        <h2>Save</h2>
                        <button onClick={() => {
                            handleSubmitNewStudentData()
                            // debugger
                           if (studentLoginIsChanged === true) {
                            router.push(`/cabinet/student/${studentLogin}/profile`)
                            } 
                        }}>
                            Save
                        </button>
                    </div>
                </div>
                
                {/* <Footer /> */}
            </div>
            <Footer />
        </>
       )
}

StudentProfile.getInitialProps = async (ctx) => {
	console.log('lol',ctx)
    if(ctx.query.nickname !== undefined) {
        return {
            nickname: ctx.query.nickname
        }
    }else{
        return {};
    }
}

export default StudentProfile
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import Footer from "../../../../../src/components/Footer/Footer";
import HeaderTeacher from "../../../../../src/components/new_HeaderTeacher/new_HeaderTeacher";
import globals from "../../../../../src/globals";
import styles from './styles.module.css'
import { Image } from "react-bootstrap";
import GuideModal from "../../../../../src/components/GuideModal/GuideModal";
///getTeacherByUrl/:url
// фамилия имя отчество, почта, телефон, пароль, о себе, навыки, опыт работы, никнеймн-логин лучше логин
function TeacherProfile(props) {
    const [files, setFiles] = useState([]);
    const [fileName, setFileName] = useState()

    const [link, setLink] = useState()
    const [teacher, setTeacher] = useState()
    const [teacherFIO, setTeacherFIO] = useState()
    const [surname, setSurname] = useState()
    const [name, setName] = useState()
    const [patronymic, setPatronymic] = useState()
    const [teacherEmail, setTeacherEmail] = useState()
    const [teacherPhone, setTeacherPhone] = useState()
    const [teacherPassword, setTeacherPassword] = useState()
    const [teacherAboutSelf, setTeacherAboutSelf] = useState()
    const [teacherSkills, setTeacherSkills] = useState()
    const [teacherSkillsSplitted, setTeacherSkillsSplitted] = useState([])

    const [teacherExp, setTeacherExp] = useState()
    const [teacherLogin, setTeacherLogin] = useState()
    const [passwordIsChanging, setPasswordIsChanging] = useState(false)
    const [passwordIsChanged, setPasswordIsChanged] = useState()
    const [teacherLoginIsChanged, setTeacherLoginIsChanged] = useState(false)

    const [showGuide, setShowGuide] = useState(false)
    const [guide, setGuide] = useState()

    useEffect(() => {
        console.log(teacherLoginIsChanged, "teacherLoginIsChanged");
    }, [teacherLoginIsChanged])
    useEffect(() => {
        setFileName(teacher?.avatar)
    }, [teacher])
    const router = useRouter();

    const loadGuide = async (id) => {
        let getGuideById = await axios.post(`${globals.productionServerDomain}/getGuideById/` + id)
        setGuide(getGuideById['data'][0])
        console.log('guide', getGuideById, guide)
      }

    const handleSubmit = (files) => {
        files
        // event.preventDefault();
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

    const updateTeacherLogin = async () => {
        const data = {
            nick: teacherLogin,
            id: teacher.id,
            roleId: 2
        };
        debugger
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
    const updateTeacherPassword = async () => {
        const data = {
            password: teacherPassword,
            id: teacher.id,
            roleId: 2
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

    // updateTeacherData
    // const handleSubmitNewTeacherData = async() => { 
    //     let teacherFIOsplitter = teacherFIO.split(' ')
    //     const data = {
    //       surname: teacherFIOsplitter[0],
    //       name: teacherFIOsplitter[1],
    //       patronymic: teacherFIOsplitter[2],
    //       email: teacherEmail,
    //       phone: teacherPhone,
    //       skills: teacherSkills,
    //       experience: teacherExp, 
    //       avatar: fileName,
    //       url: teacherLogin,
    //       teacherDescription: teacherAboutSelf 
    //     }; 

    //     console.log(data);
    //     await axios({
    //       method: "put",
    //       url: `${globals.productionServerDomain}/updateTeacherData/` + 12, 
    //       data: data,
    //     })

    //     // if (teacherLoginIsChanged === true) {
    //     //     console.log("IMHERE");
    //     //     router.push('/auth')
    //     // }
    //   };

    const handleSubmitNewTeacherData = async () => {
        // let teacherFIOsplitter = teacherFIO.split(' ')
        const data = {
            // surname: teacherFIOsplitter[0],
            // name: teacherFIOsplitter[1],
            // patronymic: teacherFIOsplitter[2],
            surname: surname,
            name: name,
            patronymic: patronymic,
            email: teacherEmail,
            phone: teacherPhone,
            skills: teacherSkills,
            experience: teacherExp,
            avatar: fileName,
            url: teacherLogin,
            teacherDescription: teacherAboutSelf
        };

        console.log(data);

        try {
            await axios({
                method: "put",
                url: `${globals.productionServerDomain}/updateTeacherData/` + teacher.id,
                data: data,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const loadTeacherProfileInfo = async () => {
        const getTeacherInfo = await axios.post(`${globals.productionServerDomain}/getTeacherByUrl/` + props.url)
        const teacherInfo = getTeacherInfo.data[0]
        console.log(getTeacherInfo, "getTeacherInfo");
        setTeacher(teacherInfo)
        // setTeacherFIO(
        //     (teacherInfo.surname != null ? teacherInfo.surname : ' ' )
        //     + ' ' 
        //     + (teacherInfo.name != null ? teacherInfo.name : ' ') 
        //     + ' ' 
        //     + (teacherInfo.patronymic != null ? teacherInfo.patronymic : ' '))
        setSurname(teacherInfo.surname != null ? teacherInfo.surname : '')
        setName(teacherInfo.name != null ? teacherInfo.name : '')
        setPatronymic(teacherInfo.patronymic != null ? teacherInfo.patronymic : '')
        setTeacherEmail(teacherInfo.email)
        setTeacherPhone(teacherInfo.phone)
        setTeacherPassword()
        setTeacherAboutSelf(teacherInfo.description)
        setTeacherSkills(teacherInfo.skills)
        // setTeacherSkillsSplitted(teacherInfo.skills?.split(";"))
        setTeacherExp(teacherInfo.experience)
        setTeacherLogin(teacherInfo.url)
    }
    useEffect(() => {
        loadTeacherProfileInfo()
    }, [])
    useEffect(() => {
        setTeacherSkillsSplitted(teacherSkills?.split(";"))
        debugger 
    }, [teacherSkills])

    const [changeMod, setChangeMod] = useState(false)
    const [changeModOfSkills, setChangeModOfSkills] = useState(false)
    const [newSkillValue, setNewSkillValue] = useState()

    // useEffect(() => {
    //     setTeacherSkillsSplitted(teacherSkills?.split(";"))
    //     // let test = teacherSkills?.split(";")
    // }, [teacherSkills])

    const addressUndefinedFixer = async () => {
        await router.push(`/cabinet/teacher/${localStorage.login}`)
        window.location.reload()
      }
      useEffect(() => {
        if (router.query.url === "undefined") {
          addressUndefinedFixer()
        }
      }, [router])

      
    return (
        <>  
                    <HeaderTeacher white={true} teacher={teacher} />
        <div className={styles.container}>

            <div className={styles.mainWrapperOfEditProgram}
            >
                {/* <HeaderTeacher white={true} teacher={teacher} /> */}

                <div className={styles.cantainer}>
                    {showGuide && <GuideModal showGuide={showGuide} setShowGuide={setShowGuide} guide={guide}/>}
                    <div className={styles.programBlock}>
                        <div className={styles.wrapper_head}>
                            <div className={styles.wrapper_teacher_image}>
                                <div className={styles.teacher_image}>
                                    <div className={styles.teacher_info_wrapper}>
                                        <div className="">
                                            {files[0]?.name != undefined ?
                                            <Image className={styles.teacherPhoto} src={URL.createObjectURL(files[0])} />
                                            :
                                            <Image className={styles.teacherPhoto} src={teacher?.avatar} />
                                            }
                                        </div>
                                        <div className={styles.teacher_info}>
                                            <p>{surname} {name} {patronymic}</p>
                                            <p>Подписка закончится: 25.03.2023</p>
                                        </div>
                                    </div>
                                    <div className={styles.header_btn}>
                                        <div style={{display: 'flex', flexDirection: 'row'}}>
                                            {passwordIsChanged === true || teacherLoginIsChanged || files[0]?.name != undefined === true ?
                                            <button className={styles.btn_submit} onClick={async () => {
                                                handleSubmitNewTeacherData()
                                                // debugger
                                                if (teacherLoginIsChanged) {
                                                    await updateTeacherLogin()
                                                }
                                                if (passwordIsChanged) {
                                                    await updateTeacherPassword()
                                                }
                                                if (teacherLoginIsChanged === true) {
                                                    async function test() {
                                                        await localStorage.setItem('login', teacherLogin);
                                                        await router.push(`/cabinet/teacher/${teacherLogin}/profile`)
                                                        await window.location.reload()
                                                    }
                                                    await test()
                                                }
                                                window.location.reload()
                                            }}>
                                                Сохранить
                                            </button>
                                            :
                                            <button onClick={() => setChangeMod(true)}>Редактировать</button>
                                            }

                                            <Image 
                                                src="https://realibi.kz/file/628410.png"
                                                style={{marginLeft: '10px', width: '20px', height: '20px'}}
                                                onClick={() => {
                                                    loadGuide(9)
                                                    setShowGuide(true)
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {changeMod ? <><form className={styles.image_upload_wrapper} onSubmit={handleSubmit}>
                                <input type="file" name="file" onChange={(event) => {setFiles(event.target.files)
                                                                                     handleSubmit(event.target.files)}} />
                                {/* <input type="submit" value="Upload" /> */}
                            </form></> : ''}

                        </div>
                        <div className={styles.inputs_wrapper}>
                            <div className={styles.input_container}>
                                <h2>Ф.И.О</h2>
                                <div className={styles.fio}>
                                    <input type="text"
                                        disabled={!changeMod}
                                        onChange={(event) => setSurname(event.target.value)}
                                        value={surname} 
                                        placeholder="Фамилия"/>
                                    <input type="text"
                                        disabled={!changeMod}
                                        onChange={(event) => setName(event.target.value)}
                                        value={name} 
                                        placeholder="Имя"/>
                                    <input type="text"
                                        disabled={!changeMod}
                                        onChange={(event) => setPatronymic(event.target.value)}
                                        value={patronymic} 
                                        placeholder="Отчество"/>
                                </div>
                            </div>
                            <div className={styles.input_container}>
                                <h2>Почта</h2>
                                <input type="text"
                                disabled={!changeMod}
                                    onChange={(event) => setTeacherEmail(event.target.value)}
                                    value={teacherEmail} />
                            </div>
                            <div className={styles.input_container}>
                                <h2>Телефон</h2>
                                <input type="text"
                                disabled={!changeMod}
                                    onChange={(event) => setTeacherPhone(event.target.value)}
                                    value={teacherPhone} />
                            </div>
                            {/* <div className={styles.input_container}>
                                <h2>Пароль</h2>
                                <button style={{ display: passwordIsChanging ? 'none' : 'block' }} onClick={() => setPasswordIsChanging(true)}>Изменить пароль</button>
                                <input type="password"
                                    style={{ display: passwordIsChanging ? 'block' : 'none' }}
                                    onChange={(event) => setTeacherPassword(event.target.value)}
                                    value={teacherPassword} />
                                <button style={{ display: passwordIsChanging ? 'block' : 'none' }} onClick={() => {
                                    setPasswordIsChanging(false)
                                    setPasswordIsChanged(true)
                                }}>OK</button>
                            </div> */}
                            {/* <div className={styles.input_container}>
                                <h2>Телефон</h2>
                                <input type="text"
                                disabled={!changeMod}
                                    onChange={(event) => setTeacherPhone(event.target.value)}
                                    value={teacherPhone} />
                            </div> */}
                            <div className={styles.input_container}>
                                <h2>О себе</h2>
                                <input type="text"
                                disabled={!changeMod}
                                    onChange={(event) => setTeacherAboutSelf(event.target.value)}
                                    value={teacherAboutSelf} />
                            </div>
                            <div className={styles.input_container}>
                                <h2>Навыки</h2>
                                        <div className={styles.skillsContainer}>
                                        {teacherSkillsSplitted?.map(el => { return (el.length != 0 ? <p className={styles.skillWords}>{el}</p> : '')})}
                                        {changeModOfSkills ? '' : <p
                                        onClick={() => {
                                            setChangeModOfSkills(true)
                                        }} 
                                        className={styles.skillWordsAdd}>+</p>}
                                        {changeModOfSkills ? <div className={styles.skillsSubmitWrapper}>
                                            <input className={styles.skillsInput} value={newSkillValue} onChange={() => setNewSkillValue(event.target.value)}/>
                                            <p
                                                onClick={() => {setChangeModOfSkills(false)
                                                                let test
                                                                // test = (prevState => {
                                                                //     return [
                                                                //       ...prevState,
                                                                //       newSkillValue + ";"
                                                                //     ]
                                                                //   })
                                                                test = (teacherSkills === null ? "" : teacherSkills) + " " + newSkillValue + ";"
                                                                setTeacherSkills(test)
                                                                debugger
                                                                debugger}} 
                                                className={styles.skillWordsAdd}>✓
                                            </p>
                                        </div>  : ''}
                                        </div>
                            </div>
                            <div className={styles.input_container}>
                                <h2>Опыт работы</h2>
                                <input type="text"
                                disabled={!changeMod}
                                    onChange={(event) => setTeacherExp(event.target.value)}
                                    value={teacherExp} />
                            </div>
                            <div className={styles.input_container}>
                                <h2>Логин</h2>
                                <input type="text"
                                disabled={!changeMod}
                                    // disabled
                                    onChange={(event) => {
                                        setTeacherLogin(event.target.value)
                                        setTeacherLoginIsChanged(true)
                                    }}
                                    value={teacherLogin} />
                            </div>
                        </div>
                        <button className={styles.btn_submit} onClick={async () => {
                            handleSubmitNewTeacherData()
                            // debugger
                            if (teacherLoginIsChanged) {
                                await updateTeacherLogin()
                            }
                            if (passwordIsChanged) {
                                await updateTeacherPassword()
                            }
                            if (teacherLoginIsChanged === true) {
                                async function test() {
                                    await localStorage.setItem('login', teacherLogin);
                                    await router.push(`/cabinet/teacher/${teacherLogin}/profile`)
                                    await window.location.reload()
                                }
                                await test()
                            }
                            window.location.reload()
                        }}>
                            Сохранить
                        </button>
                    </div>
                </div>

                {/* Footer /> */}
            </div>
            </div>
        {/* Footer /> */}
        </>
    )
}

TeacherProfile.getInitialProps = async (ctx) => {
    console.log('lol', ctx)
    if (ctx.query.url !== undefined) {
        return {
            url: ctx.query.url,
        }
    } else {
        return {};
    }
}

export default TeacherProfile
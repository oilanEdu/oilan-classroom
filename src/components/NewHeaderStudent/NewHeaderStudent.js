import styles from "./NewHeaderStudent.module.css";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BecomeAPartner } from "../BecomeAPartner/BecomeAPartner";
import ModalWindow from "../ModalWindow/ModalWindow";
import { useRouter } from "next/router";
import globals from "../../globals";
import ym from "react-yandex-metrika";
import { default as axios } from "axios";
import { Image } from "react-bootstrap";
import classnames from 'classnames';

export default function NewHeaderStudent(props) {
  const [show, setShow] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [cabinetRoute, setCabinetRoute] = useState("/login");
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false)
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('login')
    localStorage.removeItem('role')
    router.push('/auth')
  }
  const [courseUrl, setCourseUrl] = useState(router.query.courseUrl)
  const [nickname, setNickname] = useState(router.query.nickname)

  const [student, setStudent] = useState({});
  const [center, setCenter] = useState({});
  const [lessons, setLessons] = useState([]);
  const [balance, setBalance] = useState()

  const [exitingOut, setExitingOut] = useState(false);

  const [loadingData, setLoadingData] = useState(true);

  const [mainPageLink, setMainPageLink] = useState()

  const loadUserInfo = async () => {
    await axios.get(`${globals.productionServerDomain}/getStudentCourseInfo?student_nick=${router.query.nickname}&course_url=${courseUrl}`).then(async (res) => {
      setStudent(res.data[0]);
      await axios.get(`${globals.productionServerDomain}/getLessonInfo?course_url=${courseUrl}&program_id=${res.data[0]?.program_id}&student_id=${res.data[0]?.id}`).then(async (res2) => {
        // setLesson(res2.data[0]);
        setLessons(res2.data);

        // await axios.get(`${globals.productionServerDomain}/getLessonExercises?lesson_id=${res2.data[0].id}&student_id=${res.data[0].id}`).then(res3 => {
        //   setExercises(res3.data);
        // });
      });
    });
    if (
      localStorage.getItem(globals.localStorageKeys.currentStudent) !== null
    ) {
      let currentStudent = JSON.parse(
        localStorage.getItem(globals.localStorageKeys.currentStudent)
      );

      setStudent({
        name: currentStudent.name,
      });

      setCabinetRoute("/cabinet/student");
      setIsLogged(true);
      setLoadingData(false);
    } else if (
      localStorage.getItem(globals.localStorageKeys.centerId) !== null
    ) {
      let centerId = +localStorage.getItem(globals.localStorageKeys.centerId);
      let roleId = +localStorage.getItem(globals.localStorageKeys.roleId);
      console.log("auth role id", roleId);

      if (roleId === 6) {
        await axios({
          method: "get",
          url: `${globals.productionServerDomain}/tutors/${centerId}`,
        }).then(async function (res) {
          await setCenter(res.data);
          setCabinetRoute("/cabinet/tutor");
          console.log("cabinet route /cabinet/tutor", cabinetRoute);
          setIsLogged(true);
        });
      } else if (roleId === 4) {
        await axios({
          method: "get",
          url: `${globals.productionServerDomain}/courses/${centerId}`,
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem(globals.localStorageKeys.authToken)
            ).token
              }`,
          },
        }).then(async function (res) {
          await setCenter(res.data[0]);
          setCabinetRoute("/cabinet");
          console.log("cabinet route /cabinet", cabinetRoute);
          setIsLogged(true);
        });
      }

      setLoadingData(false);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(function () {
    loadUserInfo();
    setLoadingData(false);
    console.log("pathname = " + window.location.pathname);
    mainPage();
  }, []);
  useEffect(() => {
    if (lessons[0] != undefined) {
      let balance1 = 0
      lessons.forEach(item => {
        balance1 = item.score + balance1
      })
      balance1
      setBalance(balance1)
    }
  }, [lessons]);

  const mainPage = () => {
    if (nickname !== undefined) {
      setMainPageLink(`/cabinet/student/${encodeURIComponent(nickname)}/course/${courseUrl}`)
    } else {
      setMainPageLink(`/cabinet/student/${encodeURIComponent(props.nickname)}/course/${props.courseUrl}`)
    }
  }

  console.log(mainPageLink);
  return (
    <div id={"header"} className={styles.whiteHeader}>
      {/*<YMInitializer accounts={[78186067]} options={{webvisor: true, defer: true}} version="2" />*/}
      <ModalWindow
        show={show}
        handleClose={handleClose}
        heading={""}
        body={<BecomeAPartner handleClose={handleClose} />}
      />

      <div className={styles.desktopHeader}>
        <div className={styles.logo}>
          {/* <Link href={"/"}> */}
          <a
            // onClick={async (ctx) => {
            //   if (props.reload) {
            //     props.close(false);
            //     props.setStep(1);
            //   } else {
            //     if (window.location.pathname === "/") {
            //       router.reload();
            //     } else {
            //       await router.push("/");
            //     }
            //   }
            // }}
            style={{
              color: "black",
              alignContent: "center",
              alignItems: "center",
              display: "flex",
              cursor: 'pointer',
            }}
          >
            <img src="https://realibi.kz/file/42902.svg" alt="" />
          </a>
          {/* </Link> */}
        </div>
        <div className={styles.menu}>
          <ul className={styles.menu_ul}>
            <li>
              <Link
                href={`/new_student_cabinet/${encodeURIComponent(props.nickname)}/course/${props.courseUrl}?program=${props.programId}`}
                target="_blank"

              >
                <a className={styles.link}
                  style={{ color: "black" }}>
                  Главная
                </a>
              </Link>
            </li>
            <li>
              <Link
                href={`/new_student_cabinet/${encodeURIComponent(props.nickname)}/course/${props.courseUrl}/programs?program=${props.programId}`}
                target="_blank"

              >
                <a className={styles.link} style={{ color: "black" }}>
                  Программа
                </a>
              </Link>
            </li>
            <li>
              {/* /cabinet/student/test/course/1/homeworks */}
              <Link
                href={`/new_student_cabinet/${encodeURIComponent(props.nickname)}/course/${props.courseUrl}/homeworks?program=${props.programId}`}
                target="_blank"

              >
                <a className={styles.link}
                  style={{ color: "black" }}>
                  Домашние задания
                </a>
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.contact} onClick={() => setMenuVisible(!menuVisible)}>
          <div className={styles.image_wrapper}>
            <img src="https://realibi.kz/file/185698.svg" alt="" />
          </div>
          <div className={styles.wrapper_text}>
            <p>Сашка Барабанов{props.name} {props.surname}</p>
            <span>Студент</span></div>
          {/* <span>Баланс - {balance * 10}</span> */}
          {menuVisible && (
            <ul className={`menu ${menuVisible ? "menu-active" : ""}`}>
              <Link
                href={`/cabinet/student/${encodeURIComponent(props.nickname)}/profile`}
                target="_blank"

              >
                <li className={styles.li}>Профиль</li>
              </Link>
              <li className={styles.li} onClick={handleLogout}>Выйти</li>
            </ul>
          )}
        </div>
        <div
          onClick={() => {
            setShowMobileMenu(!showMobileMenu);
          }}
          className={styles.menuButtonBody}
        >
          <svg
            width="30"
            height="18"
            viewBox="0 0 30 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1H29"
              stroke="black"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              d="M1 17H29"
              stroke="black"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              d="M9 9H29"
              stroke="black"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
          <span
            style={{
              fontFamily: "Rubik Medium",
              fontSize: "18px",
              marginLeft: "10px",
              color: "black",
            }}
          >
            Меню
          </span>
        </div>
      </div>

      {showMobileMenu ? (
        <div style={{ display: "block" }} className={styles.mobileMenu}>
          <ul className={styles.menu_ul}>
            <li>
              <Link
                href={`/new_student_cabinet/${encodeURIComponent(props.nickname)}/course/${props.courseUrl}?program=${props.programId}`}
                target="_blank"

              >
                <a className={styles.link}
                  style={{ color: "black" }}>
                  Главная
                </a>
              </Link>
            </li>
            <li>
              <Link
                href={`/new_student_cabinet/${encodeURIComponent(props.nickname)}/course/${props.courseUrl}/programs?program=${props.programId}`}
                target="_blank"
              >
                <a className={styles.link}

                  style={{ color: "black" }}>
                  Программа
                </a>
              </Link>
            </li>
            <li>
              <Link
                href={`/new_student_cabinet/${encodeURIComponent(props.nickname)}/course/${props.courseUrl}/homeworks?program=${props.programId}`}
                target="_blank"

              >
                <a className={styles.link}
                  style={{ color: "black" }}>
                  Домашние задания
                </a>
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}

NewHeaderStudent.getInitialProps = async (ctx) => {
  if (ctx.query.courseUrl !== undefined && ctx.query.nickname !== undefined) {
    return {
      courseUrl: ctx.query.courseUrl,
      nickname: ctx.query.nickname
    }
  } else {
    return {};
  }
}
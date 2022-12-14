import styles from "./HeaderStudent.module.css";
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

export default function HeaderStudent(props) {
  const [show, setShow] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [cabinetRoute, setCabinetRoute] = useState("/login");
  const router = useRouter();

  const [courseUrl, setCourseUrl] = useState(router.query.courseUrl)
  const  [nickname, setNickname] = useState(router.query.nickname)

  const [student, setStudent] = useState({});
  const [center, setCenter] = useState({});
  const [ lessons, setLessons ] = useState([]);
  const [balance, setBalance] = useState()

  const [exitingOut, setExitingOut] = useState(false);

  const [loadingData, setLoadingData] = useState(true);

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
            Authorization: `Bearer ${
              JSON.parse(
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
  }, [lessons])

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
              }}
            >
              <svg width="120" height="38" viewBox="0 0 150 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M134.648 47.6752C131.844 47.6752 129.295 47.0447 127 45.7836C124.742 44.5224 122.957 42.7389 121.646 40.433C120.371 38.0909 119.734 35.3886 119.734 32.326C119.734 29.2994 120.39 26.633 121.701 24.3271C123.048 21.985 124.869 20.2015 127.164 18.9765C129.458 17.7154 132.026 17.0849 134.867 17.0849C137.708 17.0849 140.276 17.7154 142.57 18.9765C144.865 20.2015 146.667 21.9671 147.979 24.2731C149.326 26.579 150 29.2634 150 32.326C150 35.3886 149.308 38.0909 147.924 40.433C146.576 42.7389 144.737 44.5224 142.406 45.7836C140.075 47.0447 137.489 47.6752 134.648 47.6752ZM134.648 43.3515C136.433 43.3515 138.109 42.9372 139.675 42.1084C141.241 41.2796 142.497 40.0366 143.444 38.3792C144.428 36.7218 144.919 34.704 144.919 32.326C144.919 29.948 144.446 27.9302 143.499 26.2728C142.552 24.6154 141.314 23.3902 139.784 22.5976C138.254 21.7689 136.597 21.3546 134.812 21.3546C132.991 21.3546 131.316 21.7689 129.786 22.5976C128.293 23.3902 127.091 24.6154 126.181 26.2728C125.27 27.9302 124.815 29.948 124.815 32.326C124.815 34.74 125.252 36.7759 126.126 38.4333C127.036 40.0906 128.238 41.3337 129.732 42.1625C131.225 42.9551 132.864 43.3515 134.648 43.3515Z" fill="#007AFF"/>
                <path d="M14.9145 47.6045C12.1101 47.6045 9.56057 46.974 7.26604 45.7129C5.00791 44.4517 3.22328 42.6682 1.91211 40.3623C0.637366 38.0202 0 35.3179 0 32.2553C0 29.2287 0.655582 26.5623 1.96675 24.2564C3.31433 21.9143 5.13539 20.1308 7.42993 18.9058C9.72447 17.6447 12.2922 17.0142 15.133 17.0142C17.9739 17.0142 20.5416 17.6447 22.8361 18.9058C25.1306 20.1308 26.9335 21.8964 28.2447 24.2024C29.5922 26.5083 30.266 29.1927 30.266 32.2553C30.266 35.3179 29.5741 38.0202 28.19 40.3623C26.8425 42.6682 25.0031 44.4517 22.6722 45.7129C20.3413 46.974 17.7554 47.6045 14.9145 47.6045ZM14.9145 43.2808C16.6991 43.2808 18.3746 42.8665 19.9406 42.0377C21.5067 41.2089 22.7632 39.9659 23.7102 38.3085C24.6936 36.6511 25.1853 34.6333 25.1853 32.2553C25.1853 29.8772 24.7119 27.8594 23.7649 26.2021C22.8178 24.5447 21.5796 23.3195 20.0499 22.5269C18.5202 21.6981 16.863 21.2838 15.0784 21.2838C13.2573 21.2838 11.582 21.6981 10.0523 22.5269C8.55898 23.3195 7.35708 24.5447 6.44656 26.2021C5.53603 27.8594 5.08076 29.8772 5.08076 32.2553C5.08076 34.6693 5.51782 36.7052 6.39193 38.3625C7.30245 40.0199 8.50435 41.263 9.99763 42.0918C11.4909 42.8844 13.1299 43.2808 14.9145 43.2808Z" fill="#007AFF"/>
                <path d="M36.9116 9.7755V47.5407H31.0307V9.7755H36.9116ZM39.3191 33.3532C39.3191 30.5293 39.9038 28.0287 41.0731 25.8512C42.277 23.6738 43.8934 21.9897 45.9224 20.7989C47.9859 19.574 50.2557 18.9616 52.7319 18.9616C54.9673 18.9616 56.9104 19.4039 58.5612 20.2885C60.2464 21.1391 61.5876 22.2108 62.585 23.5037V19.4209H68.5174V47.5407H62.585V43.3559C61.5876 44.6828 60.2292 45.7885 58.5096 46.6731C56.79 47.5577 54.8297 48 52.6287 48C50.1869 48 47.9515 47.3876 45.9224 46.1628C43.8934 44.9039 42.277 43.1688 41.0731 40.9573C39.9038 38.7118 39.3191 36.1771 39.3191 33.3532ZM62.585 33.4553C62.585 31.516 62.1723 29.8319 61.3469 28.4029C60.5559 26.974 59.507 25.8852 58.2001 25.1367C56.8932 24.3883 55.4832 24.014 53.97 24.014C52.4568 24.014 51.0467 24.3883 49.7399 25.1367C48.433 25.8512 47.3667 26.9229 46.5413 28.3519C45.7505 29.7468 45.355 31.4139 45.355 33.3532C45.355 35.2925 45.7505 36.9937 46.5413 38.4566C47.3667 39.9196 48.433 41.0424 49.7399 41.8249C51.0811 42.5734 52.4911 42.9476 53.97 42.9476C55.4832 42.9476 56.8932 42.5734 58.2001 41.8249C59.507 41.0764 60.5559 39.9877 61.3469 38.5587C62.1723 37.0957 62.585 35.3946 62.585 33.4553ZM87.2297 18.9616C89.4651 18.9616 91.4598 19.4209 93.2137 20.3396C95.0021 21.2582 96.3949 22.6191 97.3923 24.4223C98.3896 26.2255 98.8883 28.4029 98.8883 30.9546V47.5407H93.059V31.8222C93.059 29.3045 92.4227 27.3822 91.1502 26.0554C89.8778 24.6945 88.141 24.014 85.94 24.014C83.7389 24.014 81.985 24.6945 80.6781 26.0554C79.4057 27.3822 78.7694 29.3045 78.7694 31.8222V47.5407H72.8885V19.4209H78.7694V22.6361C79.7324 21.4793 80.9533 20.5777 82.4321 19.9313C83.9453 19.2848 85.5445 18.9616 87.2297 18.9616Z" fill="#007AFF"/>
                <path d="M113.802 16.8548C112.819 16.8548 111.995 16.5148 111.329 15.8347C110.663 15.1547 110.33 14.3127 110.33 13.3088C110.33 12.3049 110.663 11.4629 111.329 10.7829C111.995 10.1028 112.819 9.76279 113.802 9.76279C114.753 9.76279 115.561 10.1028 116.227 10.7829C116.893 11.4629 117.226 12.3049 117.226 13.3088C117.226 14.3127 116.893 15.1547 116.227 15.8347C115.561 16.5148 114.753 16.8548 113.802 16.8548ZM116.465 20.4008V47.1659H111.043V20.4008H116.465Z" fill="#007AFF"/>
                <path d="M102.986 46.9389C102.499 46.4432 102.256 45.8457 102.256 45.1465C102.256 44.4474 102.499 43.8563 102.986 43.3732C103.473 42.8775 104.062 42.6296 104.754 42.6296C105.446 42.6296 106.036 42.8775 106.523 43.3732C107.01 43.8563 107.253 44.4474 107.253 45.1465C107.253 45.8457 107.01 46.4432 106.523 46.9389C106.036 47.422 105.446 47.6635 104.754 47.6635C104.062 47.6635 103.473 47.422 102.986 46.9389Z" fill="#007AFF"/>
                <path d="M15.0753 5.95043C14.2238 5.95043 13.5096 5.66514 12.9328 5.09455C12.356 4.52396 12.0676 3.81751 12.0676 2.97522C12.0676 2.13292 12.356 1.42647 12.9328 0.855884C13.5096 0.285295 14.2238 0 15.0753 0C15.8993 0 16.5997 0.285295 17.1766 0.855884C17.7534 1.42647 18.0418 2.13292 18.0418 2.97522C18.0418 3.81751 17.7534 4.52396 17.1766 5.09455C16.5997 5.66514 15.8993 5.95043 15.0753 5.95043ZM17.3826 8.92564V31.3824H12.6856V8.92564H17.3826Z" fill="#007AFF"/>
              </svg>
            </a>
          {/* </Link> */}
        </div>
        <div className={styles.menu}>
          <ul className={styles.menu_ul}>
            <li>
            <Link
                href={`/cabinet/student/${encodeURIComponent(nickname)}/course/${courseUrl}`}
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
                href={`/cabinet/student/${encodeURIComponent(nickname)}/course/${courseUrl}`}
                target="_blank"
                
              >
                <a className={styles.link}
                onClick={() =>
                  setTimeout(() => {
                    router.push("#programs");
                  }, props.isInMainPage ? 0 : 1000)
                }
                style={{ color: "black" }}>
                Программа  
                </a>
              </Link>
            </li>
            <li>
              {/* /cabinet/student/test/course/1/homeworks */}
            <Link
                href={`/cabinet/student/${encodeURIComponent(nickname)}/course/${courseUrl}/homeworks`}
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
        <div className={styles.contact}>
          <p>{props.name} {props.surname}</p>
          <span>Студент</span>
          {/* <span>Баланс - {balance * 10}</span> */}
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
              <a
                className={styles.link}
                style={{ color: "black" }}
              >
                Главная
              </a>
            </li>
            <li>
              <a
                className={styles.link}
                style={{ color: "black" }}
              >
                Программа
              </a>
            </li>
            <li onClick={handleShow}>
              <a
                className={styles.link}
                style={{ color: "black" }}
              >
                Домашние задания
              </a>
            </li>
            
          </ul>
        </div>
      ) : null}
    </div>
  );
}

HeaderStudent.getInitialProps = async (ctx) => {
  if(ctx.query.courseUrl !== undefined && ctx.query.nickname !== undefined) {
      return {
          courseUrl: ctx.query.courseUrl,
          nickname: ctx.query.nickname
      }
  }else{
      return {};
  }
}
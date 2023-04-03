import styles from "./new_HeaderTeacher.module.css";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BecomeAPartner } from "../BecomeAPartner/BecomeAPartner";
import ModalWindow from "../ModalWindow/ModalWindow";
import { useRouter } from "next/router";
import globals from "../../globals";
import ym from "react-yandex-metrika";
import { default as axios } from "axios";
import { Image } from "react-bootstrap";
import classnames from "classnames";

export default function HeaderTeacher(props) {
  const [show, setShow] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [cabinetRoute, setCabinetRoute] = useState("/login");
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false)
  const [student, setStudent] = useState({});
  const [center, setCenter] = useState({});
  const [url, setUrl] = useState(router.query.url);

  const [exitingOut, setExitingOut] = useState(false);

  const [loadingData, setLoadingData] = useState(true);

  const loadUserInfo = async () => {
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

      if (roleId === 6) {
        await axios({
          method: "get",
          url: `${globals.productionServerDomain}/tutors/${centerId}`,
        }).then(async function (res) {
          await setCenter(res.data);
          setCabinetRoute("/cabinet/tutor");
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
          setIsLogged(true);
        });
      }

      setLoadingData(false);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('login')
    localStorage.removeItem('role')
    router.push('/auth')
  }

  useEffect(function () {
    loadUserInfo();
    setLoadingData(false);
  }, []);

  const [activeNavButton, setActiveNavButton] = useState()
  useEffect(() => {
    if (window.location.href.includes("myCourses")) {
      setActiveNavButton("myCourses")
    }
    if (window.location.href.includes("myStudents")) {
      setActiveNavButton("myStudents")
    }
    if (window.location.href.includes("homeworks")) {
      setActiveNavButton("homeworks")
    }
  }, [])
  useEffect(() => {
    activeNavButton
    // debugger
  }, [activeNavButton])

  return (
    <><div id={"header"} className={styles.whiteHeader}>
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
            <img 
              src="https://realibi.kz/file/42902.svg" 
              alt="" 
              onClick={() => router.push(`/cabinet/teacher/${encodeURIComponent(props?.teacher?.url)}`)}
            />
          </a>
          {/* </Link> */}
        </div>
        <div className={styles.menu}>
          <ul className={styles.menu_ul}>
            <li>
              <Link
                href={`/cabinet/teacher/${encodeURIComponent(props?.teacher?.url)}/myCourses`}
                target="_blank"
                className={styles.titleLink}
              >
                <a className={styles.link}
                style={{color: activeNavButton === "myCourses" ? "#2E8CF2" : "black"}}
                // style={{color: window.location.href.includes("myCourses") ? "#2E8CF2" : "black"}}
                >
                  Мои курсы
                </a>
              </Link>
            </li>
            <li>
              <Link
                href={`/cabinet/teacher/${encodeURIComponent(props?.teacher?.url)}/myStudents`}
                target="_blank"
                className={styles.titleLink}
              >
                <a
                  // onClick={() =>
                  //   setTimeout(() => {
                  //     router.push("#students");
                  //   }, props.isInMainPage ? 0 : 1000)
                  // }
                  className={styles.link}
                  style={{color: activeNavButton === "myStudents" ? "#2E8CF2" : "black"}}
                  // style={{color: window?.location.href.includes("myStudents") ? "#2E8CF2" : "black"}}
                >
                  Студенты
                </a>
              </Link>
            </li>
            <li>
              <Link
                href={`/cabinet/teacher/${encodeURIComponent(props?.teacher?.url)}/homeworks`}
                target="_blank"
                className={styles.titleLink}
                
                // style={{color: window?.location.href.includes("homeworks") ? "#2E8CF2" : "black"}}
              >
                <a
                
                  className={styles.link}
                  style={{color: activeNavButton === "homeworks" ? "#2E8CF2" : "black"}}
                  // style={{color: window?.location.href.includes("myStudents") ? "#2E8CF2" : "black"}}
                >
                  Домашние задания
                </a>
              </Link>
            </li>
          </ul>
        </div>
        <div
          className={styles.contact}
          style={{cursor: "pointer"}}
        >
            
            <div
            className={styles.contactImage}
            onClick={() => router.push(`/cabinet/teacher/${encodeURIComponent(props?.teacher?.url)}/profile`)}
            style={{
              backgroundImage: props.teacher?.avatar !== null ? "url(" + props.teacher?.avatar + ")" : "url(https://realibi.kz/file/142617.png)",
            }}
          />
            

          <div className={styles.contactDetails}>
            <b className={styles.contactName}>
              {props.teacher?.name} {props.teacher?.surname}
            </b>
            <span className={styles.contactRole} onClick={handleLogout}>Выйти</span>
          </div>

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
                href={`/cabinet/teacher/${encodeURIComponent(props?.teacher?.url)}/myCourses`}
                target="_blank"
                className={styles.titleLink}
                style={{color: activeNavButton === "myCourses" ? "#2E8CF2" : "black"}}
              >
                <a className={styles.link} style={{ color: "black" }}>
                  Мои курсы
                </a>
              </Link>
            </li>
            <li>
              <Link
                href={`/cabinet/teacher/${encodeURIComponent(props?.teacher?.url)}/myStudents`}
                target="_blank"
                className={styles.titleLink}
              >
                <a
                  className={styles.link}
                  style={{color: activeNavButton === "myStudents" ? "#2E8CF2" : "black"}}
                >
                  Студенты
                </a>
              </Link>
            </li>
            <li>
              <Link
                href={`/cabinet/teacher/${encodeURIComponent(props?.teacher?.url)}/homeworks`}
                target="_blank"
                className={styles.titleLink}
                style={{color: activeNavButton === "homeworks" ? "#2E8CF2" : "black"}}
              >
                Домашние задания
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
      <div className={styles.dropMenu}>
        {/* {menuVisible && ( */}
          <ul className={classnames(styles.menu
            // , { [styles.menuActive]: menuVisible }
            )}>
            {/* <Link
              href={`/cabinet/teacher/${encodeURIComponent(props?.teacher?.url)}/profile`}
              target="_blank"

            >
              <li className={styles.li}>Профиль</li>
            </Link> */}
            
          </ul>
        {/* )} */}
      </div>
    </div>
    </>
  );
}

HeaderTeacher.getInitialProps = async (ctx) => {
  if (ctx.query.url !== undefined) {
    return {
      url: ctx.query.url,
    };
  } else {
    return {};
  }
};

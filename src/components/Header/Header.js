import styles from "./Header.module.css";
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

export default function Header(props) {
  const [show, setShow] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [cabinetRoute, setCabinetRoute] = useState("/login");
  const router = useRouter();

  const [student, setStudent] = useState({});
  const [center, setCenter] = useState({});

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
  }, []);

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
        {/*<div className={styles.menu}>
          <ul className={styles.menu_ul}>
            <li>
              <a
                className={styles.link}
                style={{ color: "black" }}
                // onClick={() => window.scrollBy(0, 800)}
                onClick={() => document.location='#about'}
              >
                О нас
              </a>
            </li>
            <li>
              <a
                className={styles.link}
                style={{ color: "black" }}
                onClick={() => document.location='#program'}
              >
                Расписание
              </a>
            </li>
            {!isLogged && (
              <li onClick={handleShow}>
                <a
                  className={styles.link}
                  style={{ color: "black" }}
                  onClick={() => {
                    ym("reachGoal", "partnership-button-pressed");
                  }}
                >
                  Стать партнером
                </a>
              </li>
            )}
          </ul>
        </div>*/}
        <div className={styles.contact}>
          <a
            href="tel:+77054222579"
            className={classnames(styles.link, styles.phone)}
          >
            +7 (705) 422-25-79
          </a>
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
            {/*<li>
              <a
                className={styles.link}
                style={{ color: "black" }}
                onClick={() => {
                  router.push("/about");
                }}
              >
                О нас
              </a>
            </li>
            <li>
              <a
                className={styles.link}
                style={{ color: "black" }}
                onClick={() => {
                  router.push("/");
                }}
              >
                Расписание
              </a>
            </li>
            <li onClick={handleShow}>
              <a className={styles.link} style={{ color: "black" }}>
                Стать партнером
              </a>
            </li>*/}
            {isLogged ? (
              <li style={{ color: "black" }}>
                <Link href={cabinetRoute}>
                  <a style={{ color: "black" }}>Личный кабинет</a>
                </Link>
                <span
                  className={styles.exitBtn}
                  onClick={() => {
                    setExitingOut(true);

                    localStorage.removeItem(
                      globals.localStorageKeys.currentStudent
                    );

                    localStorage.removeItem(globals.localStorageKeys.authToken);
                    localStorage.removeItem(globals.localStorageKeys.centerId);
                    localStorage.removeItem(
                      globals.localStorageKeys.currentUserId
                    );
                    localStorage.removeItem(globals.localStorageKeys.roleId);

                    encodeURIComponent(router.push("/login"));
                  }}
                >
                  {exitingOut ? "Выход..." : "Выйти"}
                </span>
              </li>
            ) : (
              <li>
                <Link href={cabinetRoute} className={styles.link}>
                  <a style={{ color: "black" }}>Войти</a>
                </Link>
              </li>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

import styles from "./Header.module.css";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BecomeAPartner } from "../Forms/BecomeAPartnerForm/BecomeAPartner";
import ModalWindow from "../Modal/ModalWindow";
import { useRouter } from "next/router";
import globals from "../../globals";
import ym from "react-yandex-metrika";
import { default as axios } from "axios";
import { Image } from "react-bootstrap";

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
          <Link href={"/"}>
            <a
              onClick={async (ctx) => {
                if (props.reload) {
                  props.close(false);
                  props.setStep(1);
                } else {
                  if (window.location.pathname === "/") {
                    router.reload();
                  } else {
                    await router.push("/");
                  }
                }
              }}
              style={{
                color: "black",
                alignContent: "center",
                alignItems: "center",
                display: "flex",
              }}
            >
              <svg
                className={styles.svg}
                // viewBox="-30 30 640 389"
                xmlns="http://www.w3.org/2000/svg"
                width="100"
                viewBox="0 0 181 55"
                fill="none"
                xmls="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.3031 55.0003C14.0496 55.0003 11.0918 54.2586 8.42974 52.7751C5.80996 51.2915 3.73951 49.1934 2.21835 46.4807C0.739444 43.7256 0 40.5466 0 36.9439C0 33.3835 0.760578 30.2469 2.28173 27.5342C3.84514 24.7791 5.95786 22.681 8.61988 21.2399C11.2819 19.7563 14.2608 19.0146 17.5567 19.0146C20.8525 19.0146 23.8314 19.7563 26.4935 21.2399C29.1555 22.681 31.2471 24.758 32.7682 27.4706C34.3316 30.1833 35.1133 33.3412 35.1133 36.9439C35.1133 40.5466 34.3106 43.7256 32.7048 46.4807C31.1415 49.1934 29.0075 51.2915 26.3033 52.7751C23.5991 54.2586 20.599 55.0003 17.3031 55.0003ZM17.3031 49.914C19.3735 49.914 21.3174 49.4266 23.1342 48.4517C24.9511 47.4767 26.4089 46.0144 27.5076 44.0647C28.6484 42.1151 29.2189 39.7414 29.2189 36.9439C29.2189 34.1464 28.6696 31.7727 27.5709 29.8231C26.4723 27.8734 25.0357 26.4321 23.261 25.4997C21.4863 24.5248 19.5637 24.0374 17.4933 24.0374C15.3806 24.0374 13.4369 24.5248 11.6622 25.4997C9.92976 26.4321 8.53537 27.8734 7.47901 29.8231C6.42266 31.7727 5.89448 34.1464 5.89448 36.9439C5.89448 39.7837 6.40153 42.1786 7.41563 44.1283C8.47198 46.078 9.86638 47.5403 11.5988 48.5153C13.3312 49.4477 15.2327 49.914 17.3031 49.914Z"
                  fill="#412FAE"
                />
                3
                <path
                  d="M16.9308 6.99993C15.9429 6.99993 15.1144 6.66432 14.4452 5.99309C13.776 5.32187 13.4414 4.49082 13.4414 3.49997C13.4414 2.50911 13.776 1.67807 14.4452 1.00684C15.1144 0.335614 15.9429 0 16.9308 0C17.8868 0 18.6994 0.335614 19.3686 1.00684C20.0378 1.67807 20.3724 2.50911 20.3724 3.49997C20.3724 4.49082 20.0378 5.32187 19.3686 5.99309C18.6994 6.66432 17.8868 6.99993 16.9308 6.99993ZM19.6076 10.4999V36.9174H14.1584V10.4999H19.6076Z"
                  fill="#412FAE"
                />
                <path
                  d="M42.4575 10.002V54.4279H35.6348V10.002H42.4575ZM45.2507 37.7382C45.2507 34.4162 45.929 31.4745 47.2855 28.913C48.6822 26.3515 50.5575 24.3704 52.9115 22.9695C55.3055 21.5287 57.9388 20.8083 60.8115 20.8083C63.405 20.8083 65.6593 21.3286 67.5745 22.3692C69.5295 23.3698 71.0856 24.6305 72.2426 26.1514V21.3486H79.1253V54.4279H72.2426V49.5051C71.0856 51.066 69.5096 52.3667 67.5146 53.4073C65.5196 54.448 63.2454 54.9683 60.6918 54.9683C57.859 54.9683 55.2656 54.2478 52.9115 52.807C50.5575 51.3261 48.6822 49.2849 47.2855 46.6834C45.929 44.0419 45.2507 41.0601 45.2507 37.7382ZM72.2426 37.8582C72.2426 35.5769 71.7639 33.5958 70.8063 31.9148C69.8886 30.2338 68.6717 28.953 67.1555 28.0725C65.6393 27.192 64.0035 26.7518 62.2479 26.7518C60.4923 26.7518 58.8565 27.192 57.3403 28.0725C55.8241 28.913 54.5871 30.1738 53.6295 31.8547C52.712 33.4957 52.2532 35.4568 52.2532 37.7382C52.2532 40.0195 52.712 42.0207 53.6295 43.7417C54.5871 45.4627 55.8241 46.7835 57.3403 47.704C58.8964 48.5845 60.5322 49.0248 62.2479 49.0248C64.0035 49.0248 65.6393 48.5845 67.1555 47.704C68.6717 46.8235 69.8886 45.5428 70.8063 43.8618C71.7639 42.1408 72.2426 40.1396 72.2426 37.8582ZM100.834 20.8083C103.428 20.8083 105.742 21.3486 107.777 22.4292C109.852 23.5099 111.467 25.1108 112.625 27.232C113.782 29.3533 114.36 31.9148 114.36 34.9165V54.4279H107.597V35.9371C107.597 32.9754 106.859 30.7141 105.383 29.1532C103.907 27.5522 101.892 26.7518 99.3381 26.7518C96.7846 26.7518 94.7497 27.5522 93.2336 29.1532C91.7573 30.7141 91.0191 32.9754 91.0191 35.9371V54.4279H84.1964V21.3486H91.0191V25.1308C92.1363 23.77 93.5527 22.7094 95.2684 21.9489C97.024 21.1885 98.8793 20.8083 100.834 20.8083Z"
                  fill="#412FAE"
                />
                <path
                  d="M160.303 54.0003C157.05 54.0003 154.092 53.2586 151.43 51.7751C148.81 50.2915 146.74 48.1934 145.218 45.4807C143.739 42.7256 143 39.5466 143 35.9439C143 32.3835 143.761 29.2469 145.282 26.5342C146.845 23.7791 148.958 21.681 151.62 20.2399C154.282 18.7563 157.261 18.0146 160.557 18.0146C163.853 18.0146 166.831 18.7563 169.493 20.2399C172.155 21.681 174.247 23.758 175.768 26.4706C177.332 29.1833 178.113 32.3412 178.113 35.9439C178.113 39.5466 177.311 42.7256 175.705 45.4807C174.142 48.1934 172.008 50.2915 169.303 51.7751C166.599 53.2586 163.599 54.0003 160.303 54.0003ZM160.303 48.914C162.374 48.914 164.317 48.4266 166.134 47.4517C167.951 46.4767 169.409 45.0144 170.508 43.0647C171.648 41.1151 172.219 38.7414 172.219 35.9439C172.219 33.1464 171.67 30.7727 170.571 28.8231C169.472 26.8734 168.036 25.4321 166.261 24.4997C164.486 23.5248 162.564 23.0374 160.493 23.0374C158.381 23.0374 156.437 23.5248 154.662 24.4997C152.93 25.4321 151.535 26.8734 150.479 28.8231C149.423 30.7727 148.894 33.1464 148.894 35.9439C148.894 38.7837 149.402 41.1786 150.416 43.1283C151.472 45.078 152.866 46.5403 154.599 47.5153C156.331 48.4477 158.233 48.914 160.303 48.914Z"
                  fill="#412FAE"
                />
                <path
                  d="M138.531 15.1013C137.248 15.1013 136.172 14.6649 135.303 13.7922C134.434 12.9195 134 11.839 134 10.5506C134 9.26235 134.434 8.18182 135.303 7.30909C136.172 6.43636 137.248 6 138.531 6C139.772 6 140.828 6.43636 141.697 7.30909C142.566 8.18182 143 9.26235 143 10.5506C143 11.839 142.566 12.9195 141.697 13.7922C140.828 14.6649 139.772 15.1013 138.531 15.1013ZM142.007 19.6519V54H134.931V19.6519H142.007Z"
                  fill="#412FAE"
                />
                <path d="M128 47.5H121V54.5H128V47.5Z" fill="#412FAE" />
                {/* <path
                  d="M96.38 338.745C80.7233 338.745 66.49 335.187 53.68 328.07C41.0733 320.953 31.11 310.888 23.79 297.875C16.6733 284.658 13.115 269.408 13.115 252.125C13.115 235.045 16.775 219.998 24.095 206.985C31.6183 193.768 41.785 183.703 54.595 176.79C67.405 169.673 81.74 166.115 97.6 166.115C113.46 166.115 127.795 169.673 140.605 176.79C153.415 183.703 163.48 193.667 170.8 206.68C178.323 219.693 182.085 234.842 182.085 252.125C182.085 269.408 178.222 284.658 170.495 297.875C162.972 310.888 152.703 320.953 139.69 328.07C126.677 335.187 112.24 338.745 96.38 338.745ZM96.38 314.345C106.343 314.345 115.697 312.007 124.44 307.33C133.183 302.653 140.198 295.638 145.485 286.285C150.975 276.932 153.72 265.545 153.72 252.125C153.72 238.705 151.077 227.318 145.79 217.965C140.503 208.612 133.59 201.698 125.05 197.225C116.51 192.548 107.258 190.21 97.295 190.21C87.1283 190.21 77.775 192.548 69.235 197.225C60.8983 201.698 54.1883 208.612 49.105 217.965C44.0217 227.318 41.48 238.705 41.48 252.125C41.48 265.748 43.92 277.237 48.8 286.59C53.8833 295.943 60.5933 302.958 68.93 307.635C77.2667 312.108 86.4167 314.345 96.38 314.345Z"
                  fill={"#412FAE"}
                />
                <path
                  className={styles.logoLetter}
                  d="M94.59 108.48C89.8367 108.48 85.85 106.87 82.63 103.65C79.41 100.43 77.8 96.4433 77.8 91.69C77.8 86.9367 79.41 82.95 82.63 79.73C85.85 76.51 89.8367 74.9 94.59 74.9C99.19 74.9 103.1 76.51 106.32 79.73C109.54 82.95 111.15 86.9367 111.15 91.69C111.15 96.4433 109.54 100.43 106.32 103.65C103.1 106.87 99.19 108.48 94.59 108.48ZM107.47 125.27V252H81.25V125.27H107.47Z"
                  fill={"#412FAE"}
                />
                <path
                  d="M217.432 122.88V336H184.6V122.88H217.432ZM230.873 255.936C230.873 240 234.137 225.888 240.665 213.6C247.386 201.312 256.41 191.808 267.738 185.088C279.258 178.176 291.93 174.72 305.754 174.72C318.234 174.72 329.082 177.216 338.298 182.208C347.706 187.008 355.194 193.056 360.762 200.352V177.312H393.882V336H360.762V312.384C355.194 319.872 347.61 326.112 338.01 331.104C328.41 336.096 317.466 338.592 305.178 338.592C291.546 338.592 279.066 335.136 267.738 328.224C256.41 321.12 247.386 311.328 240.665 298.848C234.137 286.176 230.873 271.872 230.873 255.936ZM360.762 256.512C360.762 245.568 358.458 236.064 353.85 228C349.434 219.936 343.578 213.792 336.282 209.568C328.986 205.344 321.114 203.232 312.666 203.232C304.218 203.232 296.346 205.344 289.05 209.568C281.754 213.6 275.801 219.648 271.193 227.712C266.778 235.584 264.57 244.992 264.57 255.936C264.57 266.88 266.778 276.48 271.193 284.736C275.801 292.992 281.754 299.328 289.05 303.744C296.538 307.968 304.41 310.08 312.666 310.08C321.114 310.08 328.986 307.968 336.282 303.744C343.578 299.52 349.434 293.376 353.85 285.312C358.458 277.056 360.762 267.456 360.762 256.512ZM498.349 174.72C510.829 174.72 521.965 177.312 531.757 182.496C541.741 187.68 549.517 195.36 555.085 205.536C560.653 215.712 563.437 228 563.437 242.4V336H530.893V247.296C530.893 233.088 527.341 222.24 520.237 214.752C513.133 207.072 503.437 203.232 491.149 203.232C478.861 203.232 469.069 207.072 461.773 214.752C454.669 222.24 451.117 233.088 451.117 247.296V336H418.285V177.312H451.117V195.456C456.493 188.928 463.309 183.84 471.565 180.192C480.013 176.544 488.941 174.72 498.349 174.72Z"
                  fill={"#412FAE"} */}
                {/* /> */}
              </svg>
            </a>
          </Link>
        </div>
        <div className={styles.searchBlock}>
          {/*<input type="text" className={styles.searchInput} placeholder="Поиск"/>*/}
          {/*<div className={styles.searchIconBody} >*/}
          {/*    <img className={styles.searchIcon} src="/search-white.png" alt=""/>*/}
          {/*</div>*/}
        </div>
        <div className={styles.menu}>
          <ul className={styles.menu_ul}>
            <li>
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
                Каталог
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

            {loadingData === false && (
              <li>
                <a
                  style={{ color: "black" }}
                  onClick={() => {
                    if (!isLogged) {
                      ym("reachGoal", "log-in-button-pressed");
                      router.push("/login");
                    }
                  }}
                >
                  {student.name !== undefined ? (
                    <div className={styles.studentCard}>
                      <Image
                        src={"https://realibi.kz/file/624128.png"}
                        className={styles.studentAvatar}
                      />
                      <div className={styles.studentInfo}>
                        <span
                          className={styles.studentName}
                          onClick={() => router.push("/cabinet/student")}
                        >
                          {student.name}
                        </span>
                        <span
                          className={styles.exitBtn}
                          onClick={() => {
                            setExitingOut(true);
                            router.push("/login");
                          }}
                        >
                          {exitingOut ? "Выход..." : "Выйти"}
                        </span>
                      </div>
                    </div>
                  ) : center !== undefined && center.title !== undefined ? (
                    <div className={styles.studentCard}>
                      <Image
                        src={center.img_src}
                        className={styles.studentAvatar}
                      />
                      <div className={styles.studentInfo}>
                        <span
                          className={styles.studentName}
                          onClick={() => router.push("/cabinet")}
                        >
                          {center.title || center.fullname}
                        </span>
                        <span
                          className={styles.exitBtn}
                          onClick={() => {
                            setExitingOut(true);

                            localStorage.removeItem(
                              globals.localStorageKeys.currentStudent
                            );

                            localStorage.removeItem(
                              globals.localStorageKeys.authToken
                            );
                            localStorage.removeItem(
                              globals.localStorageKeys.centerId
                            );
                            localStorage.removeItem(
                              globals.localStorageKeys.currentUserId
                            );
                            localStorage.removeItem(
                              globals.localStorageKeys.roleId
                            );

                            encodeURIComponent(router.push("/login"));
                          }}
                        >
                          {exitingOut ? "Выход..." : "Выйти"}
                        </span>
                      </div>
                    </div>
                  ) : center !== undefined && center.fullname !== undefined ? (
                    <div className={styles.studentCard}>
                      <Image
                        src={
                          center.img_src || "https://realibi.kz/file/624128.png"
                        }
                        className={styles.studentAvatar}
                      />
                      <div className={styles.studentInfo}>
                        <span
                          className={styles.studentName}
                          onClick={() => router.push("/cabinet")}
                        >
                          {center.title || center.fullname}
                        </span>
                        <span
                          className={styles.exitBtn}
                          onClick={() => {
                            setExitingOut(true);
                            encodeURIComponent(router.push("/login"));
                          }}
                        >
                          {exitingOut ? "Выход..." : "Выйти"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <a onClick={() => router.push("/login")}>Войти</a>
                  )}
                </a>
              </li>
            )}
          </ul>
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
                Каталог
              </a>
            </li>
            <li onClick={handleShow}>
              <a className={styles.link} style={{ color: "black" }}>
                Стать партнером
              </a>
            </li>
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

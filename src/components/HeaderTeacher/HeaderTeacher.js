import styles from "./HeaderTeacher.module.css";
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
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('login')
    localStorage.removeItem('role')
    router.push('/auth')
  }

  useEffect(function () {
    loadUserInfo();
    setLoadingData(false);
    console.log("pathname = " + window.location.pathname);
  }, []);

  console.log(props.teacher);
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
                marginTop: "10px"
              }}
            >
              <svg width="156" height="40" viewBox="0 0 156 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M31.3945 3.05473C28.9357 1.64842 24.9492 1.64842 22.4905 3.05473L2.24206 14.6359C-0.216712 16.0422 -0.216712 18.3222 2.24206 19.7286L2.50265 19.8776L2.18439 20.152C-0.276301 21.6179 -0.216712 23.713 2.24206 25.1193L18.9784 34.6917C21.4371 36.098 25.4236 36.098 27.8824 34.6917L48.1308 23.1106C50.5896 21.7043 50.5896 19.4242 48.1308 18.0179L47.8702 17.8688C47.8702 17.8688 45.5732 19.529 48.1308 17.5058C50.6884 15.4826 50.5566 14.0311 48.1308 12.6271L31.3945 3.05473Z" fill="#087EFF"/>
                <path d="M28.6784 16.8962L20.5134 15.5485C20.1732 15.4923 19.9653 15.2906 20.0491 15.0979C20.0781 15.031 20.1405 14.9711 20.2289 14.9253L26.8328 11.5055C27.0871 11.3738 27.4886 11.3897 27.7295 11.5412C27.8131 11.5937 27.8696 11.6584 27.8922 11.7273L29.4534 16.4949C29.5184 16.6935 29.2921 16.878 28.9478 16.9069C28.8585 16.9144 28.7667 16.9108 28.6784 16.8962Z" fill="white"/>
                <path d="M47 16.3501L48.8301 16.1557C48.6288 17.6069 48.7111 18.3696 49.2071 19.6385L47.377 19.8329L47 16.3501Z" fill="#087EFF"/>
                <path d="M1.09473 17.9929L2.93431 18.0519L2.81998 21.5528L0.980396 21.4939C1.23062 20.372 1.27304 19.6256 1.09473 17.9929Z" fill="#087EFF"/>
                <path d="M2.78141 22.6274L1.78849 22.1101C2.3565 20.9699 2.39727 20.2198 2.12446 18.7617L20.3548 28.3675C22.1051 29.4073 23.4253 29.4664 26.1993 28.2416L48.1129 15.8349C47.8331 17.6479 47.4678 18.656 48.1126 19.5698L26.1993 31.764C23.6817 32.8151 22.3524 32.7929 20.3548 32.0277L2.78141 22.6274Z" fill="white"/>
                <path d="M67.6016 11.1191C70.5371 11.1191 72.9937 12.0991 74.9712 14.0591C76.9487 16.019 77.9375 18.4316 77.9375 21.2969C77.9375 24.1357 76.9487 26.5439 74.9712 28.5215C73.0024 30.499 70.5986 31.4878 67.7598 31.4878C64.8857 31.4878 62.46 30.5034 60.4824 28.5347C58.5049 26.5659 57.5161 24.1841 57.5161 21.3892C57.5161 19.5259 57.9644 17.7988 58.8608 16.208C59.7661 14.6172 60.9966 13.3735 62.5522 12.4771C64.1079 11.5718 65.791 11.1191 67.6016 11.1191ZM67.6938 13.0176C66.2612 13.0176 64.9033 13.3911 63.6201 14.1382C62.3369 14.8853 61.335 15.8916 60.6143 17.1572C59.8936 18.4229 59.5332 19.8335 59.5332 21.3892C59.5332 23.6919 60.3286 25.6387 61.9194 27.2295C63.519 28.8115 65.4438 29.6025 67.6938 29.6025C69.1968 29.6025 70.5854 29.2378 71.8599 28.5083C73.1431 27.7788 74.1406 26.7812 74.8525 25.5156C75.5732 24.25 75.9336 22.8438 75.9336 21.2969C75.9336 19.7588 75.5732 18.3701 74.8525 17.1309C74.1406 15.8828 73.1343 14.8853 71.8335 14.1382C70.5327 13.3911 69.1528 13.0176 67.6938 13.0176ZM82.1694 10.75C82.5913 10.75 82.9517 10.8994 83.2505 11.1982C83.5493 11.4971 83.6987 11.8574 83.6987 12.2793C83.6987 12.6924 83.5493 13.0483 83.2505 13.3472C82.9517 13.646 82.5913 13.7954 82.1694 13.7954C81.7563 13.7954 81.4004 13.646 81.1016 13.3472C80.8027 13.0483 80.6533 12.6924 80.6533 12.2793C80.6533 11.8574 80.8027 11.4971 81.1016 11.1982C81.4004 10.8994 81.7563 10.75 82.1694 10.75ZM81.2466 16.6562H83.1055V31H81.2466V16.6562ZM86.6519 11.1191H88.4976V31H86.6519V11.1191ZM106.625 16.6562V31H104.806V28.5347C104.032 29.4751 103.162 30.1826 102.195 30.6572C101.237 31.1318 100.187 31.3691 99.0444 31.3691C97.0142 31.3691 95.2783 30.6353 93.8369 29.1675C92.4043 27.6909 91.688 25.8979 91.688 23.7886C91.688 21.7231 92.4131 19.9565 93.8633 18.4888C95.3135 17.021 97.0581 16.2871 99.0972 16.2871C100.275 16.2871 101.338 16.5376 102.288 17.0386C103.246 17.5396 104.085 18.291 104.806 19.293V16.6562H106.625ZM99.2422 18.0669C98.2139 18.0669 97.2646 18.3218 96.3945 18.8315C95.5244 19.3325 94.8301 20.04 94.3115 20.9541C93.8018 21.8682 93.5469 22.835 93.5469 23.8545C93.5469 24.8652 93.8062 25.832 94.3247 26.7549C94.8433 27.6777 95.5376 28.3984 96.4077 28.917C97.2866 29.4268 98.2271 29.6816 99.229 29.6816C100.24 29.6816 101.198 29.4268 102.103 28.917C103.008 28.4072 103.703 27.7173 104.186 26.8472C104.678 25.9771 104.924 24.9971 104.924 23.9072C104.924 22.2461 104.375 20.8574 103.276 19.7412C102.187 18.625 100.842 18.0669 99.2422 18.0669ZM110.791 16.6562H112.637V19.2271C113.375 18.2427 114.192 17.5088 115.089 17.0254C115.985 16.5332 116.961 16.2871 118.016 16.2871C119.088 16.2871 120.037 16.5596 120.863 17.1045C121.698 17.6494 122.313 18.3833 122.709 19.3062C123.104 20.229 123.302 21.666 123.302 23.6172V31H121.47V24.1577C121.47 22.5054 121.399 21.4023 121.259 20.8486C121.039 19.8994 120.626 19.1875 120.02 18.7129C119.413 18.2295 118.622 17.9878 117.646 17.9878C116.53 17.9878 115.528 18.3569 114.641 19.0952C113.762 19.8335 113.182 20.7476 112.9 21.8374C112.725 22.5493 112.637 23.8501 112.637 25.7397V31H110.791V16.6562ZM129.301 28.0996C129.749 28.0996 130.131 28.2578 130.448 28.5742C130.764 28.8906 130.922 29.2773 130.922 29.7344C130.922 30.1826 130.764 30.5693 130.448 30.8945C130.131 31.2109 129.749 31.3691 129.301 31.3691C128.853 31.3691 128.47 31.2109 128.154 30.8945C127.837 30.5693 127.679 30.1826 127.679 29.7344C127.679 29.2773 127.837 28.8906 128.154 28.5742C128.47 28.2578 128.853 28.0996 129.301 28.0996ZM135.405 10.75C135.827 10.75 136.187 10.8994 136.486 11.1982C136.785 11.4971 136.934 11.8574 136.934 12.2793C136.934 12.6924 136.785 13.0483 136.486 13.3472C136.187 13.646 135.827 13.7954 135.405 13.7954C134.992 13.7954 134.636 13.646 134.337 13.3472C134.038 13.0483 133.889 12.6924 133.889 12.2793C133.889 11.8574 134.038 11.4971 134.337 11.1982C134.636 10.8994 134.992 10.75 135.405 10.75ZM134.482 16.6562H136.341V31H134.482V16.6562ZM146.954 16.2871C149.16 16.2871 150.988 17.0869 152.438 18.6865C153.756 20.1455 154.416 21.8726 154.416 23.8677C154.416 25.8716 153.717 27.625 152.319 29.1279C150.931 30.6221 149.142 31.3691 146.954 31.3691C144.756 31.3691 142.959 30.6221 141.562 29.1279C140.173 27.625 139.479 25.8716 139.479 23.8677C139.479 21.8813 140.138 20.1587 141.456 18.6997C142.906 17.0913 144.739 16.2871 146.954 16.2871ZM146.954 18.0933C145.424 18.0933 144.11 18.6602 143.012 19.7939C141.913 20.9277 141.364 22.2988 141.364 23.9072C141.364 24.9443 141.614 25.9111 142.115 26.8076C142.616 27.7041 143.293 28.3984 144.146 28.8906C144.998 29.374 145.934 29.6157 146.954 29.6157C147.973 29.6157 148.909 29.374 149.762 28.8906C150.614 28.3984 151.291 27.7041 151.792 26.8076C152.293 25.9111 152.543 24.9443 152.543 23.9072C152.543 22.2988 151.99 20.9277 150.882 19.7939C149.784 18.6602 148.474 18.0933 146.954 18.0933Z" fill="#212121"/>
              </svg>
            </a>
          {/* </Link> */}
        </div>
        <div className={styles.menu}>
          <ul className={styles.menu_ul}>
            <li>
              <Link
                href={`/cabinet/teacher/${encodeURIComponent(props?.teacher?.url)}`}
                target="_blank"
                className={styles.titleLink}
              >
                <a className={styles.link} style={{ color: "black" }}>
                  Главная
                </a>
              </Link>
            </li>
            <li>
              <Link
                href={`/cabinet/teacher/${encodeURIComponent(props?.teacher?.url)}`}
                target="_blank"
                className={styles.titleLink}
              >
                <a
                  onClick={() =>
                    setTimeout(() => {
                      router.push("#students");
                    }, props.isInMainPage ? 0 : 1000)
                  }
                  className={styles.link}
                  style={{ color: "black" }}
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
              >
                Домашние задания
              </Link>
            </li>
          </ul>
        </div>
        <div 
          className={styles.contact} 
          onClick={() => setMenuVisible(!menuVisible)}
        >
          <div 
            className={styles.contactImage}
            style={{
              backgroundImage: props.teacher?.avatar !== null ? "url(" + props.teacher?.avatar + ")" : "url(https://realibi.kz/file/142617.png)",
            }}
          />
          <div className={styles.contactDetails}>
            <b className={styles.contactName}>
              {props.teacher?.name} {props.teacher?.surname}
            </b>
            <span className={styles.contactRole}>Преподаватель</span>
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
                href={`/cabinet/teacher/${encodeURIComponent(props?.teacher?.url)}`}
                target="_blank"
                className={styles.titleLink}
              >
                <a className={styles.link} style={{ color: "black" }}>
                  Главная
                </a>
              </Link>
            </li>
            <li>
              <Link
                href={`/cabinet/teacher/${encodeURIComponent(props?.teacher?.url)}`}
                target="_blank"
                className={styles.titleLink}
              >
                <a
                  onClick={() =>
                    setTimeout(() => {
                      router.push("#students");
                    }, 300)
                  }
                  className={styles.link}
                  style={{ color: "black" }}
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
              >
                Домашние задания
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    <div className={styles.dropMenu}>
      {menuVisible && (
        <ul className={classnames(styles.menu, {[styles.menuActive]: menuVisible})}>
          <li className={styles.li}>Профиль</li>
          <li className={styles.li} onClick={handleLogout}>Выйти</li>
        </ul>
      )}
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

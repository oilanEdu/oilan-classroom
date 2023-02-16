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
              <svg width="220" height="40" viewBox="0 0 438 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M88.85 35.5C88.85 31 89.6167 27.7 91.15 25.6C92.7167 23.4667 94.9333 22.4 97.8 22.4C100.867 22.4 103.117 23.4833 104.55 25.65C106.017 27.8167 106.75 31.1 106.75 35.5C106.75 40.0333 105.967 43.35 104.4 45.45C102.833 47.55 100.633 48.6 97.8 48.6C94.7333 48.6 92.4667 47.5167 91 45.35C89.5667 43.1833 88.85 39.9 88.85 35.5ZM92.6 35.5C92.6 36.9667 92.6833 38.3 92.85 39.5C93.05 40.7 93.35 41.7333 93.75 42.6C94.1833 43.4667 94.7333 44.15 95.4 44.65C96.0667 45.1167 96.8667 45.35 97.8 45.35C99.5333 45.35 100.833 44.5833 101.7 43.05C102.567 41.4833 103 38.9667 103 35.5C103 34.0667 102.9 32.75 102.7 31.55C102.533 30.3167 102.233 29.2667 101.8 28.4C101.4 27.5333 100.867 26.8667 100.2 26.4C99.5333 25.9 98.7333 25.65 97.8 25.65C96.1 25.65 94.8 26.4333 93.9 28C93.0333 29.5667 92.6 32.0667 92.6 35.5Z" fill="#2F2F2F"/>
                <path d="M112.132 23H115.732V48H112.132V23ZM111.482 15.4C111.482 14.6 111.699 13.95 112.132 13.45C112.599 12.95 113.199 12.7 113.932 12.7C114.665 12.7 115.265 12.95 115.732 13.45C116.232 13.9167 116.482 14.5667 116.482 15.4C116.482 16.2 116.232 16.8333 115.732 17.3C115.265 17.7333 114.665 17.95 113.932 17.95C113.199 17.95 112.599 17.7167 112.132 17.25C111.699 16.7833 111.482 16.1667 111.482 15.4Z" fill="#2F2F2F"/>
                <path d="M126.222 42.05C126.222 43.2167 126.372 44.05 126.672 44.55C127.005 45.05 127.455 45.3 128.022 45.3C128.722 45.3 129.539 45.1167 130.472 44.75L130.822 47.65C130.389 47.9167 129.772 48.1333 128.972 48.3C128.205 48.4667 127.505 48.55 126.872 48.55C125.605 48.55 124.572 48.1667 123.772 47.4C123.005 46.6 122.622 45.2167 122.622 43.25V13H126.222V42.05Z" fill="#2F2F2F"/>
                <path d="M133.792 24.5C134.758 23.9 135.925 23.4333 137.292 23.1C138.692 22.7667 140.158 22.6 141.692 22.6C143.092 22.6 144.208 22.8167 145.042 23.25C145.908 23.65 146.575 24.2167 147.042 24.95C147.542 25.65 147.858 26.4667 147.992 27.4C148.158 28.3 148.242 29.25 148.242 30.25C148.242 32.25 148.192 34.2 148.092 36.1C148.025 38 147.992 39.8 147.992 41.5C147.992 42.7667 148.025 43.95 148.092 45.05C148.192 46.1167 148.358 47.1333 148.592 48.1H145.842L144.992 45.15H144.792C144.292 46.0167 143.558 46.7667 142.592 47.4C141.625 48.0333 140.325 48.35 138.692 48.35C136.892 48.35 135.408 47.7333 134.242 46.5C133.108 45.2333 132.542 43.5 132.542 41.3C132.542 39.8667 132.775 38.6667 133.242 37.7C133.742 36.7333 134.425 35.95 135.292 35.35C136.192 34.75 137.242 34.3333 138.442 34.1C139.675 33.8333 141.042 33.7 142.542 33.7C142.875 33.7 143.208 33.7 143.542 33.7C143.875 33.7 144.225 33.7167 144.592 33.75C144.692 32.7167 144.742 31.8 144.742 31C144.742 29.1 144.458 27.7667 143.892 27C143.325 26.2333 142.292 25.85 140.792 25.85C139.858 25.85 138.842 26 137.742 26.3C136.642 26.5667 135.725 26.9167 134.992 27.35L133.792 24.5ZM144.642 36.6C144.308 36.5667 143.975 36.55 143.642 36.55C143.308 36.5167 142.975 36.5 142.642 36.5C141.842 36.5 141.058 36.5667 140.292 36.7C139.525 36.8333 138.842 37.0667 138.242 37.4C137.642 37.7333 137.158 38.1833 136.792 38.75C136.458 39.3167 136.292 40.0333 136.292 40.9C136.292 42.2333 136.608 43.2667 137.242 44C137.908 44.7333 138.758 45.1 139.792 45.1C141.192 45.1 142.275 44.7667 143.042 44.1C143.808 43.4333 144.342 42.7 144.642 41.9V36.6Z" fill="#2F2F2F"/>
                <path d="M166.861 48V32.75C166.861 30.25 166.561 28.45 165.961 27.35C165.395 26.2167 164.361 25.65 162.861 25.65C161.528 25.65 160.428 26.05 159.561 26.85C158.695 27.65 158.061 28.6333 157.661 29.8V48H154.061V23H156.661L157.311 25.65H157.461C158.095 24.75 158.945 23.9833 160.011 23.35C161.111 22.7167 162.411 22.4 163.911 22.4C164.978 22.4 165.911 22.55 166.711 22.85C167.545 23.15 168.228 23.6667 168.761 24.4C169.328 25.1 169.745 26.05 170.011 27.25C170.311 28.45 170.461 29.9667 170.461 31.8V48H166.861Z" fill="#2F2F2F"/>
                <path d="M175.434 32H185.284V35.45H175.434V32Z" fill="#2F2F2F"/>
                <path d="M204.385 46.75C203.551 47.3833 202.601 47.85 201.535 48.15C200.468 48.45 199.351 48.6 198.185 48.6C196.585 48.6 195.235 48.3 194.135 47.7C193.035 47.0667 192.135 46.1833 191.435 45.05C190.768 43.8833 190.268 42.5 189.935 40.9C189.635 39.2667 189.485 37.4667 189.485 35.5C189.485 31.2333 190.235 27.9833 191.735 25.75C193.268 23.5167 195.451 22.4 198.285 22.4C199.585 22.4 200.701 22.5167 201.635 22.75C202.568 22.9833 203.368 23.2833 204.035 23.65L203.035 26.8C201.701 26.0333 200.251 25.65 198.685 25.65C196.885 25.65 195.518 26.45 194.585 28.05C193.685 29.6167 193.235 32.1 193.235 35.5C193.235 36.8667 193.335 38.15 193.535 39.35C193.735 40.55 194.068 41.6 194.535 42.5C195.001 43.3667 195.601 44.0667 196.335 44.6C197.068 45.1 197.985 45.35 199.085 45.35C199.951 45.35 200.751 45.2 201.485 44.9C202.251 44.6 202.868 44.25 203.335 43.85L204.385 46.75Z" fill="#2F2F2F"/>
                <path d="M212.257 42.05C212.257 43.2167 212.407 44.05 212.707 44.55C213.04 45.05 213.49 45.3 214.057 45.3C214.757 45.3 215.574 45.1167 216.507 44.75L216.857 47.65C216.424 47.9167 215.807 48.1333 215.007 48.3C214.24 48.4667 213.54 48.55 212.907 48.55C211.64 48.55 210.607 48.1667 209.807 47.4C209.04 46.6 208.657 45.2167 208.657 43.25V13H212.257V42.05Z" fill="#2F2F2F"/>
                <path d="M219.827 24.5C220.794 23.9 221.96 23.4333 223.327 23.1C224.727 22.7667 226.194 22.6 227.727 22.6C229.127 22.6 230.244 22.8167 231.077 23.25C231.944 23.65 232.61 24.2167 233.077 24.95C233.577 25.65 233.894 26.4667 234.027 27.4C234.194 28.3 234.277 29.25 234.277 30.25C234.277 32.25 234.227 34.2 234.127 36.1C234.06 38 234.027 39.8 234.027 41.5C234.027 42.7667 234.06 43.95 234.127 45.05C234.227 46.1167 234.394 47.1333 234.627 48.1H231.877L231.027 45.15H230.827C230.327 46.0167 229.594 46.7667 228.627 47.4C227.66 48.0333 226.36 48.35 224.727 48.35C222.927 48.35 221.444 47.7333 220.277 46.5C219.144 45.2333 218.577 43.5 218.577 41.3C218.577 39.8667 218.81 38.6667 219.277 37.7C219.777 36.7333 220.46 35.95 221.327 35.35C222.227 34.75 223.277 34.3333 224.477 34.1C225.71 33.8333 227.077 33.7 228.577 33.7C228.91 33.7 229.244 33.7 229.577 33.7C229.91 33.7 230.26 33.7167 230.627 33.75C230.727 32.7167 230.777 31.8 230.777 31C230.777 29.1 230.494 27.7667 229.927 27C229.36 26.2333 228.327 25.85 226.827 25.85C225.894 25.85 224.877 26 223.777 26.3C222.677 26.5667 221.76 26.9167 221.027 27.35L219.827 24.5ZM230.677 36.6C230.344 36.5667 230.01 36.55 229.677 36.55C229.344 36.5167 229.01 36.5 228.677 36.5C227.877 36.5 227.094 36.5667 226.327 36.7C225.56 36.8333 224.877 37.0667 224.277 37.4C223.677 37.7333 223.194 38.1833 222.827 38.75C222.494 39.3167 222.327 40.0333 222.327 40.9C222.327 42.2333 222.644 43.2667 223.277 44C223.944 44.7333 224.794 45.1 225.827 45.1C227.227 45.1 228.31 44.7667 229.077 44.1C229.844 43.4333 230.377 42.7 230.677 41.9V36.6Z" fill="#2F2F2F"/>
                <path d="M239.696 43.9C240.363 44.3 241.146 44.65 242.046 44.95C242.98 45.2167 243.93 45.35 244.896 45.35C245.996 45.35 246.93 45.0833 247.696 44.55C248.463 43.9833 248.846 43.0833 248.846 41.85C248.846 40.8167 248.613 39.9667 248.146 39.3C247.68 38.6333 247.08 38.0333 246.346 37.5C245.646 36.9667 244.88 36.4833 244.046 36.05C243.213 35.5833 242.43 35.0333 241.696 34.4C240.996 33.7667 240.413 33.0167 239.946 32.15C239.48 31.2833 239.246 30.1833 239.246 28.85C239.246 26.7167 239.813 25.1167 240.946 24.05C242.113 22.95 243.746 22.4 245.846 22.4C247.213 22.4 248.396 22.5333 249.396 22.8C250.396 23.0333 251.263 23.3667 251.996 23.8L251.046 26.8C250.413 26.4667 249.68 26.2 248.846 26C248.013 25.7667 247.163 25.65 246.296 25.65C245.096 25.65 244.213 25.9 243.646 26.4C243.113 26.9 242.846 27.6833 242.846 28.75C242.846 29.5833 243.08 30.3 243.546 30.9C244.013 31.4667 244.596 32 245.296 32.5C246.03 32.9667 246.813 33.45 247.646 33.95C248.48 34.45 249.246 35.05 249.946 35.75C250.68 36.4167 251.28 37.2333 251.746 38.2C252.213 39.1333 252.446 40.3167 252.446 41.75C252.446 42.6833 252.296 43.5667 251.996 44.4C251.696 45.2333 251.23 45.9667 250.596 46.6C249.996 47.2 249.23 47.6833 248.296 48.05C247.396 48.4167 246.33 48.6 245.096 48.6C243.63 48.6 242.363 48.45 241.296 48.15C240.23 47.8833 239.33 47.5167 238.596 47.05L239.696 43.9Z" fill="#2F2F2F"/>
                <path d="M256.591 43.9C257.258 44.3 258.041 44.65 258.941 44.95C259.874 45.2167 260.824 45.35 261.791 45.35C262.891 45.35 263.824 45.0833 264.591 44.55C265.358 43.9833 265.741 43.0833 265.741 41.85C265.741 40.8167 265.508 39.9667 265.041 39.3C264.574 38.6333 263.974 38.0333 263.241 37.5C262.541 36.9667 261.774 36.4833 260.941 36.05C260.108 35.5833 259.324 35.0333 258.591 34.4C257.891 33.7667 257.308 33.0167 256.841 32.15C256.374 31.2833 256.141 30.1833 256.141 28.85C256.141 26.7167 256.708 25.1167 257.841 24.05C259.008 22.95 260.641 22.4 262.741 22.4C264.108 22.4 265.291 22.5333 266.291 22.8C267.291 23.0333 268.158 23.3667 268.891 23.8L267.941 26.8C267.308 26.4667 266.574 26.2 265.741 26C264.908 25.7667 264.058 25.65 263.191 25.65C261.991 25.65 261.108 25.9 260.541 26.4C260.008 26.9 259.741 27.6833 259.741 28.75C259.741 29.5833 259.974 30.3 260.441 30.9C260.908 31.4667 261.491 32 262.191 32.5C262.924 32.9667 263.708 33.45 264.541 33.95C265.374 34.45 266.141 35.05 266.841 35.75C267.574 36.4167 268.174 37.2333 268.641 38.2C269.108 39.1333 269.341 40.3167 269.341 41.75C269.341 42.6833 269.191 43.5667 268.891 44.4C268.591 45.2333 268.124 45.9667 267.491 46.6C266.891 47.2 266.124 47.6833 265.191 48.05C264.291 48.4167 263.224 48.6 261.991 48.6C260.524 48.6 259.258 48.45 258.191 48.15C257.124 47.8833 256.224 47.5167 255.491 47.05L256.591 43.9Z" fill="#2F2F2F"/>
                <path d="M273.886 23H276.436L277.086 25.65H277.236C277.702 24.6833 278.302 23.9333 279.036 23.4C279.802 22.8333 280.719 22.55 281.786 22.55C282.552 22.55 283.419 22.7 284.386 23L283.686 26.65C282.819 26.35 282.052 26.2 281.386 26.2C280.319 26.2 279.452 26.5167 278.786 27.15C278.119 27.75 277.686 28.5667 277.486 29.6V48H273.886V23Z" fill="#2F2F2F"/>
                <path d="M286.506 35.5C286.506 31 287.273 27.7 288.806 25.6C290.373 23.4667 292.59 22.4 295.456 22.4C298.523 22.4 300.773 23.4833 302.206 25.65C303.673 27.8167 304.406 31.1 304.406 35.5C304.406 40.0333 303.623 43.35 302.056 45.45C300.49 47.55 298.29 48.6 295.456 48.6C292.39 48.6 290.123 47.5167 288.656 45.35C287.223 43.1833 286.506 39.9 286.506 35.5ZM290.256 35.5C290.256 36.9667 290.34 38.3 290.506 39.5C290.706 40.7 291.006 41.7333 291.406 42.6C291.84 43.4667 292.39 44.15 293.056 44.65C293.723 45.1167 294.523 45.35 295.456 45.35C297.19 45.35 298.49 44.5833 299.356 43.05C300.223 41.4833 300.656 38.9667 300.656 35.5C300.656 34.0667 300.556 32.75 300.356 31.55C300.19 30.3167 299.89 29.2667 299.456 28.4C299.056 27.5333 298.523 26.8667 297.856 26.4C297.19 25.9 296.39 25.65 295.456 25.65C293.756 25.65 292.456 26.4333 291.556 28C290.69 29.5667 290.256 32.0667 290.256 35.5Z" fill="#2F2F2F"/>
                <path d="M308.088 35.5C308.088 31 308.855 27.7 310.388 25.6C311.955 23.4667 314.172 22.4 317.038 22.4C320.105 22.4 322.355 23.4833 323.788 25.65C325.255 27.8167 325.988 31.1 325.988 35.5C325.988 40.0333 325.205 43.35 323.638 45.45C322.072 47.55 319.872 48.6 317.038 48.6C313.972 48.6 311.705 47.5167 310.238 45.35C308.805 43.1833 308.088 39.9 308.088 35.5ZM311.838 35.5C311.838 36.9667 311.922 38.3 312.088 39.5C312.288 40.7 312.588 41.7333 312.988 42.6C313.422 43.4667 313.972 44.15 314.638 44.65C315.305 45.1167 316.105 45.35 317.038 45.35C318.772 45.35 320.072 44.5833 320.938 43.05C321.805 41.4833 322.238 38.9667 322.238 35.5C322.238 34.0667 322.138 32.75 321.938 31.55C321.772 30.3167 321.472 29.2667 321.038 28.4C320.638 27.5333 320.105 26.8667 319.438 26.4C318.772 25.9 317.972 25.65 317.038 25.65C315.338 25.65 314.038 26.4333 313.138 28C312.272 29.5667 311.838 32.0667 311.838 35.5Z" fill="#2F2F2F"/>
                <path d="M342.47 48V33.15C342.47 31.8167 342.42 30.6833 342.32 29.75C342.254 28.7833 342.087 28 341.82 27.4C341.554 26.8 341.187 26.3667 340.72 26.1C340.254 25.8 339.637 25.65 338.87 25.65C337.737 25.65 336.77 26.1 335.97 27C335.204 27.8667 334.67 28.8667 334.37 30V48H330.77V23H333.32L333.97 25.65H334.12C334.82 24.6833 335.654 23.9 336.62 23.3C337.587 22.7 338.82 22.4 340.32 22.4C341.587 22.4 342.62 22.6833 343.42 23.25C344.254 23.7833 344.904 24.75 345.37 26.15C345.97 24.9833 346.82 24.0667 347.92 23.4C349.054 22.7333 350.287 22.4 351.62 22.4C352.72 22.4 353.654 22.55 354.42 22.85C355.22 23.1167 355.854 23.6167 356.32 24.35C356.82 25.05 357.187 26 357.42 27.2C357.654 28.3667 357.77 29.85 357.77 31.65V48H354.17V32.1C354.17 29.9333 353.954 28.3167 353.52 27.25C353.12 26.1833 352.17 25.65 350.67 25.65C349.404 25.65 348.387 26.05 347.62 26.85C346.887 27.6167 346.37 28.6667 346.07 30V48H342.47Z" fill="#2F2F2F"/>
                <path d="M362.339 45.75C362.339 44.8167 362.555 44.1167 362.989 43.65C363.455 43.1833 364.072 42.95 364.839 42.95C365.605 42.95 366.205 43.1833 366.639 43.65C367.105 44.1167 367.339 44.8167 367.339 45.75C367.339 46.7167 367.105 47.4333 366.639 47.9C366.205 48.3667 365.605 48.6 364.839 48.6C364.072 48.6 363.455 48.3667 362.989 47.9C362.555 47.4333 362.339 46.7167 362.339 45.75Z" fill="#2F2F2F"/>
                <path d="M386.025 46.75C385.192 47.3833 384.242 47.85 383.175 48.15C382.109 48.45 380.992 48.6 379.825 48.6C378.225 48.6 376.875 48.3 375.775 47.7C374.675 47.0667 373.775 46.1833 373.075 45.05C372.409 43.8833 371.909 42.5 371.575 40.9C371.275 39.2667 371.125 37.4667 371.125 35.5C371.125 31.2333 371.875 27.9833 373.375 25.75C374.909 23.5167 377.092 22.4 379.925 22.4C381.225 22.4 382.342 22.5167 383.275 22.75C384.209 22.9833 385.009 23.2833 385.675 23.65L384.675 26.8C383.342 26.0333 381.892 25.65 380.325 25.65C378.525 25.65 377.159 26.45 376.225 28.05C375.325 29.6167 374.875 32.1 374.875 35.5C374.875 36.8667 374.975 38.15 375.175 39.35C375.375 40.55 375.709 41.6 376.175 42.5C376.642 43.3667 377.242 44.0667 377.975 44.6C378.709 45.1 379.625 45.35 380.725 45.35C381.592 45.35 382.392 45.2 383.125 44.9C383.892 44.6 384.509 44.25 384.975 43.85L386.025 46.75Z" fill="#2F2F2F"/>
                <path d="M388.118 35.5C388.118 31 388.884 27.7 390.418 25.6C391.984 23.4667 394.201 22.4 397.068 22.4C400.134 22.4 402.384 23.4833 403.818 25.65C405.284 27.8167 406.018 31.1 406.018 35.5C406.018 40.0333 405.234 43.35 403.668 45.45C402.101 47.55 399.901 48.6 397.068 48.6C394.001 48.6 391.734 47.5167 390.268 45.35C388.834 43.1833 388.118 39.9 388.118 35.5ZM391.868 35.5C391.868 36.9667 391.951 38.3 392.118 39.5C392.318 40.7 392.618 41.7333 393.018 42.6C393.451 43.4667 394.001 44.15 394.668 44.65C395.334 45.1167 396.134 45.35 397.068 45.35C398.801 45.35 400.101 44.5833 400.968 43.05C401.834 41.4833 402.268 38.9667 402.268 35.5C402.268 34.0667 402.168 32.75 401.968 31.55C401.801 30.3167 401.501 29.2667 401.068 28.4C400.668 27.5333 400.134 26.8667 399.468 26.4C398.801 25.9 398.001 25.65 397.068 25.65C395.368 25.65 394.068 26.4333 393.168 28C392.301 29.5667 391.868 32.0667 391.868 35.5Z" fill="#2F2F2F"/>
                <path d="M422.5 48V33.15C422.5 31.8167 422.45 30.6833 422.35 29.75C422.283 28.7833 422.116 28 421.85 27.4C421.583 26.8 421.216 26.3667 420.75 26.1C420.283 25.8 419.666 25.65 418.9 25.65C417.766 25.65 416.8 26.1 416 27C415.233 27.8667 414.7 28.8667 414.4 30V48H410.8V23H413.35L414 25.65H414.15C414.85 24.6833 415.683 23.9 416.65 23.3C417.616 22.7 418.85 22.4 420.35 22.4C421.616 22.4 422.65 22.6833 423.45 23.25C424.283 23.7833 424.933 24.75 425.4 26.15C426 24.9833 426.85 24.0667 427.95 23.4C429.083 22.7333 430.316 22.4 431.65 22.4C432.75 22.4 433.683 22.55 434.45 22.85C435.25 23.1167 435.883 23.6167 436.35 24.35C436.85 25.05 437.216 26 437.45 27.2C437.683 28.3667 437.8 29.85 437.8 31.65V48H434.2V32.1C434.2 29.9333 433.983 28.3167 433.55 27.25C433.15 26.1833 432.2 25.65 430.7 25.65C429.433 25.65 428.416 26.05 427.65 26.85C426.916 27.6167 426.4 28.6667 426.1 30V48H422.5Z" fill="#2F2F2F"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M37.3912 0.000793078C36.9823 0.0168527 36.5923 0.175148 36.2878 0.448153L1.36271 31.8113C1.00023 32.0539 0.740995 32.4232 0.635472 32.8465L0.625149 32.8677L0.615399 32.9073C0.572384 33.0707 0 35.3145 0 38.3197C0 41.4385 0.629171 43.7912 0.629171 43.7912C0.774849 44.3361 1.17288 44.7777 1.69939 44.979L36.4718 58.2408C37.0866 58.4759 37.7811 58.3463 38.2715 57.907L73.4007 26.3633C73.8629 25.9583 74.0803 25.3407 73.9731 24.7356C73.8658 24.1299 73.4506 23.6246 72.877 23.4032V23.4015L72.803 23.374L71.6698 22.941C71.6199 22.3858 71.5797 21.7956 71.5797 21.1201C71.5797 19.7425 71.7128 18.5615 71.8464 17.7208L73.3989 16.3271C73.8543 15.9176 74.0636 15.3005 73.9512 14.6988C73.8394 14.0966 73.4219 13.5965 72.8495 13.3786L38.08 0.114469C37.8627 0.0318803 37.6315 -0.00654615 37.3998 0.000909577H37.3895L37.3912 0.000793078ZM69.3591 19.9615C69.3413 20.3322 69.3298 20.7184 69.3298 21.1188C69.3298 22.7053 69.495 24.0559 69.6533 25.0103L36.728 54.5763L3.9392 42.0692C3.92908 42.0256 3.91778 41.9785 3.90555 41.9276C3.76957 41.3613 1.97007 41.9234 1.97007 39.9206C1.97007 38.8962 2.05151 38.0371 2.14442 37.3018L34.9288 49.8048C35.5436 50.0399 36.2382 49.9109 36.728 49.4716L69.3591 19.9615Z" fill="#007AFF"/>
                <path d="M69.3298 21.1188C69.3298 20.7184 69.3413 20.3322 69.3591 19.9615L36.728 49.4716C36.2382 49.9109 35.5436 50.0399 34.9288 49.8048L2.14442 37.3018C2.05151 38.0371 1.97007 38.8962 1.97007 39.9206C1.97007 41.9234 3.76957 41.3613 3.90555 41.9276C3.91778 41.9785 3.92908 42.0256 3.9392 42.0692L36.728 54.5763L69.6533 25.0103C69.495 24.0559 69.3298 22.7053 69.3298 21.1188Z" fill="#007AFF"/>
                <path d="M69.3298 21.1188C69.3298 20.7184 69.3413 20.3322 69.3591 19.9615L36.728 49.4716C36.2382 49.9109 35.5436 50.0399 34.9288 49.8048L2.14442 37.3018C2.05151 38.0371 1.97007 38.8962 1.97007 39.9206C1.97007 41.9234 3.76957 41.3613 3.90555 41.9276C3.91778 41.9785 3.92908 42.0256 3.9392 42.0692L36.728 54.5763L69.6533 25.0103C69.495 24.0559 69.3298 22.7053 69.3298 21.1188Z" fill="white"/>
                <path d="M41.236 25.2785L28.3975 26.3321C27.8626 26.376 27.4715 26.1478 27.5238 25.8224C27.542 25.7094 27.6132 25.5945 27.7289 25.4912L36.3806 17.7696C36.7139 17.4721 37.3259 17.3437 37.7475 17.4827C37.8939 17.531 38.0039 17.6079 38.0645 17.7044L42.2512 24.3724C42.4256 24.6502 42.155 25.0173 41.6466 25.1924C41.5148 25.2378 41.3747 25.2672 41.236 25.2785Z" fill="white"/>
              </svg>
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

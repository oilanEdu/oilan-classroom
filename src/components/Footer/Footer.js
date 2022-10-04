import styles from './Footer.module.css'
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {BecomeAPartner} from "../BecomeAPartner/BecomeAPartner";
import ModalWindow from "../ModalWindow/ModalWindow";
import {CourseSearchForm} from "../CourseSearchForm/CourseSearchForm";
import {default as axios} from "axios";
import globals from "../../globals";
import {useRouter} from "next/router";
import classnames from 'classnames';

export default function Footer(props) {
  const router = useRouter();

  const [show, setShow] = useState(false);
  const [showCourseSearchModal, setCourseSearchModal] = useState(false);
  const [filters, setFilters] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCourseSearchModalClose = () => setCourseSearchModal(false);

  const loadFilters = async () => {
    let result = await axios.get(`${globals.productionServerDomain}/filters`);
    setFilters(result.data);
  }

  useEffect(() => {
    loadFilters();
  }, []);

  return (
    <div className={styles.container}>
      <ModalWindow 
        show={show} 
        handleClose={handleClose} 
        heading={''} 
        body={<BecomeAPartner handleClose={handleClose}/>}
      />
      <ModalWindow
        show={showCourseSearchModal}
        handleClose={handleCourseSearchModalClose}
        heading={''}
        body={<CourseSearchForm 
          handleClose={handleCourseSearchModalClose} 
          cities={filters[0]}
          directions={filters[1]}
        />}
      />
      <div className={styles.logo}>
        <Link href="/">
          <a 
            // onClick={async() => {await router.push("https://www.oilan.io/")}} 
            style={{alignContent: 'center', alignItems: 'flex-start', display: 'flex'}}
          >
            <svg className={styles.primary_logo} width="158" viewBox="0 0 188 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M168.759 59.594C165.245 59.594 162.049 58.8059 159.173 57.2295C156.343 55.653 154.106 53.4236 152.463 50.5412C150.865 47.6136 150.067 44.2357 150.067 40.4075C150.067 36.6242 150.888 33.2913 152.532 30.4089C154.221 27.4813 156.503 25.2519 159.379 23.7206C162.255 22.1442 165.473 21.3561 169.033 21.3561C172.594 21.3561 175.812 22.1442 178.688 23.7206C181.564 25.2519 183.823 27.4589 185.467 30.3413C187.155 33.2237 188 36.5793 188 40.4075C188 44.2357 187.133 47.6136 185.398 50.5412C183.709 53.4236 181.404 55.653 178.482 57.2295C175.561 58.8059 172.32 59.594 168.759 59.594ZM168.759 54.1894C170.996 54.1894 173.096 53.6715 175.059 52.6355C177.022 51.5996 178.596 50.0457 179.783 47.974C181.016 45.9023 181.632 43.3801 181.632 40.4075C181.632 37.4349 181.039 34.9127 179.852 32.841C178.665 30.7693 177.113 29.2378 175.196 28.247C173.279 27.2111 171.201 26.6932 168.965 26.6932C166.682 26.6932 164.583 27.2111 162.665 28.247C160.794 29.2378 159.287 30.7693 158.146 32.841C157.005 34.9127 156.434 37.4349 156.434 40.4075C156.434 43.425 156.982 45.9699 158.078 48.0416C159.219 50.1133 160.725 51.6671 162.597 52.7031C164.468 53.6939 166.523 54.1894 168.759 54.1894Z" fill="#007AFF"/>
              <path d="M18.6928 59.5056C15.1779 59.5056 11.9826 58.7175 9.10676 57.1411C6.27658 55.5647 4.03984 53.3352 2.39652 50.4528C0.798832 47.5252 0 44.1473 0 40.3191C0 36.5359 0.821663 33.2029 2.46499 30.3205C4.15396 27.3929 6.43636 25.1635 9.31218 23.6322C12.188 22.0558 15.4062 21.2677 18.9667 21.2677C22.5273 21.2677 25.7454 22.0558 28.6213 23.6322C31.4971 25.1635 33.7567 27.3705 35.4 30.2529C37.0889 33.1354 37.9334 36.4909 37.9334 40.3191C37.9334 44.1473 37.0662 47.5252 35.3315 50.4528C33.6426 53.3352 31.3372 55.5647 28.4158 57.1411C25.4945 58.7175 22.2534 59.5056 18.6928 59.5056ZM18.6928 54.101C20.9295 54.101 23.0295 53.5831 24.9922 52.5471C26.955 51.5112 28.5299 49.9573 29.7168 47.8856C30.9493 45.8139 31.5656 43.2917 31.5656 40.3191C31.5656 37.3466 30.9722 34.8243 29.7853 32.7526C28.5984 30.6809 27.0464 29.1494 25.1292 28.1586C23.212 27.1227 21.1349 26.6048 18.8982 26.6048C16.6158 26.6048 14.516 27.1227 12.5988 28.1586C10.7273 29.1494 9.22088 30.6809 8.07969 32.7526C6.93849 34.8243 6.36789 37.3466 6.36789 40.3191C6.36789 43.3366 6.91566 45.8815 8.01121 47.9532C9.1524 50.0249 10.6588 51.5787 12.5304 52.6147C14.4019 53.6055 16.4561 54.101 18.6928 54.101Z" fill="#007AFF"/>
              <path d="M46.2625 12.2194V59.4259H38.8918V12.2194H46.2625ZM49.28 41.6915C49.28 38.1617 50.0128 35.0358 51.4783 32.314C52.9871 29.5922 55.013 27.4871 57.5561 25.9986C60.1423 24.4675 62.9872 23.702 66.0906 23.702C68.8924 23.702 71.3277 24.2549 73.3967 25.3606C75.5088 26.4239 77.1898 27.7635 78.4398 29.3796V24.2762H85.8752V59.4259H78.4398V54.1949C77.1898 55.8535 75.4872 57.2357 73.332 58.3414C71.1769 59.4471 68.72 60 65.9613 60C62.901 60 60.0992 59.2345 57.5561 57.7035C55.013 56.1299 52.9871 53.961 51.4783 51.1966C50.0128 48.3898 49.28 45.2214 49.28 41.6915ZM78.4398 41.8191C78.4398 39.395 77.9226 37.2899 76.8881 35.5037C75.8967 33.7175 74.5821 32.3566 72.9441 31.4209C71.3062 30.4853 69.5389 30.0175 67.6424 30.0175C65.7458 30.0175 63.9786 30.4853 62.3406 31.4209C60.7027 32.314 59.3662 33.6537 58.3318 35.4399C57.3406 37.1835 56.8449 39.2674 56.8449 41.6915C56.8449 44.1157 57.3406 46.2421 58.3318 48.0708C59.3662 49.8995 60.7027 51.3029 62.3406 52.2811C64.0217 53.2167 65.7889 53.6845 67.6424 53.6845C69.5389 53.6845 71.3062 53.2167 72.9441 52.2811C74.5821 51.3455 75.8967 49.9846 76.8881 48.1984C77.9226 46.3697 78.4398 44.2432 78.4398 41.8191ZM109.328 23.702C112.13 23.702 114.63 24.2762 116.828 25.4244C119.069 26.5727 120.815 28.2738 122.065 30.5278C123.315 32.7818 123.94 35.5037 123.94 38.6933V59.4259H116.634V39.7778C116.634 36.6307 115.836 34.2278 114.242 32.5692C112.647 30.8681 110.47 30.0175 107.711 30.0175C104.953 30.0175 102.755 30.8681 101.117 32.5692C99.5218 34.2278 98.7243 36.6307 98.7243 39.7778V59.4259H91.3536V24.2762H98.7243V28.2951C99.9312 26.8491 101.461 25.7221 103.315 24.9141C105.211 24.1061 107.216 23.702 109.328 23.702Z" fill="#007AFF"/>
              <path d="M142.631 21.0685C141.4 21.0685 140.367 20.6435 139.532 19.7934C138.698 18.9433 138.28 17.8908 138.28 16.636C138.28 15.3811 138.698 14.3287 139.532 13.4786C140.367 12.6285 141.4 12.2035 142.631 12.2035C143.824 12.2035 144.837 12.6285 145.671 13.4786C146.506 14.3287 146.923 15.3811 146.923 16.636C146.923 17.8908 146.506 18.9433 145.671 19.7934C144.837 20.6435 143.824 21.0685 142.631 21.0685ZM145.969 25.501V58.9573H139.174V25.501H145.969Z" fill="#007AFF"/>
              <path d="M129.076 58.6737C128.466 58.054 128.16 57.3071 128.16 56.4332C128.16 55.5592 128.466 54.8204 129.076 54.2165C129.686 53.5968 130.425 53.287 131.292 53.287C132.159 53.287 132.898 53.5968 133.508 54.2165C134.119 54.8204 134.424 55.5592 134.424 56.4332C134.424 57.3071 134.119 58.054 133.508 58.6737C132.898 59.2775 132.159 59.5794 131.292 59.5794C130.425 59.5794 129.686 59.2775 129.076 58.6737Z" fill="#007AFF"/>
              <path d="M18.8943 7.43804C17.8271 7.43804 16.9321 7.08142 16.2091 6.36818C15.4862 5.65495 15.1247 4.77188 15.1247 3.71902C15.1247 2.66615 15.4862 1.78309 16.2091 1.06986C16.9321 0.356619 17.8271 0 18.8943 0C19.9271 0 20.805 0.356619 21.5279 1.06986C22.2509 1.78309 22.6124 2.66615 22.6124 3.71902C22.6124 4.77188 22.2509 5.65495 21.5279 6.36818C20.805 7.08142 19.9271 7.43804 18.8943 7.43804ZM21.7861 11.1571V39.228H15.8993V11.1571H21.7861Z" fill="#007AFF"/>
            </svg>
          </a>
        </Link>
      </div>
      <div className={classnames(styles.column, styles.instagram_container)}>
        <span className={styles.columnTitle}>Подпишись на нас</span>
        <div className={classnames(styles.columnLinks, styles.instagram)}>
          <a 
            href="https://www.instagram.com/oilan.io/" 
            className={styles.link} target="_blank"
          >
            instagram
          </a>
        </div>
      </div>
      <div className={classnames(styles.column, styles.phone_container)}>
        <span className={styles.columnTitle}>Контакты</span>
        <div className={styles.columnLinks}>
          <a 
            href="tel:+77470953440" 
            className={classnames(styles.link, styles.phone)}
          >
            +7 (747) 095-34-40
          </a>
          <a 
            href="tel:+77470953441" 
            className={classnames(styles.link, styles.phone)}
          >
            +7 (747) 095-34-41
          </a>
        </div>
      </div>
      <div className={classnames(styles.column, styles.email_container)}>
        <span className={styles.columnTitle}>Почта</span>
        <div className={styles.columnLinks}>
          <a 
            href="mailto:oilanedu@gmail.com" 
            className={classnames(styles.link, styles.email)}
          >
            oilanedu@gmail.com
          </a>
        </div>
      </div>
      <div className={classnames(styles.column, styles.partner_container)}>
        <span className={styles.columnTitle}>Взаимодействия</span>
        <div className={styles.columnLinks}>
          <span 
            onClick={() => setShow(!show)}
            className={classnames(styles.link, styles.partner)}
          >
            Стать партнером
          </span>
        </div>
      </div>
      <div className={classnames(styles.column, styles.privacy_policy_container)}>
        <span className={styles.columnTitle}>Проект</span>
        <div className={styles.columnLinks}>
          <a 
            href="/privacy-policy" 
            className={classnames(styles.link, styles.privacy_policy)}
          >
            Политика конфидециальности
          </a>
          <a 
            href="/offer" 
            className={classnames(styles.link, styles.public_offer)}
          >
            Публичная оферта
          </a>
        </div>
      </div>
      <div className={classnames(styles.column, styles.copy_abaz)}>
        <span>© 2022 ТОО «АбАз»</span>
      </div>
    </div>
  );
};

import styles from './Footer.module.css'
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BecomeAPartner } from "../BecomeAPartner/BecomeAPartner";
import ModalWindow from "../ModalWindow/ModalWindow";
import { CourseSearchForm } from "../CourseSearchForm/CourseSearchForm";
import { default as axios } from "axios";
import globals from "../../globals";
import { useRouter } from "next/router";
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
    <div className={styles.outerContainer}>
      <div className={styles.container}>
        <ModalWindow
          show={show}
          handleClose={handleClose}
          heading={''}
          body={<BecomeAPartner handleClose={handleClose} />}
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
              style={{ alignContent: 'center', alignItems: 'flex-start', display: 'flex' }}
            >

              <img src="https://realibi.kz/file/42902.svg" alt="" />
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
              href="tel:+77054222579"
              className={classnames(styles.link, styles.phone)}
            >
              +7 (705) 422-25-79
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
            <Link href="/offer">
              <a className={classnames(styles.link, styles.public_offer)}>
                Публичная оферта
              </a>
            </Link>
          </div>
        </div>
        <div className={classnames(styles.column, styles.copy_abaz)}>
          <span>© 2022 ЧК «Oilan.io Ltd»</span>
        </div>
      </div>
    </div>
  );
};

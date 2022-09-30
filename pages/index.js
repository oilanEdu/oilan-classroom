import ApplicationBlock from "../src/components/ApplicationBlock/ApplicationBlock";
import CoursePrice from "../src/components/CoursePrice/CoursePrice";
import Footer from "../src/components/Footer/Footer";
import Program from "../src/components/Program/Program";
import styles from '../styles/main.module.css'
import Header from "../src/components/Header/Header";
import AboutCourse from "../src/components/AboutCourse/AboutCourse";
import AboutTeacher from "../src/components/AboutTeacher/AboutTeacher";
import Head from 'next/head'
import React, {useEffect, useState} from "react";
import {default as axios} from "axios";
import globals from "../src/globals";
import {useRouter} from "next/router";
import {Image} from "react-bootstrap";
import Link from 'next/link'
import dynamic from 'next/dynamic'

const Main = (props) => {

  return (
    <div className={styles.main}>
      <Header white={true}/>
      <AboutCourse/>
      <AboutTeacher/>
      <Program />
      <CoursePrice />
      <ApplicationBlock />
      <Footer />
    </div>
  )
}

export default Main;


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

  const ym = () => {
    return (
      "<script src='https://mc.yandex.ru/metrika/watch.js' type='text/javascript'></script>\
      <script type='text/javascript'>\
            try {\
                  var yaCounter90703823 = new Ya.Metrika({\
                  id:90703823,\
                  clickmap:true,\
                  trackLinks:true,\
                  accurateTrackBounce:true,\
                  webvisor:true,\
                  trackHash:true\
                  });\
            } catch(e) { }\
      </script>"
    );
  };

  return (
    <div>
      <div className={styles.main}>
        <Head>
          <div key={Date()} dangerouslySetInnerHTML={{__html: ym()}}/>
        </Head>
        <Header white={true}/>
        <AboutCourse/>
        <AboutTeacher/>
        <Program />
        <CoursePrice />
        <ApplicationBlock />
        <Footer />
      </div>
    </div>
  )
}

export default Main;


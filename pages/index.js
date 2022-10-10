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
      "<!-- Yandex.Metrika counter -->\n" +
      "<script type=\"text/javascript\" >\n" +
      "   (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};\n" +
      "   m[i].l=1*new Date();\n" +
      "   for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}\n" +
      "   k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})\n" +
      "   (window, document, \"script\", \"https://mc.yandex.ru/metrika/tag.js\", \"ym\");\n" +
      "   ym(90703823, \"init\", {\n" +
      "        clickmap:true,\n" +
      "        trackLinks:true,\n" +
      "        accurateTrackBounce:true,\n" +
      "        webvisor:true\n" +
      "   });\n" +
      "</script>\n" +
      "<noscript><div><img src=\"https://mc.yandex.ru/watch/90703823\" style=\"position:absolute; left:-9999px;\" alt=\"\" /></div></noscript>\n" +
      "<!-- /Yandex.Metrika counter -->"
    );
  };

  return (
    <div>
      <div className={styles.main}>
        <Head>
          </*<div dangerouslySetInnerHTML={{__html: ym()}}/>*/}
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


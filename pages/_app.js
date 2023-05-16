import '../styles/globals.css'
import {useEffect} from "react";
import { CookiesProvider } from 'react-cookie'
import TagManager from "react-gtm-module";
import { YMInitializer } from 'react-yandex-metrika';
import Head from 'next/head';
import { HMSRoomProvider } from '@100mslive/react-sdk';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';
import store from '../src/store/store';

const tagManagerArgs = {
  gtmId: 'GTM-MFV3BJ3'
}

function MyApp({ Component, pageProps }) {
  // useEffect(() => {
  //   document.documentElement.style.backgroundColor = '#F1FAFF';
  //   TagManager.initialize(tagManagerArgs);
  // }, []);

  return <>
      <Provider store={store}>
    <Helmet>
      <title>Oilan-classroom</title>
      <link rel="icon" href="https://realibi.kz/file/963267.png" />
      <meta name="description" content="знакомство с английским языком; лучшие преподаватели; от уровня A1 до уровня C1; подготовка к сдаче IELTS и TOEFL" />
      <meta property="og:title" content="курсы английского онлайн" />
      <meta name="yandex-verification" content="96e78ecdd587114e" />
      <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `{
              "@context": "http://schema.org",
              "@type": "Organization",
              "name": "Oilan.io Ltd",
              "url": "https://www.oilan-classroom.com/",
              "sameAs": [
                "https://www.oilan.io/",
                "https://www.instagram.com/oilan.io/"]
            }`
          }}
      />
    </Helmet>
    <YMInitializer 
      accounts={[90703823]} 
      options={{
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
        trackHash: true,
      }} 
      version="2" 
    /><HMSRoomProvider>
    <CookiesProvider>
      <Component {...pageProps}/>
    </CookiesProvider></HMSRoomProvider>
    </Provider>
  </>
};

export default MyApp;

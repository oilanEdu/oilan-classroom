import '../styles/globals.css'
import {useEffect} from "react";
import { CookiesProvider } from 'react-cookie'
import TagManager from "react-gtm-module";
import { YMInitializer } from 'react-yandex-metrika';
import Head from 'next/head';

const tagManagerArgs = {
  gtmId: 'GTM-MFV3BJ3'
}

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    document.documentElement.style.backgroundColor = '#F1FAFF';
    TagManager.initialize(tagManagerArgs);
  }, []);

  return <>
    <Head>
      <title>Oilan-classroom</title>
      <link rel="icon" href="https://realibi.kz/file/963267.png" />
    </Head>
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
    />
    <CookiesProvider>
      <Component {...pageProps} />
    </CookiesProvider>
  </>
};

export default MyApp;
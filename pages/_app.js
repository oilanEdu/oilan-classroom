import '../styles/globals.css'
import React, {useEffect, useState} from "react";
import { CookiesProvider } from 'react-cookie'
import TagManager from "react-gtm-module";
import { YMInitializer } from 'react-yandex-metrika';

const tagManagerArgs = {
    gtmId: 'GTM-MFV3BJ3'
}

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        document.documentElement.style.backgroundColor = '#F1FAFF';
        TagManager.initialize(tagManagerArgs);
    }, []);

    return (
        <>
            <YMInitializer 
            accounts={[90703823]} 
            options={{
                clickmap: true,
                trackLinks: true,
                accurateTrackBounce: true,
                webvisor: true,
                trackHash: true,
            }} 
            version="2" />
            <CookiesProvider>
                <Component {...pageProps} />
            </CookiesProvider>
        </>
    )
}

export default MyApp

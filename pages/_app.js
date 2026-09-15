import "../styles/globals.scss";
import { useEffect } from "react";
import Head from "next/head"; // Import Head from 'next/head'
import Context from "../global/context";
import { SessionProvider } from "next-auth/react";
import NextNProgress from "nextjs-progressbar";
import SocketLayout from "../global/SocketLayout";
import Script from "next/script"; // Import the Script component
import { ModalProvider } from '../global/ModalContext';
import GlobalModals from '../components/GlobalModals';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* You can still keep any meta tags or other head elements here */}
      </Head>

      {/* Google Tag Manager script */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MBGQWSMW');`,
        }}
      />
      {/* Google Analytics script */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-LY44FCBKW7"
        async
      />
      <Script
        id="ga-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LY44FCBKW7');
          `,
        }}
      />

      <SessionProvider session={pageProps.session}>
        <Context {...pageProps}>
          <SocketLayout {...pageProps}>
            <NextNProgress 
              color="#08529B"
              options={{ 
                showSpinner: false,
                trickleSpeed: 200,
                minimum: 0.3
              }}
            />
            <ModalProvider {...pageProps}>
              <GlobalModals />
              <Component {...pageProps} />
            </ModalProvider>
          </SocketLayout>
        </Context>
      </SessionProvider>
    </>
  );
}

export default MyApp;

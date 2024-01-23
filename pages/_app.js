import '../styles/globals.css'
import { appWithTranslation } from 'next-i18next'
import Head from 'next/head'
import Script from 'next/script'
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_MEASUREMENT_ID

function MyApp({ Component, pageProps }) {
  return (
      <>
      <Head>
          <meta name="title" content="THECOMPANY BERLIN" />
          <meta name="description" content="" />
          <meta name="keywords" content="" />

          <meta name="author" content="" />
          <meta name="copyright" content="" />
          <meta name="application-name" content="" />

          <meta property="og:title" content="THECOMPANY Berlin" />
          <meta property="og:type" content="Website" />
          <meta property="og:image" content="/images/thecompany_facebook.png" />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:url" content="" />
          <meta property="og:description" content="" />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content="THECOMPANY Berlin" />
          <meta name="twitter:description" content="" />
          <meta name="twitter:image" content="/images/thecompany_twitter.png" />
          <meta name="twitter:image:type" content="image/png" />
          <meta name="twitter:image:width" content="1200" />
          <meta name="twitter:image:height" content="630" />
      </Head>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
        />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
      <Component {...pageProps} />
      
      </>)
}

export default appWithTranslation(MyApp)

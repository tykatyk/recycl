import React from 'react'
import { Html, Head, Main, NextScript } from 'next/document'
import {
  DocumentHeadTags,
  documentGetInitialProps,
} from '@mui/material-nextjs/v15-pagesRouter'
import theme from '../lib/helpers/themeStub'
import { AppCacheProvider } from '@mui/material-nextjs/v15-pagesRouter'

export default function MyDocument({ props }) {
  return (
    <AppCacheProvider {...props}>
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <DocumentHeadTags {...props} />
          <meta name="theme-color" content={theme.palette.primary.main} />
          <meta name="emotion-insertion-point" content="" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    </AppCacheProvider>
  )
}

MyDocument.getInitialProps = async (ctx) => {
  const finalProps = await documentGetInitialProps(ctx)
  return finalProps
}

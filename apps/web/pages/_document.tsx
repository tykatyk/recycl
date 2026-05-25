import React from 'react'
import { Html, Head, Main, NextScript } from 'next/document'
import {
  DocumentHeadTags,
  documentGetInitialProps,
} from '@mui/material-nextjs/v15-pagesRouter'
import theme from '../lib/helpers/themeStub'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'

export default function MyDocument({ props }) {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <DocumentHeadTags {...props} />
        <meta name="theme-color" content={theme.palette.primary.main} />
        <meta name="emotion-insertion-point" content="" />
      </Head>
      <body>
        <AppRouterCacheProvider>
          <Main />
          <NextScript />
        </AppRouterCacheProvider>
      </body>
    </Html>
  )
}

MyDocument.getInitialProps = async (ctx) => {
  const finalProps = await documentGetInitialProps(ctx)
  return finalProps
}

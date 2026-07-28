import React from 'react'
import { Html, Head, Main, NextScript } from 'next/document'
import {
  DocumentHeadTags,
  documentGetInitialProps,
} from '@mui/material-nextjs/v15-pagesRouter'
import theme from '../lib/helpers/themeStub'

export default function MyDocument(props) {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content={theme.palette.primary.main} />
        <DocumentHeadTags {...props} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

MyDocument.getInitialProps = async (ctx) => {
  const finalProps = await documentGetInitialProps(ctx)
  return finalProps
}

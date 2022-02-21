import React from 'react'
import Head from 'next/head'

export default function CustomHead({ title = 'Recycl' }) {
  return (
    <Head>
      <title>{title}</title>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width"
      />
    </Head>
  )
}

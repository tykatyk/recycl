import React from 'react'
import Wrapper from '../uiParts/Wrapper'
import Header from '../uiParts/header/Header'
import Head from '../uiParts/Head'

export default function MapLayout({ children, title }) {
  return (
    <>
      <Head title={title} />
      <Wrapper>
        <Header />
        <div style={{ display: 'flex', flex: '1 1 auto' }}>{children}</div>
      </Wrapper>
    </>
  )
}

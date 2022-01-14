import React from 'react'
import Wrapper from '../uiParts/Wrapper.jsx'
import Header from '../uiParts/header/Header.jsx'
import Head from '../uiParts/Head.jsx'

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

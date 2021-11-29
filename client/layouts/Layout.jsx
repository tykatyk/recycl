import React from 'react'
import Wrapper from './Wrapper.jsx'
import Header from '../uiParts/header/Header.jsx'
import Footer from '../uiParts/Footer.jsx'
import Head from '../uiParts/Head.jsx'

export default function Layout({ children, title }) {
  return (
    <>
      <Head title={title} />
      <Wrapper>
        <Header />
        <main>{children}</main>
        <Footer />
      </Wrapper>
    </>
  )
}

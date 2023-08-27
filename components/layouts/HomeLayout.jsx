import React from 'react'
import Wrapper from '../uiParts/Wrapper'
import Header from '../uiParts/header/Header'
import Footer from '../uiParts/Footer'
import Head from '../uiParts/Head'

export default function Layout({ children, title, className = '' }) {
  return (
    <>
      <Head title={title} />
      <Wrapper>
        <Header />
        <main className={className}>{children}</main>
        <Footer />
      </Wrapper>
    </>
  )
}

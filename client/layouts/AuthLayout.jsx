import React from 'react'
import Wrapper from '../uiParts/Wrapper.jsx'
import Footer from '../uiParts/Footer.jsx'
import Head from '../uiParts/Head.jsx'
import BackButton from '../uiParts/BackButton.jsx'

export default function AuthLayout({
  children,
  title,
  backButtonTo,
  backButtonText,
}) {
  return (
    <>
      <Head title={title} />
      <Wrapper>
        <BackButton to={backButtonTo} text={backButtonText} />
        <main>{children}</main>
        <Footer />
      </Wrapper>
    </>
  )
}

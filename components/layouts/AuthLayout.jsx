import React from 'react'
import Wrapper from '../uiParts/Wrapper.jsx'
import Footer from '../uiParts/Footer.jsx'
import Head from '../uiParts/Head.jsx'
import PageLoadingCircle from '../uiParts/PageLoadingCircle.jsx'
import BackButton from '../uiParts/BackButton.jsx'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function AuthLayout({
  children,
  title,
  backButtonTo,
  backButtonText,
}) {
  const { status } = useSession()
  const router = useRouter()

  if (status === 'unauthenticated') {
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

  if (status === 'authenticated') {
    router.replace('/')
  }

  return <PageLoadingCircle />
}

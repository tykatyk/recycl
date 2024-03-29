import React from 'react'
import Wrapper from '../uiParts/Wrapper'
import Footer from '../uiParts/Footer'
import Head from '../uiParts/Head'
import PageLoadingCircle from '../uiParts/PageLoadingCircle'
import BackButton from '../uiParts/BackButton'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Box } from '@mui/material'

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
          <Box component="main" sx={{ width: '100%' }}>
            {children}
          </Box>
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

import React, { ReactNode } from 'react'
import { Box, Container } from '@mui/material'
import Wrapper from '../uiParts/Wrapper'
import Header from '../uiParts/header/Header'
import Footer from '../uiParts/Footer'
import Head from '../uiParts/Head'

type LayoutProps = {
  children: ReactNode
  title: string
  currentDialogId?: string
}
export default function Layout({
  children,
  title,
  currentDialogId,
}: LayoutProps) {
  return (
    <>
      <Head title={title} />
      <Wrapper>
        <Header currentDialogId={currentDialogId} />
        <Container
          component="main"
          maxWidth="md"
          sx={{ position: 'relative', paddingTop: 6, paddingBottom: 6 }}
        >
          {children}
        </Container>
        <Footer />
      </Wrapper>
    </>
  )
}

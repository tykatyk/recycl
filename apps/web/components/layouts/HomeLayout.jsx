import React from 'react'
import Wrapper from '../uiParts/Wrapper'
import Header from '../uiParts/header/Header'
import Footer from '../uiParts/Footer'
import Head from '../uiParts/Head'
import { Box } from '@mui/material'

export default function Layout({ children, title, className = '' }) {
  return (
    <>
      <Head title={title} />
      <Wrapper>
        <Header />
        <Box componenet="main" sx={{ width: '100%' }} className={className}>
          {children}
        </Box>
        <Footer />
      </Wrapper>
    </>
  )
}

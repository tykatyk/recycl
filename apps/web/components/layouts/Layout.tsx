import { ReactNode } from 'react'
import { Container } from '@mui/material'
import Wrapper from '../uiParts/Wrapper'
import Header from '../uiParts/header/Header'
import Footer from '../uiParts/Footer'

type LayoutProps = {
  children: ReactNode
  currentDialogId?: string
}
export default function Layout({ children, currentDialogId }: LayoutProps) {
  return (
    <Wrapper>
      <Header currentDialogId={currentDialogId} />
      <Container
        component="main"
        maxWidth="md"
        sx={{
          position: 'relative',
          paddingTop: 3,
          paddingBottom: 3,
          display: 'flex',
          justifyContent: 'center',
          flex: 1,
        }}
      >
        {children}
      </Container>
      <Footer />
    </Wrapper>
  )
}

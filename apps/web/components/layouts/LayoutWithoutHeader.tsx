import Wrapper from '../uiParts/Wrapper'
import Footer from '../uiParts/Footer'
import { Container } from '@mui/material'
import { ReactElement } from 'react'

type LayoutWithoutHeaderProps = {
  children: ReactElement
}

export default function LayoutWithoutHeader(props: LayoutWithoutHeaderProps) {
  const { children } = props
  return (
    <Wrapper>
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

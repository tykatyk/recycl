import Wrapper from '../uiParts/Wrapper'
import Footer from '../uiParts/Footer'
import Head from '../uiParts/Head'
import { Container } from '@mui/material'
import { ReactElement } from 'react'

type LayoutWithoutHeaderProps = {
  children: ReactElement
  title: string
}

export default function LayoutWithoutHeader(props: LayoutWithoutHeaderProps) {
  const { children, title } = props
  return (
    <>
      <Head title={title} />
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
    </>
  )
}

import React, { ReactNode } from 'react'
import { styled } from '@mui/material/styles'
import { Container } from '@mui/material'
import Wrapper from '../uiParts/Wrapper'
import Header from '../uiParts/header/Header'
import Footer from '../uiParts/Footer'
import Head from '../uiParts/Head'

const PREFIX = 'Layout'

const classes = {
  root: `${PREFIX}-root`,
}

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({ theme }) => ({
  [`& .${classes.root}`]: {
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
  },
}))

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
    <Root>
      <Head title={title} />
      <Wrapper>
        <Header currentDialogId={currentDialogId} />
        <Container className={classes.root} component="div" maxWidth="md">
          <main>{children}</main>
        </Container>
        <Footer />
      </Wrapper>
    </Root>
  )
}

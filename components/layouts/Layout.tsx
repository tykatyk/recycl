import React, { ReactNode } from 'react'
import { Container, makeStyles } from '@material-ui/core'
import Wrapper from '../uiParts/Wrapper'
import Header from '../uiParts/header/Header'
import Footer from '../uiParts/Footer'
import Head from '../uiParts/Head'

const useStyles = makeStyles((theme) => ({
  root: {
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
  const classes = useStyles()

  return (
    <>
      <Head title={title} />
      <Wrapper>
        <Header currentDialogId={currentDialogId} />
        <Container className={classes.root} component="div" maxWidth="md">
          <main>{children}</main>
        </Container>
        <Footer />
      </Wrapper>
    </>
  )
}

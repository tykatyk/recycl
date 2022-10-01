import React from 'react'
import { Container, makeStyles } from '@material-ui/core'
import Wrapper from '../uiParts/Wrapper.jsx'
import Header from '../uiParts/header/Header.jsx'
import Footer from '../uiParts/Footer.jsx'
import Head from '../uiParts/Head.jsx'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
  },
}))

export default function Layout({ children, title, currentDialogId }) {
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

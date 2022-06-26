import React, { useState, useRef } from 'react'
import { makeStyles, Container, useTheme } from '@material-ui/core'
import Layout from './layouts/Layout.jsx'
import { Formik, Form, Field } from 'formik'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    maxWidth: 800,
  },
}))

export default function SupportUsPage() {
  const classes = useStyles()
  const theme = useTheme()

  return (
    <Layout title="О нас | Recycl">
      <Container className={classes.container}></Container>
    </Layout>
  )
}

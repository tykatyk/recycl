import React from 'react'
import Container from '@material-ui/core/Container'
import Wrapper from './Wrapper.jsx'
import Header from '../uiParts/header/Header.jsx'
import Footer from '../uiParts/Footer.jsx'

export default function Layout(props) {
  return (
    <Wrapper>
      <Header />
      <main>{props.children}</main>
      <Footer />
    </Wrapper>
  )
}

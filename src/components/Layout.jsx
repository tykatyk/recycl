import React from 'react'
import Container from '@material-ui/core/Container'
import Wrapper from '../components/Wrapper.jsx'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

export default function Layout(props) {
  return (
    <Wrapper>
      <Header />
      {props.children}
      <Footer />
    </Wrapper>
  )
}

import React from 'react'
import Container from '@material-ui/core/Container'
import Wrapper from '../Wrapper.jsx'
import Header from '../Header.jsx'
import Footer from '../Footer.jsx'

export default function Layout(props) {
  return (
    <Wrapper>
      <Header />
      {props.children}
      <Footer />
    </Wrapper>
  )
}

import React from 'react'
import { styled, useTheme } from '@mui/material/styles'
import { Container } from '@mui/material'
import Layout from './layouts/Layout'

const PREFIX = 'AboutUsPage'

const classes = {
  container: `${PREFIX}-container`,
}

const StyledLayout = styled(Layout)(({ theme }) => ({
  [`& .${classes.container}`]: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    maxWidth: 800,
  },
}))

export default function SupportUsPage() {
  const theme = useTheme()

  return (
    <StyledLayout title="О нас | Recycl">
      <Container className={classes.container}></Container>
    </StyledLayout>
  )
}

import Wrapper from '../uiParts/Wrapper'
import Footer from '../uiParts/Footer'
import Head from '../uiParts/Head'
import HomePageButton from '../uiParts/HomePageButton'
import { Box } from '@mui/material'

export default function LayoutWithoutHeader({ children, title }) {
  return (
    <>
      <Head title={title} />
      <Wrapper>
        <HomePageButton />
        <Box sx={{ width: '100%' }}>{children}</Box>
        <Footer />
      </Wrapper>
    </>
  )
}

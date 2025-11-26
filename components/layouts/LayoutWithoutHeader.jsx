import Wrapper from '../uiParts/Wrapper'
import Footer from '../uiParts/Footer'
import Head from '../uiParts/Head'
import BackButton from '../uiParts/BackButton'
import { Box } from '@mui/material'

export default function LayoutWithoutHeader({
  children,
  title,
  backButtonText,
}) {
  return (
    <>
      <Head title={title} />
      <Wrapper>
        <BackButton text={backButtonText} />
        <Box component="div" sx={{ width: '100%' }}>
          {children}
        </Box>
        <Footer />
      </Wrapper>
    </>
  )
}

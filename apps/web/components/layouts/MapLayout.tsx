import Wrapper from '../uiParts/Wrapper'
import Header from '../uiParts/header/Header'
import Head from '../uiParts/Head'
import { Box } from '@mui/material'

export default function MapLayout({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <>
      <Head title={title} />
      <Wrapper>
        <Box sx={{ display: 'flex', flex: '1 1 auto' }}>{children}</Box>
      </Wrapper>
    </>
  )
}

import { Box } from '@mui/material'
import Layout from '../../../components/layouts/Layout'
import ScrollTopButton from '../../../components/uiParts/ScrollToTopButton'
import RedirectUnathenticatedUser from '../../../components/uiParts/RedirectUnathenticatedUser'
import MyCollectionPointsList from '../../../components/collectionPoints/MyCollectionPointsList'

const brand = process.env.NEXT_PUBLIC_BRAND || ''
const h1 = 'Мои стационарные пункты приема вторсырья'
const title = `${h1} | ${brand}`

export default function MyCollectionPoints() {
  return (
    <Layout title={title}>
      <RedirectUnathenticatedUser>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <MyCollectionPointsList variant="stationery" h1={h1} />
          <ScrollTopButton />
        </Box>
      </RedirectUnathenticatedUser>
    </Layout>
  )
}

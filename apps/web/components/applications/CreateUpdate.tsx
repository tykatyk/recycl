import { Box, Grid, Typography } from '@mui/material'
import Layout from '../layouts/Layout'
import RemovalForm from './RemovalForm'
import RedirectUnathenticatedUser from '../uiParts/RedirectUnathenticatedUser'

const title = 'Создать объявление о наличии вторсырья'
export default function CreateUpdate() {
  return (
    <RedirectUnathenticatedUser>
      <Layout title={`${title} | Recycl`}>
        <Grid
          container
          direction="column"
          style={{
            maxWidth: '750px',
            margin: '0 auto',
            padding: '16px',
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography component="h1" variant="h4">
              {title}
            </Typography>
          </Box>
          <RemovalForm />
        </Grid>
      </Layout>
    </RedirectUnathenticatedUser>
  )
}

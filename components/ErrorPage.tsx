import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Avatar, Box, Button, Typography, Container } from '@mui/material'
import LayoutWithoutHeader from './layouts/LayoutWithoutHeader'

const GO_HOME_TEXT = 'На главную'
const HOME_URL = '/'

type ErrorPageProps = {
  headerText: string
  contentText: string
  title: string
}
export default function ErrorPage(props: ErrorPageProps) {
  const { headerText, contentText, title } = props
  return (
    <>
      <LayoutWithoutHeader title={title}>
        <Container maxWidth="sm" sx={{ p: 2 }}>
          <Box
            component="main"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar
              sx={{
                m: 1,
                backgroundColor: 'secondary.main',
              }}
            >
              <ErrorOutlineIcon />
            </Avatar>
            <Typography component="h1" variant="h5" mb={3}>
              {headerText}
            </Typography>
            <Typography component="div" align="center" mb={10}>
              {contentText}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                sx={{ mb: 4 }}
                variant="contained"
                href={HOME_URL}
                color="secondary"
              >
                {GO_HOME_TEXT}
              </Button>
            </Box>
          </Box>
        </Container>
      </LayoutWithoutHeader>
    </>
  )
}

import { Container, Grid, List, ListItem, Box } from '@mui/material'
import Link from './Link'
import Logo from './header/Logo'

const sizes = { xs: 12, md: 3 }

export default function Footer(props) {
  return (
    <Box
      component={'footer'}
      sx={{
        mt: 'auto',
        pt: 3,
        pb: 3,
        backgroundColor: '#1a2b34',
        color: 'primary',
        width: '100%',
      }}
      {...props}
    >
      <Container
        component="div"
        sx={{
          '& > *': {
            mb: 1,
          },
          '& > :last-child': {
            mb: 0,
          },
        }}
      >
        <Grid
          container
          component="nav"
          direction="column"
          size={sizes}
          sx={{ pb: 3 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <Logo />
          </Box>
          <List sx={{ p: 0 }}>
            <ListItem dense disableGutters>
              <Link
                color="textSecondary"
                underline="none"
                href="/contact-us"
                sx={{
                  '&:hover': {
                    color: 'primary',
                  },
                  fontSize: 14,
                  fontWeight: 'fontWeightLight',
                }}
              >
                Связаться с нами
              </Link>
            </ListItem>
            <ListItem dense disableGutters>
              <Link
                color="textSecondary"
                underline="none"
                href="/support-us"
                sx={{
                  '&:hover': {
                    color: 'primary',
                  },
                  fontSize: 14,
                  fontWeight: 'fontWeightLight',
                }}
              >
                Поддержать проект
              </Link>
            </ListItem>
          </List>
        </Grid>
      </Container>
    </Box>
  )
}

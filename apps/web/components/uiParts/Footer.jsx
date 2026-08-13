import { styled } from '@mui/material/styles'
import { Container, Grid, List, ListItem, Typography, Box } from '@mui/material'
import Link from './Link'
import Logo from './header/Logo'

const PREFIX = 'Footer'

const classes = {
  root: `${PREFIX}-root`,
  container: `${PREFIX}-container`,
  title: `${PREFIX}-title`,
  link: `${PREFIX}-link`,
}

const Root = styled('footer')(({ theme }) => ({
  [`&.${classes.root}`]: {
    marginTop: 'auto',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    backgroundColor: '#1a2b34',
    color: theme.palette.text.primary,
    width: '100%',
  },

  [`& .${classes.container}`]: {
    '& > *': {
      marginBottom: theme.spacing(1),
    },
    '& > :last-child': {
      marginBottom: 0,
    },
  },

  [`& .${classes.title}`]: {
    padding: `0 ${theme.spacing(2)} `,
    fontWeight: 'bold',
  },

  [`& .${classes.link}`]: {
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}))

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
        <Grid container component="nav">
          <Grid container direction="column" size={sizes} sx={{ pb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Logo />
            </Box>
          </Grid>
          <Grid container direction="column" size={sizes} sx={{ pb: 3 }}>
            <Typography
              component="h5"
              variant="overline"
              sx={{ padding: `0 16px `, fontWeight: 'bold' }}
            >
              Компания
            </Typography>
            <List sx={{ p: 0 }}>
              <ListItem dense>
                <Link
                  color="textSecondary"
                  underline="none"
                  href="/contact-us"
                  sx={{
                    '&:hover': {
                      color: 'primary',
                    },
                  }}
                >
                  Связаться с нами
                </Link>
              </ListItem>
              <ListItem dense>
                <Link
                  color="textSecondary"
                  underline="none"
                  href="/support-us"
                  sx={{
                    '&:hover': {
                      color: 'primary',
                    },
                  }}
                >
                  Поддержать проект
                </Link>
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

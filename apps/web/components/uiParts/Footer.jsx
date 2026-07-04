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
                  href="/about-us"
                  sx={{
                    '&:hover': {
                      color: 'primary',
                    },
                  }}
                >
                  О нас
                </Link>
              </ListItem>
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
          <Grid container direction="column" size={sizes} sx={{ pb: 3 }}>
            <Typography
              variant="overline"
              component="h5"
              className={classes.title}
            >
              Пользователям
            </Typography>
            <List style={{ padding: 0 }}>
              <ListItem dense>
                <Link
                  color="textSecondary"
                  underline="none"
                  href="/terms-of-service"
                  sx={{
                    '&:hover': {
                      color: 'primary',
                    },
                  }}
                >
                  Условия использования
                </Link>
              </ListItem>
              <ListItem dense>
                <Link
                  color="textSecondary"
                  underline="none"
                  href="/privacy-policy"
                  sx={{
                    '&:hover': {
                      color: 'primary',
                    },
                  }}
                >
                  Политика приватности
                </Link>
              </ListItem>
              <ListItem dense>
                <Link
                  color="textSecondary"
                  underline="none"
                  href="/cookie-policy"
                  sx={{
                    '&:hover': {
                      color: 'primary',
                    },
                  }}
                >
                  Политика Cookie
                </Link>
              </ListItem>
            </List>
          </Grid>
          <Grid container direction="column" size={sizes}>
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ pl: 2, pr: 2 }}
            >
              {`Использование материалов сайта возможно только с разрешения правообладателя Recycl World
              Company © ${new Date().getFullYear()}`}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

import React from 'react'
import { styled } from '@mui/material/styles'
import { Container, Grid, List, ListItem, Typography } from '@mui/material'
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
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.primary,
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
      color: '#adce5d',
    },
  },
}))

export default function Footer() {
  return (
    <Root className={classes.root}>
      <Container component="div" className={classes.container}>
        <Grid container component="nav">
          <Grid
            container
            direction="column"
            item
            xs={12}
            sm={3}
            style={{ paddingLeft: 16, paddingRight: 16, paddingBottom: 24 }}
          >
            <Logo />
          </Grid>
          <Grid
            container
            direction="column"
            item
            xs={12}
            sm={3}
            style={{ paddingBottom: 24 }}
          >
            <Typography
              component="h5"
              variant="overline"
              className={classes.title}
            >
              Компания
            </Typography>
            <List style={{ padding: 0 }}>
              <ListItem dense>
                <Link
                  color="textSecondary"
                  underline="none"
                  href="/about-us"
                  className={classes.link}
                >
                  О нас
                </Link>
              </ListItem>
              <ListItem dense>
                <Link
                  color="textSecondary"
                  underline="none"
                  href="/contact-us"
                  className={classes.link}
                >
                  Связаться с нами
                </Link>
              </ListItem>
              <ListItem dense>
                <Link
                  color="textSecondary"
                  underline="none"
                  href="/support-us"
                  className={classes.link}
                >
                  Поддержать проект
                </Link>
              </ListItem>
            </List>
          </Grid>
          <Grid
            container
            direction="column"
            item
            xs={12}
            sm={3}
            style={{ paddingBottom: 24 }}
          >
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
                  className={classes.link}
                >
                  Условия использования
                </Link>
              </ListItem>
              <ListItem dense>
                <Link
                  color="textSecondary"
                  underline="none"
                  href="/privacy-policy"
                  className={classes.link}
                >
                  Политика приватности
                </Link>
              </ListItem>
              <ListItem dense>
                <Link
                  color="textSecondary"
                  underline="none"
                  href="/cookie-policy"
                  className={classes.link}
                >
                  Политика Cookie
                </Link>
              </ListItem>
            </List>
          </Grid>
          <Grid container direction="column" item xs={12} sm={3}>
            <Typography
              variant="caption"
              color="textSecondary"
              style={{ paddingLeft: 16, paddingRight: 16 }}
            >
              {`Использование материалов сайта возможно только с разрешения правообладателя Recycl World
              Company © ${new Date().getFullYear()}`}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Root>
  )
}

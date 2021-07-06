import React, { useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import background from '../build/public/images/22.jpg'

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStylePosition: 'inside',
      listStyle: 'none'
    },
    li: {
      position: 'relative',
      paddingLeft: theme.spacing(3),
      paddingBottom: theme.spacing(3),
      '&::lastChild': {
        paddingBottom: 0
      },
      '&:before': {
        content: '"»"',
        color: '#f8bc45',
        fontSize: '2em',
        fontWeight: 'bold',
        display: 'inline-block',
        marginRight: theme.spacing(1),
        position: 'absolute',
        top: '-0.5em',
        left: '0'
      }
    }
  },
  card: {
    minHeight: '25em',
    background: '#417347',
    color: '#fff'
  },
  cardHeader: {
    backgroundColor: '#223c4a',
    borderBottom: '6px solid #fff'
  },
  cardContent: {
    paddingTop: theme.spacing(3)
  },

  content: {
    padding: theme.spacing(8, 0, 8),
    backgroundColor: '#1a2b34'
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  },
  splash: {
    backgroundImage: `url(${background})`,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: '1.2',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  mainHeader: {
    fontWeight: 'bold',
    paddingTop: '1.5em'
  },
  subHeader: {
    fontWeight: 'bold'
  }
}))

const tiers = [
  {
    title: 'Для переработчиков',
    description: [
      'Находите новых партнеров.',
      'Находите сырье для переработки.',
      'Работойте с новыми видами сырья, которые нужны рынку.'
    ]
  },
  {
    title: 'Для бизнеса',
    description: [
      'Привлекайте новых клиентов, устанавливая места для раздельного сбора и гарантированно избавляйтесь от отходов.',
      'Экономьте на утилизации, сдавая отходы тем, кому они нужны.'
    ]
  },
  {
    title: 'Для общественности',
    description: [
      'Находите места приема отходов.',
      'Подавайте заявки на вывоз и участие в сортировке.'
    ]
  }
]

export default function Home() {
  const [state, setState] = useState({
    splashMinHeight: 0
  })

  useEffect(() => {
    const calculeteSplashMinHeight = () => {
      const headerHeight = document.getElementById('mainHeader').offsetHeight
      const windowHeight = window.innerHeight
      return setState((prevState) => ({
        ...prevState,
        splashMinHeight: windowHeight - headerHeight
      }))
    }

    calculeteSplashMinHeight()

    window.addEventListener('resize', () => calculeteSplashMinHeight())

    return () => {
      window.removeEventListener('resize', () => calculeteSplashMinHeight())
    }
  }, [state.splashMinHeight])
  const classes = useStyles()
  return (
    <>
      <div className={classes.wrapper}>
        <Header />
        <div
          className={classes.splash}
          style={{ minHeight: `${state.splashMinHeight}px` }}
        >
          <Typography
            component="h2"
            variant="h1"
            className={classes.mainHeader}
          >
            Recycl
          </Typography>
          <Typography component="h2" variant="h3" className={classes.subHeader}>
            Помогаем собирать и перерабатывать отходы
          </Typography>
        </div>
        <div className={classes.content}>
          <Container component="main">
            <Grid container spacing={5} alignItems="flex-end">
              {tiers.map((tier) => (
                <Grid item key={tier.title} xs={12} sm={6} md={4}>
                  <Card className={classes.card}>
                    <CardHeader
                      title={tier.title}
                      titleTypographyProps={{ align: 'center' }}
                      className={classes.cardHeader}
                    />
                    <CardContent className={classes.cardContent}>
                      <ul>
                        {tier.description.map((line) => (
                          <Typography
                            component="li"
                            variant="subtitle1"
                            align="left"
                            key={line}
                          >
                            {line}
                          </Typography>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </div>
        <Footer />
      </div>
    </>
  )
}

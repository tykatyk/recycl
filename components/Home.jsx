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
      listStyle: 'none'
    }
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[200]
        : theme.palette.grey[700]
  },
  card: {
    height: '25em',
    textAlign: 'left'
  },
  content: {
    margin: 'auto'
    // padding: theme.spacing(8, 0, 6)
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
    alignItems: 'center',
    justifyContent: 'center'
  },
  mainHeader: {
    marginTop: '-1em'
  }
}))

const tiers = [
  {
    title: 'Для сборщиков и переработчиков',
    description: [
      'Находите новых поставщиков/клиентов',
      'Находите отходы, мониторя заявки на вывоз',
      'Расширяйте номенклатуру поставок продавая продукцию/сырье заинтересованным партнерам',
      'Экономьте на логистике'
    ]
  },
  {
    title: 'Для бизнеса и общественности',
    description: [
      'Находите места приема отходов',
      'Подавайте заявки на вывоз и участие в сортировке',
      'Привлекайте новых клиентов, устанавливая места для раздельного сбора и гарантированно избавляйтесь от отходов',
      'Экономьте на утилизации, сдавая отходы тем, кому они нужны'
    ]
  }
]

export default function Home() {
  const [state, setState] = useState({
    splashMinHeight: 0
  })

  useEffect(() => {
    console.log(`splash minheight ${state.splashMinHeight}`)
    console.log(`window innerHeight ${window.innerHeight}`)
    console.log(
      `header height ${document.getElementById('mainHeader').offsetHeight}`
    )
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
                <Grid item key={tier.title} xs={12} md={6}>
                  <Card className={classes.card}>
                    <CardHeader
                      title={tier.title}
                      titleTypographyProps={{ align: 'center' }}
                      className={classes.cardHeader}
                    />
                    <CardContent>
                      <ul>
                        {tier.description.map((line) => (
                          <Typography
                            component="li"
                            variant="subtitle1"
                            align="center"
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

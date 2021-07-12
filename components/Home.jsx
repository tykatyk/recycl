import React, { useRef, useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import background from '../build/public/images/22.jpg'
import isMobile from '../helpers/detectMobile'

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStylePosition: 'inside',
      listStyle: 'none'
    }
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  },
  splash: {
    // paddingTop: theme.spacing(14),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a2b34',
    backgroundImage: `url(${background})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    color: '#fff',
    textAlign: 'center',
    boxSizing: 'border-box'
  },
  splashMainHeader: {
    fontWeight: 'bold'
  },
  splashSubHeader: {
    fontWeight: 'bold'
  },
  cardContainer: {
    padding: theme.spacing(8, 0, 8),
    backgroundColor: '#1a2b34',
    '& li': {
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
  }
}))

const tiers = [
  {
    title: 'Для переработчиков',
    description: [
      'Находите новых партнеров.',
      'Находите сырье для переработки.',
      'Работaйте с новыми видами сырья, которые нужны рынку.'
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
  const ref = useRef()

  const [state, setState] = useState({
    splashMinHeight: 0,
    inPortraitMode: window.innerHeight > window.innerWidth,
    mobilePortraitHeight: window.innerHeight,
    mobileLandscapeHeight: window.innerWidth
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      ref.current = {
        splashMinHeight: state.splashMinHeight,
        inPortraitMode: state.inPortraitMode
      }

      let isLoaded = true

      const calculeteSplashMinHeight = () => {
        const headerHeight = document.getElementById('mainHeader').offsetHeight
        const windowHeight = window.innerHeight
        const windowWidth = window.innerWidth
        let splashMinHeight = windowHeight - headerHeight

        if (!isLoaded) return
        if (isMobile()) {
          const portraitMode = window.innerHeight > window.innerWidth
          if (
            ref.current.splashMinHeight === 0 ||
            ref.current.inPortraitMode != portraitMode
          ) {
            splashMinHeight = portraitMode
              ? state.mobilePortraitHeight - headerHeight
              : state.mobileLandscapeHeight - headerHeight

            ref.current.splashMinHeight = splashMinHeight
            ref.current.inPortraitMode = portraitMode

            setState(() => ({ splashMinHeight }))
          }
        } else {
          setState(() => ({ splashMinHeight }))
        }
      }
      calculeteSplashMinHeight()

      window.addEventListener('resize', () => calculeteSplashMinHeight())

      return () => {
        isLoaded = false
        window.removeEventListener('resize', () => calculeteSplashMinHeight())
      }
    }
  }, [])

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
            component="h1"
            variant="h1"
            paragraph
            className={classes.splashMainHeader}
          >
            Recycl
          </Typography>
          <Typography
            component="h2"
            variant="h3"
            paragraph
            className={classes.splashSubHeader}
          >
            Помогаем собирать и перерабатывать отходы
          </Typography>
        </div>
        <div className={classes.cardContainer}>
          <Container component="main">
            <Grid container spacing={5}>
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
        {/* end of cardContainer */}
        <Footer />
      </div>
      {/* end of wrapper */}
    </>
  )
}

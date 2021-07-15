import React, { useRef, useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import isMobile from '../helpers/detectMobile'
import images from './data/backgroundImages'

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStylePosition: 'inside',
      listStyle: 'none'
    }
  },

  splash: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundImage: `url(${images.small})`, // 600px
    [`${theme.breakpoints.up('xs')} and (min-resolution: 2dppx)`]: {
      backgroundImage: `url(${images.smallRetina})` // 1200px
    },
    [theme.breakpoints.up('sm')]: {
      backgroundImage: `url(${images.medium})` // 960px
    },
    [`${theme.breakpoints.up('sm')} and (min-resolution: 2dppx)`]: {
      backgroundImage: `url(${images.mediumRetina})` // 1920px
    },
    [theme.breakpoints.up('md')]: {
      backgroundImage: `url(${images.large})` // 1280px
    },
    [`${theme.breakpoints.up(
      'md'
    )} and (min-resolution: 2dppx), ${theme.breakpoints.up('large')}`]: {
      backgroundImage: `url(${images.xLarge})` // should be 2560px but it's 2246px
    },
    backgroundRepeat: 'no-repeat',
    color: '#fff',
    textAlign: 'center'
  },

  splashMainHeader: {
    fontWeight: 'bold'
  },
  splashSubHeader: {
    fontWeight: 'bold',
    wordWrap: 'break-word',
    padding: '0 10px'
  },
  cardContainer: {
    padding: theme.spacing(4, 0, 4),
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
    backgroundColor: theme.palette.primary.main,
    borderBottom: '6px solid #fff'
  },
  cardContent: {
    paddingTop: theme.spacing(3)
  }
}))

const cardsContent = [
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
  let landscapeHeight = 0
  let portraitHeight = 0
  let inPortraitMode = false

  // Defining viewport's height in order to set background image of the home page
  // to be 100% of screen height.
  // When rendered on server, window object is undefined,
  // as well as navigator object in isMobile function.
  // We need custom login for mobile devices
  // in order to prevent content from irritating "jumping"
  // when address bar dissappears in mobile browsers

  if (typeof window !== 'undefined' && isMobile()) {
    inPortraitMode = window.innerHeight > window.innerWidth

    // Viewport's height is set depending on the screen orientation of user's device.
    ;(portraitHeight = inPortraitMode ? window.innerHeight : window.innerWidth),
      (landscapeHeight = inPortraitMode
        ? window.innerWidth
        : window.innerHeight)
  }

  const [state, setState] = useState({
    splashMinHeight: 0,
    portraitMode: inPortraitMode,
    landscapeHeight,
    portraitHeight
  })

  // this hook is for setting min-height of the container
  // of the background image to be 100% of available viewport height
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ref.current = { ...state }

      let isLoaded = true

      const calculeteSplashMinHeight = () => {
        const headerHeight = document.getElementById('mainHeader').offsetHeight
        const windowHeight = window.innerHeight
        let splashMinHeight = windowHeight - headerHeight

        if (!isLoaded) return
        if (isMobile()) {
          const portraitMode = window.innerHeight > window.innerWidth
          if (
            ref.current.splashMinHeight === 0 ||
            ref.current.portraitMode != portraitMode
          ) {
            splashMinHeight = portraitMode
              ? ref.current.portraitHeight - headerHeight
              : ref.current.landscapeHeight - headerHeight

            ref.current.splashMinHeight = splashMinHeight
            ref.current.portraitMode = portraitMode

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
      <Header />
      <Container component="div">
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
            variant="h4"
            paragraph
            className={classes.splashSubHeader}
          >
            Помогаем собирать и перерабатывать отходы
          </Typography>
        </div>
        <div className={classes.cardContainer}>
          <Grid container spacing={5}>
            {cardsContent.map((card) => (
              <Grid item key={card.title} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardHeader
                    title={card.title}
                    titleTypographyProps={{ align: 'center' }}
                    className={classes.cardHeader}
                  />
                  <CardContent className={classes.cardContent}>
                    <ul>
                      {card.description.map((line) => (
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
        </div>
        {/* end of cardContainer */}
      </Container>

      <Footer />
    </>
  )
}

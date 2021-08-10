import React, { useRef, useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import Container from '@material-ui/core/Container'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Layout from './layouts/Layout.jsx'
import isMobile from '../helpers/detectMobile'
import images from './data/backgroundImages'
import cardsContent from './data/cardsContent'

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
    margin: '0 auto',
    minWidth: '100%',
    maxWidth: '1920px',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',

    // background image for landscape orientation
    [`@media screen`]: {
      backgroundImage:
        theme.palette.type == 'dark' ? 'none' : `url(${images.mediumLandscape})`
    },

    [theme.breakpoints.up('sm')]: {
      backgroundImage:
        theme.palette.type == 'dark' ? 'none' : `url(${images.xLargeLandscape})`
    },

    // background image for portrait orientation
    [`@media screen and (orientation: portrait)`]: {
      backgroundImage:
        theme.palette.type == 'dark' ? 'none' : `url(${images.smallPortrait})` // 600
    },
    [`${theme.breakpoints.up('sm')} and (orientation: portrait)`]: {
      backgroundImage:
        theme.palette.type == 'dark' ? 'none' : `url(${images.mediumPortrait})` // 960px
    },
    [`${theme.breakpoints.up('md')} and (orientation: portrait)`]: {
      backgroundImage:
        theme.palette.type == 'dark' ? 'none' : `url(${images.largePortrait})` // 1280px
    },
    [`${theme.breakpoints.up(
      'xs'
    )} and (min-resolution: 2dppx) and (orientation: portrait)`]: {
      backgroundImage:
        theme.palette.type == 'dark'
          ? 'none'
          : `url(${images.smallRetinaPortrait})` // 1200px
    },
    [`${theme.breakpoints.up(
      'sm'
    )} and (min-resolution: 2dppx) and (orientation: portrait), ${theme.breakpoints
      .up('lg')
      .replace('@media ', '')} and (orientation: portrait)`]: {
      backgroundImage:
        theme.palette.type == 'dark'
          ? 'none'
          : `url(${images.mediumRetinaPortrait})` // 1920px
    },

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
    maxWidth: `${theme.breakpoints.values.lg}px`,
    padding: '20px',
    margin: '0 auto'
  },
  card: {
    minHeight: '25em',
    backgroundColor:
      theme.palette.type == 'dark'
        ? `${theme.palette.background.paper}`
        : '#417347',
    color: '#fff'
  },
  cardHeader: {
    backgroundColor: `${
      theme.palette.type == 'dark'
        ? theme.palette.background.paper
        : theme.palette.primary.main
    }`,
    borderBottom: '6px solid #fff'
  },
  cardContent: {
    paddingTop: theme.spacing(3),
    '& li': {
      position: 'relative',
      paddingLeft: theme.spacing(3),
      paddingBottom: theme.spacing(3),
      '&::lastChild': {
        paddingBottom: 0
      },
      '&:before': {
        content: '"»"',
        color: `${theme.palette.secondary.main}`,
        fontSize: '2em',
        fontWeight: 'bold',
        display: 'inline-block',
        marginRight: theme.spacing(1),
        position: 'absolute',
        top: '-0.5em',
        left: '0'
      }
    }
  }
}))

export default function Home() {
  const theme = useTheme()
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

      let timeout
      const handleResize = () => {
        // throttling resize event
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          calculeteSplashMinHeight()
        }, 400)
      }

      calculeteSplashMinHeight()

      window.addEventListener('resize', () => handleResize())

      return () => {
        isLoaded = false
        window.removeEventListener('resize', () => handleResize())
      }
    }
  }, [])

  const classes = useStyles()
  //
  return (
    <Layout>
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
    </Layout>
  )
}

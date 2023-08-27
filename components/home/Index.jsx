import React, { useState, useEffect } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  useMediaQuery,
} from '@mui/material'
import HomeLayout from '../layouts/HomeLayout'
import cardsContent from './cardsContent'
import { handleResize } from './resizeHandlers'
import images from './backgroundImages'

const PREFIX = 'Index'

const classes = {
  splash: `${PREFIX}-splash`,
  splashHeader: `${PREFIX}-splashHeader`,
  cardContainer: `${PREFIX}-cardContainer`,
  card: `${PREFIX}-card`,
  cardHeader: `${PREFIX}-cardHeader`,
  cardContent: `${PREFIX}-cardContent`,
}

const StyledHomeLayout = styled(HomeLayout)(({ theme }) => ({
  [`& .${classes.splash}`]: {
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
      backgroundImage: `url(${images.mediumLandscape})`,
    },

    [theme.breakpoints.up('sm')]: {
      backgroundImage: `url(${images.xLargeLandscape})`,
    },

    // background image for portrait orientation
    [`@media screen and (orientation: portrait)`]: {
      backgroundImage: `url(${images.smallPortrait})`, // 600px
    },
    [`${theme.breakpoints.up('sm')} and (orientation: portrait)`]: {
      backgroundImage: `url(${images.mediumPortrait})`, // 960px
    },
    [`${theme.breakpoints.up('md')} and (orientation: portrait)`]: {
      backgroundImage: `url(${images.largePortrait})`, // 1280px
    },
    [`${theme.breakpoints.up(
      'xs'
    )} and (min-resolution: 2dppx) and (orientation: portrait)`]: {
      backgroundImage: `url(${images.smallRetinaPortrait})`, // 1200px
    },
    [`${theme.breakpoints.up(
      'sm'
    )} and (min-resolution: 2dppx) and (orientation: portrait), ${theme.breakpoints
      .up('lg')
      .replace('@media ', '')} and (orientation: portrait)`]: {
      backgroundImage: `url(${images.mediumRetinaPortrait})`, // 1920px
    },

    color: '#fff',
    textAlign: 'center',
  },

  [`& .${classes.splashHeader}`]: {
    margin: '0 auto',
    padding: '0 24px',
    maxWidth: 700,
    boxSizing: 'border-box',
    fontWeight: 'bold',
    textShadow: '2px 1px #152229',
    overflowWrap: 'break-word',
  },

  [`& .${classes.cardContainer}`]: {
    maxWidth: `${theme.breakpoints.values.lg}px`,
    padding: '20px',
    margin: '0 auto',
  },

  [`& .${classes.card}`]: {
    minHeight: '25em',
    backgroundColor: `${theme.palette.background.paper}`,
    color: '#fff',
  },

  [`& .${classes.cardHeader}`]: {
    backgroundColor: `${theme.palette.primary.main}`,
    borderBottom: '6px solid #fff',
  },

  [`& .${classes.cardContent}`]: {
    paddingTop: theme.spacing(3),
    '& li': {
      position: 'relative',
      paddingLeft: theme.spacing(3),
      paddingBottom: theme.spacing(3),
      '&::lastChild': {
        paddingBottom: 0,
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
        left: '0',
      },
    },
  },
}))

const options = {
  portraitMode: true,
  landscapeHeight: 0,
  portraitHeight: 0,
  minHeight: 0,
}
export default function HomePage() {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('md'))

  const [splashMinHeight, setSplashMinHeight] = useState(0)

  useEffect(() => {
    let isLoaded = true

    handleResize(isLoaded, options, setSplashMinHeight)

    window.addEventListener('resize', () =>
      handleResize(isLoaded, options, setSplashMinHeight)
    )

    return () => {
      isLoaded = false
      window.removeEventListener('resize', () =>
        handleResize(isLoaded, options, setSplashMinHeight)
      )
    }
  }, [])

  return (
    <StyledHomeLayout title="Recycl | Главная">
      <section
        className={classes.splash}
        style={{ minHeight: `${splashMinHeight}px` }}
      >
        <Typography
          component="h2"
          variant={matches ? 'h3' : 'h2'}
          className={classes.splashHeader}
        >
          Помогаем собирать и перерабатывать отходы
        </Typography>
      </section>
      <section className={classes.cardContainer}>
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
      </section>
    </StyledHomeLayout>
  )
}

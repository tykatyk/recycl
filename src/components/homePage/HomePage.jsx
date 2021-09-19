import React, { useState, useEffect } from 'react'
import {
  Grid,
  Card,
  Container,
  CardHeader,
  CardContent,
  Typography,
  useTheme,
} from '@material-ui/core'
import Layout from '../Layout.jsx'
import isMobile from '../helpers/detectMobile'
import cardsContent from '../helpers/cardsContent'
import homePageStyles from './homePageStyles'
import { setSplashMinHeight, handleResize } from './resizeHandlers'
const useStyles = homePageStyles

export default function HomePage() {
  const theme = useTheme()

  let inPortraitMode = false
  let landscapeHeight = 0
  let portraitHeight = 0

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
    portraitHeight = inPortraitMode ? window.innerHeight : window.innerWidth
    landscapeHeight = inPortraitMode ? window.innerWidth : window.innerHeight
  }

  const [state, setState] = useState({
    splashMinHeight: 0,
    portraitMode: inPortraitMode,
    landscapeHeight,
    portraitHeight,
  })

  // this hook is for setting min-height of the container
  // of the background image to be 100% of available viewport height
  useEffect(() => {
    let isLoaded = true

    if (typeof window !== 'undefined') {
      setSplashMinHeight(isLoaded, setState)

      window.addEventListener('resize', () => handleResize(isLoaded, setState))

      return () => {
        isLoaded = false
        window.removeEventListener('resize', () =>
          handleResize(isLoaded, setState)
        )
      }
    }
  }, [])

  const classes = useStyles()

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

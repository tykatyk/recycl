import React, { useState, useEffect } from 'react'
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  useTheme,
  useMediaQuery,
} from '@material-ui/core'
import HomeLayout from '../layouts/HomeLayout.jsx'
import cardsContent from './cardsContent'
import homePageStyles from './styles'
import { handleResize } from './resizeHandlers'
const useStyles = homePageStyles

export default function HomePage() {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('sm'))
  const options = {
    portraitMode: true,
    landscapeHeight: 0,
    portraitHeight: 0,
    minHeight: 0,
  }

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

  const classes = useStyles()

  return (
    <HomeLayout title="Recycl | Главная">
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
    </HomeLayout>
  )
}
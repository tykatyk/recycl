import { useState, useEffect } from 'react'
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  useMediaQuery,
  Box,
  Container,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import cardsContent from '../components/home/cardsContent'
import { handleResize } from '../components/home/resizeHandlers'
import images from '../components/home/backgroundImages'
import Head from 'next/head'
import Wrapper from '../components/uiParts/Wrapper'
import Footer from '../components/uiParts/Footer'
import Header from '../components/uiParts/header/Header'
import Link from '../components/uiParts/Link'
import HowItWorks from '../components/home/HowItWorks'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'
import CanonicalUrl from '../components/uiParts/CanonicalUrl'

const brand = process.env.NEXT_PUBLIC_BRAND || ''

const options = {
  portraitMode: true,
  landscapeHeight: 0,
  portraitHeight: 0,
  minHeight: 0,
}

export default function HomePage() {
  const theme = useTheme()

  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'))

  const isXs = useMediaQuery(theme.breakpoints.down('sm'))

  const [splashMinHeight, setSplashMinHeight] = useState(0)

  const router = useRouter()
  const { locale, locales, defaultLocale, asPath } = router

  const t = useTranslations('HomePage')

  useEffect(() => {
    let isLoaded = true

    const onResize = () => {
      handleResize(isLoaded, options, setSplashMinHeight)
    }

    onResize()
    window.addEventListener('resize', onResize)

    return () => {
      isLoaded = false
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <>
      <Head>
        <title>{`${t('title')} | ${brand}`}</title>
        <meta name="description" content="" />

        <CanonicalUrl
          asPath={asPath}
          locale={locale}
          defaultLocale={defaultLocale}
          locales={locales}
        />
      </Head>

      <Wrapper>
        <Box
          className="container"
          sx={{
            width: '100%',
            mx: 'auto',
            maxWidth: 1920,
          }}
        >
          <Header />

          <Box
            component="main"
            sx={{
              width: '100%',
            }}
          >
            {/* Splash */}
            <Box
              component="section"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                mx: 'auto',
                minWidth: '100%',
                maxWidth: 1920,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundImage: `url(/${images.mediumLandscape})`,
                color: '#fff',
                textAlign: 'center',
                minHeight: splashMinHeight,

                [theme.breakpoints.up('sm')]: {
                  backgroundImage: `url(/${images.xLargeLandscape})`,
                },

                '@media screen and (orientation: portrait)': {
                  backgroundImage: `url(/${images.smallPortrait})`,
                },

                [`${theme.breakpoints.up('sm')} and (orientation: portrait)`]: {
                  backgroundImage: `url(/${images.mediumPortrait})`,
                },

                [`${theme.breakpoints.up('md')} and (orientation: portrait)`]: {
                  backgroundImage: `url(/${images.largePortrait})`,
                },

                [`${theme.breakpoints.up(
                  'xs',
                )} and (min-resolution: 2dppx) and (orientation: portrait)`]: {
                  backgroundImage: `url(/${images.smallRetinaPortrait})`,
                },

                [`${theme.breakpoints.up(
                  'sm',
                )} and (min-resolution: 2dppx) and (orientation: portrait), ${theme.breakpoints
                  .up('lg')
                  .replace('@media ', '')} and (orientation: portrait)`]: {
                  backgroundImage: `url(/${images.mediumRetinaPortrait})`,
                },
              }}
            >
              <Typography
                component="h1"
                variant={isSm ? 'h3' : isXs ? 'h4' : 'h2'}
                sx={{
                  mx: 'auto',
                  px: 3,
                  maxWidth: 900,
                  boxSizing: 'border-box',
                  fontWeight: 'bold',
                  textShadow: '2px 1px #152229',
                  overflowWrap: 'break-word',
                }}
              >
                {t('h1')}
              </Typography>
            </Box>

            {/* What we propose */}
            <Box
              component="section"
              sx={{
                maxWidth: `${theme.breakpoints.values.lg}px`,
                px: 2,
                py: 5,
                mx: 'auto',
              }}
            >
              <Typography
                component="h2"
                variant={isSm ? 'h3' : isXs ? 'h4' : 'h2'}
                align="center"
                sx={{
                  mt: 1,
                  mb: 6,
                }}
              >
                {t('whatWePropose.h2')}
              </Typography>

              <Grid container spacing={5}>
                {cardsContent.map((card, idx) => (
                  <Grid key={idx} size={{ xs: 12, sm: 6 }}>
                    <Card
                      sx={{
                        minHeight: '25em',
                        backgroundColor: 'background.paper',
                        color: '#fff',
                      }}
                    >
                      <CardHeader
                        title={t(`whatWePropose.${card.id}.title`)}
                        titleTypographyProps={{
                          align: 'center',
                        }}
                        sx={{
                          backgroundColor: 'primary.dark',
                          borderBottom: '6px solid #fff',
                        }}
                      />

                      <CardContent
                        sx={{
                          pt: 3,

                          '& li': {
                            position: 'relative',
                            pl: 3,
                            pb: 3,

                            '&:last-child': {
                              pb: 0,
                            },

                            '&::before': {
                              content: '"»"',
                              color: 'secondary.main',
                              fontSize: '2em',
                              fontWeight: 'bold',
                              display: 'inline-block',
                              mr: 1,
                              position: 'absolute',
                              top: '-0.5em',
                              left: 0,
                            },
                          },
                        }}
                      >
                        <ul>
                          {card.description.map((item, index) => (
                            <Typography component="li" key={index}>
                              <Link
                                href={item.href}
                                locale={locale}
                                sx={{
                                  color: '#fff',
                                  textDecoration: 'none',

                                  '&:hover': {
                                    textDecoration: 'underline',
                                  },
                                }}
                              >
                                {/* ToDo: add types */}
                                {t(
                                  `whatWePropose.${card.id}.${item.id}` as any,
                                )}
                              </Link>
                            </Typography>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* How it works */}
            <Box
              component="section"
              sx={{
                width: '100%',
                px: 2,
                py: 5,
                backgroundColor: '#21275c',
              }}
            >
              <Container maxWidth="md">
                <HowItWorks variant={isSm ? 'h3' : isXs ? 'h4' : 'h2'} />
              </Container>
            </Box>
          </Box>

          <Footer />
        </Box>
      </Wrapper>
    </>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../messages/${locale}.json`)).default,
    },
  }
}

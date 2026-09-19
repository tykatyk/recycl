import { useLayoutEffect } from 'react'
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

const isMobile = () => {
  let check = false
  ;(function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a,
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4),
      )
    )
      check = true
  })(navigator.userAgent || navigator.vendor || window['opera'])
  return check
}

const brand = process.env.NEXT_PUBLIC_BRAND || ''

export default function HomePage() {
  const theme = useTheme()

  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'))

  const isXs = useMediaQuery(theme.breakpoints.down('sm'))

  const router = useRouter()
  const { locale, locales, defaultLocale, asPath } = router

  const t = useTranslations('HomePage')

  useLayoutEffect(() => {
    const header = document.getElementById('mainHeader')

    if (!header) return

    const updateHeaderHeight = () => {
      document.documentElement.style.setProperty(
        '--header-height',
        `${header.offsetHeight}px`,
      )
    }

    updateHeaderHeight()

    const observer = new ResizeObserver(updateHeaderHeight)
    observer.observe(header)

    return () => observer.disconnect()
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
                // minHeight: splashMinHeight,
                minHeight: isMobile()
                  ? 'calc(100lvh - var(--header-height))'
                  : 'calc(100vh - var(--header-height))',

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
      messages: (await import(`../messages/${locale}`)).default,
    },
  }
}

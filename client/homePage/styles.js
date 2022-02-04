import { makeStyles } from '@material-ui/core/styles'
import images from './backgroundImages'

export default makeStyles((theme) => ({
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

  splashHeader: {
    margin: '0 auto',
    padding: '0 24px',
    maxWidth: 700,
    boxSizing: 'border-box',
    fontWeight: 'bold',
    textShadow: '2px 1px #152229',
    overflowWrap: 'break-word',
  },
  cardContainer: {
    maxWidth: `${theme.breakpoints.values.lg}px`,
    padding: '20px',
    margin: '0 auto',
  },
  card: {
    minHeight: '25em',
    backgroundColor: `${theme.palette.background.paper}`,
    color: '#fff',
  },
  cardHeader: {
    backgroundColor: `${theme.palette.primary.main}`,
    borderBottom: '6px solid #fff',
  },
  cardContent: {
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

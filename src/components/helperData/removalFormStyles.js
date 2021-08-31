import { makeStyles } from '@material-ui/core/styles'

export default makeStyles((theme) => ({
  '@global': {
    '.Mui-focused fieldset': {
      borderColor: `${theme.palette.secondary.main} !important`,
    },
    '.Mui-error.Mui-focused fieldset': {
      borderColor: `${theme.palette.error.main} !important`,
    },
    ' label.Mui-focused': {
      color: `${theme.palette.secondary.main} !important`,
    },
    ' label.Mui-error.Mui-focused': {
      color: `${theme.palette.error.main} !important`,
    },
  },
  formRoot: {
    '& > fieldset': {
      margin: 0,
      marginBottom: theme.spacing(5),
      padding: 0,
      border: 'none',
    },
  },
  formControl: {
    '& fieldset': { borderColor: `${theme.palette.text.secondary}` },
    '& svg': { color: `${theme.palette.text.secondary}` },
  },
  gridContainer: {
    '& > div': {
      paddingBottom: theme.spacing(2),
    },
    '& > div:last-child': {
      paddingBottom: 0,
    },
  },
  sectionTitle: {
    '& h4': { marginBottom: 0 },
  },
}))

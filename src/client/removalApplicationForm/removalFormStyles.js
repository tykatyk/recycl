import { makeStyles } from '@material-ui/core/styles'

export default makeStyles((theme) => ({
  '@global': {
    'input[type=number].MuiInputBase-input ': {
      '-moz-appearance': 'textfield',
    },
    'input[type=number].MuiInputBase-input::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none ',
      margin: 0,
    },
    'input[type=number].MuiInputBase-input::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },

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

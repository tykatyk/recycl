import { makeStyles } from '@material-ui/core/styles'

export default makeStyles((theme) => ({
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

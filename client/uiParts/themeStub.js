import { createMuiTheme } from '@material-ui/core/styles'
import { ruRU as coreRuRu } from '@material-ui/core/locale'
import { ruRU } from '@mui/x-data-grid'

const theme = createMuiTheme(
  {
    palette: {
      type: 'dark',
      primary: {
        main: '#1a2b34', // dark blue-green
      },
      secondary: {
        main: '#f8bc45', // yellow
      },
      background: {
        paper: '#37474f', //blue-grey
        default: '#223c4a', // blue-green
      },
    },
  },
  coreRuRu,
  ruRU
)
export default theme

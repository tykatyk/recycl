import { createTheme, adaptV4Theme } from '@mui/material/styles'
import { ruRU as coreRuRu } from '@mui/material/locale'
import { ruRU } from '@mui/x-date-pickers/locales'

const theme = createTheme(
  {
    palette: {
      mode: 'dark',
      primary: {
        main: '#1a2b34', // dark blue-green
      },
      secondary: {
        main: '#f8bc45', // yellow
      },
      background: {
        paper: '#2a363c', //dark blue-grey
        default: '#223c4a', // blue-green
      },
    },
  },
  coreRuRu,
  ruRU
)
export default theme

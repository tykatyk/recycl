import { createTheme, adaptV4Theme } from '@mui/material/styles'
import { ruRU as coreRuRu } from '@mui/material/locale'
import { ruRU } from '@mui/x-data-grid'

const theme = createTheme(
  adaptV4Theme({
    palette: {
      mode: 'dark',
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
  }),
  coreRuRu,
  ruRU
)
export default theme

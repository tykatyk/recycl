import { createTheme } from '@mui/material/styles'
import { ruRU as coreRuRu } from '@mui/material/locale'
import { ruRU } from '@mui/x-date-pickers/locales'
import type { ThemeColors } from '../types/themeColors'

export const colors: ThemeColors = {
  primary: '#1a2b34', // dark blue-green
  secondary: '#f8bc45', // yellow
  background: '#223c4a', // blue-green
  brand: '#adce5d',
  text: '#ffffff',
  buttonText: '#1f1f1f',
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.secondary,
    },
    background: {
      paper: '#2a363c', //dark blue-grey
      default: colors.background,
    },
  },
  coreRuRu,
  ruRU,
})
export default theme

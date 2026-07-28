import { createTheme } from '@mui/material/styles'
import { ruRU as coreRuRu } from '@mui/material/locale'
import { ruRU } from '@mui/x-date-pickers/locales'
import type { ThemeColors } from '../types/themeColors'

const lime = '#adce5d'

export const colors: ThemeColors = {
  primary: lime,
  secondary: '#9be1da', //teal
  background: '#223c4a', // blue-green
  brand: lime,
  yellow: '#ffbf3e',
  darkBlueGreen: '#1a2b34',
}

const theme = createTheme(
  {
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
  },
  coreRuRu,
  ruRU,
)
export default theme

import { createTheme } from '@mui/material/styles'
import { ruRU as coreRuRu } from '@mui/material/locale'
import { ruRU } from '@mui/x-date-pickers/locales'
import type { ThemeColors } from '../types/themeColors'

export const colors: ThemeColors = {
  secondary: '#9be1da', //teal
  primary: '#ffbf3e', // yellow
  background: '#223c4a', // blue-green
  brand: '#adce5d',
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

import * as React from 'react'
import { withStyles } from '@material-ui/core'

const GlobalCss = withStyles(
  (theme) => ({
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
  }),
  { withTheme: true }
)(() => null)

export default function GlobalCssOverride() {
  return <GlobalCss />
}

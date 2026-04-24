import * as React from 'react'
import GlobalStyles from '@mui/material/GlobalStyles'
import { useTheme } from '@mui/material/styles'

export default function GlobalCssOverride() {
  const theme = useTheme()
  return (
    <GlobalStyles
      styles={{
        ul: {
          margin: 0,
          padding: 0,
          listStylePosition: 'inside',
          listStyle: 'none',
        },
        'input[type=number].MuiInputBase-input ': {
          mozAppearance: 'textfield',
        },
        'input[type=number].MuiInputBase-input::-webkit-outer-spin-button': {
          webkitAppearance: 'none ',
          margin: 0,
        },
        'input[type=number].MuiInputBase-input::-webkit-inner-spin-button': {
          webkitAppearance: 'none',
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
      }}
    />
  )
}

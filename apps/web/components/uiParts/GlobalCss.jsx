import GlobalStyles from '@mui/material/GlobalStyles'

export default function GlobalCssOverride() {
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
      }}
    />
  )
}

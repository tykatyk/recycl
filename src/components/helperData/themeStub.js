export default function getThemeStub(mode) {
  if (mode != 'light' && mode != 'dark') mode = 'light'

  return {
    palette: {
      type: mode,
      primary: {
        main: '#1a2b34', // dark blue-green
      },
      secondary: {
        main: '#f8bc45', // yellow
      },
      background: {
        paper: '#424242',
        default: mode == 'dark' ? '#303030' : '#223c4a', // dark grey in dark mode, blue-green in light mode
      },
      text: {
        primary: '#fff', // not changed in light and dark modes
        secondary: 'rgba(255, 255, 255, 0.7)',
        disabled: 'rgba(255, 255, 255, 0.5)',
      },
      ation: {
        active: '#f8bc45',
        selected: '#f8bc45',
        focus: '#f8bc45',
      },
    },
  }
}

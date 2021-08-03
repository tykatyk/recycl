export default function getThemeStub(mode) {
  if (mode != 'light' && mode != 'dark') return {}

  return {
    palette: {
      type: mode,
      primary: {
        main: '#1a2b34' // not changed in light and dark modes
      },
      secondary: {
        main: '#f8bc45' // not changed in light and dark modes
      },
      background: {
        paper: '#424242',
        default: mode == 'dark' ? '#303030' : '#223c4a'
      },
      text: {
        primary: '#fff', // not changed in light and dark modes
        secondary: 'rgba(255, 255, 255, 0.7)',
        disabled: 'rgba(255, 255, 255, 0.5)'
      },
      ation: {
        active: '#f8bc45',
        selected: '#f8bc45',
        focus: '#f8bc45'
      }
    }
  }
}

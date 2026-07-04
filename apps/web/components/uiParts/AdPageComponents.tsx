import { styled } from '@mui/material/styles'
import Footer from './Footer'
import Header from './header/Header'

export const drawerWidth = 280

interface DrawerProps {
  drawerOpen: boolean
}

export const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'drawerOpen',
})<{
  drawerOpen?: boolean
}>(({ theme }) => ({
  flexGrow: 1,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  variants: [
    {
      props: ({ drawerOpen }) => drawerOpen,
      style: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      },
    },
  ],
}))

export const StyledHeader = styled(Header, {
  shouldForwardProp: (prop) => prop !== 'drawerOpen',
})<DrawerProps>(({ theme }) => ({
  position: 'fixed',
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ drawerOpen }) => drawerOpen,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}))

export const StyledFooter = styled(Footer, {
  shouldForwardProp: (prop) => prop !== 'drawerOpen',
})<DrawerProps>(({ theme }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  variants: [
    {
      props: ({ drawerOpen }) => drawerOpen,
      style: {
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}))

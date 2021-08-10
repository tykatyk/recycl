import React, { useState, useEffect } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuIcon from '@material-ui/icons/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Drawer from '@material-ui/core/Drawer'
import Container from '@material-ui/core/Container'
import Link from '@material-ui/core/Link'
import { Link as RouterLink } from 'react-router-dom'
import NavLinks from './NavLinks.jsx'

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: `${
      theme.palette.type == 'dark'
        ? theme.palette.background.default
        : theme.palette.primary.main
    }`,
    color: `${theme.palette.text.primary}`
  },
  header: {
    padding: 0
  },
  menuBtn: {
    paddingLeft: 0
  },
  accountBtn: {
    paddingRight: '0',
    marginLeft: 'auto'
  }
}))

export default function Header() {
  const preventDefault = () => false
  const classes = useStyles()
  const theme = useTheme()

  const [anchorEl, setAnchorEl] = React.useState(null)

  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let isMounted = true

      const setResponsiveness = () => {
        if (isMounted) {
          window.innerWidth < theme.breakpoints.values.md
            ? setState((prevState) => ({ ...prevState, mobileView: true }))
            : setState((prevState) => ({ ...prevState, mobileView: false }))
        }
      }
      setResponsiveness()
      window.addEventListener('resize', () => setResponsiveness())

      return () => {
        isMounted = false
        window.removeEventListener('resize', () => setResponsiveness())
      }
    }
  }, [])

  const { mobileView, drawerOpen } = state

  const open = Boolean(anchorEl)

  const handleChange = (event) => {
    setAuth(event.target.checked)
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const displayMobile = () => {
    const handleDrawerOpen = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: true }))

    const handleDrawerClose = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: false }))

    return (
      <>
        <IconButton
          {...{
            className: classes.menuBtn,
            'aria-label': 'menu',
            'aria-haspopup': 'true',
            onClick: handleDrawerOpen,
            color: 'inherit'
          }}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          {...{
            anchor: 'left',
            open: drawerOpen,
            onClose: handleDrawerClose
          }}
        >
          <NavLinks isDesktop={false} />
        </Drawer>
      </>
    )
  }

  const displayDesktop = () => <NavLinks isDesktop />

  return (
    <AppBar position="static" id="mainHeader" className={classes.appBar}>
      <Container component="div">
        <Toolbar className={classes.header}>
          {mobileView ? displayMobile() : displayDesktop()}
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            className={classes.accountBtn}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <Link
                to="#"
                onClick={preventDefault}
                color="inherit"
                component={RouterLink}
              >
                Мои заявки
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link
                to="#"
                onClick={preventDefault}
                color="inherit"
                component={RouterLink}
              >
                Настройки
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link
                to="#"
                onClick={preventDefault}
                color="inherit"
                component={RouterLink}
              >
                Выйти
              </Link>
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

import React, { useState, useEffect } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Link from '@material-ui/core/Link'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Menu from '@material-ui/core/Menu'
import Drawer from '@material-ui/core/Drawer'
import Box from '@material-ui/core/Box'

const useStyles = makeStyles((theme) => ({
  header: {
    '@media (max-width: 900px)': {
      paddingTop: 0,
      paddingBottom: 0
    }
  },
  links: {
    flexGrow: 1,
    '& > * + *': {
      marginLeft: theme.spacing(2)
    }
  },
  accountBtn: {
    marginLeft: 'auto'
  }
}))

export default function Header() {
  const links = [
    'Заявки на сортировку',
    'Заявки на вывоз',
    'Переработчики',
    'Сортировщики'
  ]

  const classes = useStyles()
  const theme = useTheme()

  const [anchorEl, setAnchorEl] = React.useState(null)

  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false
  })

  useEffect(() => {
    const setResponsiveness = () =>
      window.innerWidth < theme.breakpoints.values.md
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }))

    setResponsiveness()
    window.addEventListener('resize', () => setResponsiveness())

    return () => {
      window.removeEventListener('resize', () => setResponsiveness())
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

  const preventDefault = () => false

  const displayMobile = () => {
    const handleDrawerOpen = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: true }))

    const handleDrawerClose = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: false }))

    return (
      <>
        <IconButton
          {...{
            color: 'inherit',
            'aria-label': 'menu',
            'aria-haspopup': 'true',
            onClick: handleDrawerOpen
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
          <Typography component="nav" align="right">
            {links.map((link) => (
              <Link
                href="#"
                onClick={preventDefault}
                color="inherit"
                key={link}
              >
                <MenuItem>{link}</MenuItem>
              </Link>
            ))}
          </Typography>
        </Drawer>
      </>
    )
  }

  const displayDesktop = () => (
    <Typography component="nav" align="right" className={classes.links}>
      {links.map((link) => (
        <Link href="#" onClick={preventDefault} color="inherit" key={link}>
          {link}
        </Link>
      ))}
    </Typography>
  )

  return (
    <AppBar position="static" id="mainHeader">
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
          <MenuItem onClick={handleClose}>Мои заявки</MenuItem>
          <MenuItem onClick={handleClose}>Настройки</MenuItem>
          <MenuItem onClick={handleClose}>Выйти</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

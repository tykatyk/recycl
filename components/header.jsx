import React, { useState, useEffect } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Link from '@material-ui/core/Link'
import { Link as RouterLink } from 'react-router-dom'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Menu from '@material-ui/core/Menu'
import Drawer from '@material-ui/core/Drawer'
import Container from '@material-ui/core/Container'

const useStyles = makeStyles((theme) => ({
  header: {
    padding: 0
  },
  links: {
    flexGrow: 1,
    '& > * + *': {
      marginLeft: theme.spacing(2)
    }
  },
  accountBtn: {
    paddingRight: '0',
    marginLeft: 'auto'
  }
}))

export default function Header() {
  const links = [
    {
      text: 'Заявки на сортировку',
      href: '#'
    },
    {
      text: 'Заявки на вывоз',
      href: '/removal'
    },
    {
      text: 'Переработчики',
      href: '#'
    },
    {
      text: 'Сортировщики',
      href: '#'
    }
  ]

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

  const preventDefault = () => false

  const navLinks = () => (
    <Typography
      component="nav"
      align="right"
      className={mobileView ? '' : classes.links}
    >
      {links.map((link, index) => (
        <Link
          to={link.href}
          onClick={preventDefault}
          color="inherit"
          key={index}
          component={RouterLink}
        >
          {link.text}
        </Link>
      ))}
    </Typography>
  )

  const displayMobile = () => {
    const handleDrawerOpen = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: true }))

    const handleDrawerClose = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: false }))

    return (
      <>
        <IconButton
          {...{
            style: { paddingLeft: 0 },
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
          {navLinks()}
        </Drawer>
      </>
    )
  }

  const displayDesktop = () => navLinks()

  return (
    <AppBar
      position="static"
      id="mainHeader"
      style={{
        backgroundColor: `${
          theme.palette.type == 'dark'
            ? theme.palette.background.default
            : theme.palette.primary.main
        }`,
        color: `${theme.palette.text.primary}`
      }}
    >
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
            <MenuItem onClick={handleClose}>Мои заявки</MenuItem>
            <MenuItem onClick={handleClose}>Настройки</MenuItem>
            <MenuItem onClick={handleClose}>Выйти</MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

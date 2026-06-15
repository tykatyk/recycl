import React, { useEffect, useState } from 'react'
import {
  IconButton,
  Menu,
  Box,
  Link,
  MenuItem,
  useMediaQuery,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import theme from '../../../lib/helpers/themeStub'

type LinkData = {
  text: string
  href: string
}
export default function MobileNavigation({ links }: { links: LinkData[] }) {
  const [anchorNavMenu, setAnchorNavMenu] = useState<null | HTMLElement>(null)
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    // setAnchorNavMenu(event.currentTarget)
    setAnchorNavMenu(document.getElementById('mobile-anchor'))
  }

  const handleCloseNavMenu = () => {
    setAnchorNavMenu(null)
  }

  useEffect(() => {
    setAnchorNavMenu(null)
  }, [isMobile])

  return (
    <Box
      component={'nav'}
      sx={{
        display: { xs: 'flex', md: 'none' },
        alignItems: 'center',
        pl: 2,
      }}
    >
      <IconButton
        aria-label="menu"
        aria-haspopup="true"
        onClick={handleOpenNavMenu}
        color="inherit"
        size="large"
      >
        <MenuIcon />
      </IconButton>

      <Menu
        id="menu-appbar"
        anchorEl={anchorNavMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={Boolean(anchorNavMenu)}
        onClose={handleCloseNavMenu}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        {links.map((link, index: number) => (
          <MenuItem
            key={index}
            onClick={handleCloseNavMenu}
            // sx={{
            //   display: isDesktop ? 'inline-block' : 'block',
            //   width: isDesktop ? 'auto' : 'unset',
            // }}
          >
            <Link
              href={link.href}
              onClick={() => false}
              color="inherit"
              underline="none"
              sx={{
                display: 'block',
                width: '100%',
              }}
            >
              {link.text}
            </Link>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

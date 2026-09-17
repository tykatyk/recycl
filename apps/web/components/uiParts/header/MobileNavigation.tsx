import React, { useEffect, useState } from 'react'
import { IconButton, Menu, Box, MenuItem, useMediaQuery } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import theme from '../../../lib/helpers/themeStub'
import { useRouter } from 'next/router'
import Link from '../Link'

type LinkData = {
  text: string
  href: string
}
export default function MobileNavigation({
  links,
  isMobile = useMediaQuery(theme.breakpoints.down('md')),
  mobileViewport = { show: 'xs', hide: 'md' },
}: {
  links: LinkData[]
  isMobile: boolean
  mobileViewport: any
}) {
  const [anchorNavMenu, setAnchorNavMenu] = useState<null | HTMLElement>(null)
  const router = useRouter()
  const { locale } = router
  const { show, hide } = mobileViewport
  const isDense = useMediaQuery(theme.breakpoints.down('sm'))

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
        display: { [show]: 'flex', [hide]: 'none' },
        alignItems: 'center',
        pl: 1,
      }}
    >
      <IconButton
        aria-label="menu"
        aria-haspopup="true"
        onClick={handleOpenNavMenu}
        color="inherit"
        size={isDense ? 'small' : 'large'}
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
        sx={{ display: { [show]: 'block', [hide]: 'none' } }}
      >
        {links.map((link, index: number) => (
          <MenuItem dense={isDense} key={index} onClick={handleCloseNavMenu}>
            <Link
              href={link.href}
              locale={locale}
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

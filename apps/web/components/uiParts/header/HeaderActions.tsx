import React from 'react'
import { Box, Button, IconButton, Link, Menu, MenuItem } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import AddCircleIcon from '@mui/icons-material/AddCircle'

export default function HeaderActions() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const menuItems = [
    {
      text: 'Объявление о наличии вторсырья',
      href: '/applications/create',
    },
    {
      text: 'Пункт приема вторсырья',
      href: '/my/events/create',
    },
    {
      text: 'Подписку на уведомления\n о появлении вторсырья',
      href: '/my/subscriptions/waste-available/create',
    },
  ]

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(document.getElementById('anchor'))
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box id="anchor">
      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
        <Button
          sx={{
            textTransform: 'capitalize',

            fontSize: '1rem',
            fontWeight: '400',
          }}
          variant="outlined"
          color="inherit"
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          endIcon={<KeyboardArrowDownIcon />}
        >
          Добавить
        </Button>
      </Box>
      <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
        <IconButton
          aria-label="создать объявление"
          color="inherit"
          size="large"
          onClick={handleClick}
        >
          <AddCircleIcon />
        </IconButton>
      </Box>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        keepMounted
      >
        {menuItems.map((item, index) => {
          return (
            <MenuItem onClick={handleClose} key={index}>
              <Link
                href={item.href}
                onClick={() => false}
                color="inherit"
                underline="none"
                sx={{
                  whiteSpace: 'pre-line',
                  display: 'inline-block',
                  width: '100%',
                }}
              >
                {item.text}
              </Link>
            </MenuItem>
          )
        })}
      </Menu>
    </Box>
  )
}

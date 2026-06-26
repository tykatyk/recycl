import React from 'react'
import {
  Box,
  Button,
  IconButton,
  Link,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import InventoryIcon from '@mui/icons-material/Inventory'
import PlaceIcon from '@mui/icons-material/Place'
import EmailIcon from '@mui/icons-material/Email'

export default function HeaderActions() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const menuItems = [
    {
      text: 'Объявление о наличии вторсырья',
      href: '/applications/create',
      icon: InventoryIcon,
    },
    {
      text: 'Пункт приема вторсырья',
      href: '/my/events/create',
      icon: PlaceIcon,
    },
    {
      text: 'Подписку на уведомления\n о появлении вторсырья',
      href: '/my/subscriptions/waste-available/create',
      icon: EmailIcon,
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
          const Icon = item.icon
          return (
            <MenuItem onClick={handleClose} key={index}>
              <ListItemIcon>{Icon ? <Icon /> : null}</ListItemIcon>
              <ListItemText>
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
              </ListItemText>
            </MenuItem>
          )
        })}
      </Menu>
    </Box>
  )
}

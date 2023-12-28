import React from 'react'
import { useTheme } from '@mui/material/styles'
import {
  Box,
  Button,
  IconButton,
  Link,
  Menu,
  MenuItem,
  useMediaQuery,
} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import AddCircleIcon from '@mui/icons-material/AddCircle'

export default function CreateButton(props) {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('md'))
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const menuItems = [
    {
      text: 'Объявление о наличии отходов',
      href: '/applications/create',
    },
    {
      text: 'Объявление о вывозе отходов',
      href: '/my/events/create',
    },
    {
      text: 'Пункт приема отходов',
      href: '#',
    },
  ]

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const CreateAdMenu = () => {
    return (
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {menuItems.map((item, index) => {
          return (
            <MenuItem onClick={handleClose} key={index}>
              <Link
                href={item.href}
                onClick={() => false}
                color="inherit"
                underline="none"
              >
                {item.text}
              </Link>
            </MenuItem>
          )
        })}
      </Menu>
    )
  }

  if (matches) {
    return (
      <Box>
        <IconButton
          aria-label="создать объявление"
          color="inherit"
          size="large"
          onClick={handleClick}
        >
          <AddCircleIcon />
        </IconButton>
        <CreateAdMenu />
      </Box>
    )
  }

  return (
    <Box>
      <Button
        sx={{
          textTransform: 'capitalize',
          marginRight: theme.spacing(2),
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
        Создать
      </Button>
      <CreateAdMenu />
    </Box>
  )
}

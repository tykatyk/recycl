import React from 'react'
import {
  Box,
  Button,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import InventoryIcon from '@mui/icons-material/Inventory'
import PlaceIcon from '@mui/icons-material/Place'
import Link from '../Link'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
import { useTheme } from '@mui/material/styles'

export default function HeaderActions() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const router = useRouter()
  const { locale } = router
  const t = useTranslations('Header.actions')
  const theme = useTheme()
  const isDense = useMediaQuery(theme.breakpoints.down('sm'))

  const menuItems = [
    {
      text: t('createAd'),
      href: '/my/ads/create',
      icon: InventoryIcon,
    },
    {
      text: t('createCollectionPoint'),
      href: '/my/collection-points/create',
      icon: PlaceIcon,
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
          {t('add')}
        </Button>
      </Box>
      <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
        <IconButton
          aria-label="создать объявление"
          color="inherit"
          size={isDense ? 'small' : 'large'}
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
            <MenuItem
              onClick={handleClose}
              key={index}
              component={Link}
              href={item.href}
              locale={locale}
              dense={isDense}
            >
              <ListItemIcon
                sx={{
                  display: {
                    xs: 'none',
                    sm: 'flex',
                  },
                }}
              >
                {Icon ? <Icon /> : null}
              </ListItemIcon>
              <Typography variant="inherit" noWrap>
                {item.text}
              </Typography>
            </MenuItem>
          )
        })}
      </Menu>
    </Box>
  )
}

import { useTheme } from '@mui/material/styles'
import {
  MenuItem,
  ListItemText,
  ListItemIcon,
  Menu,
  Typography,
  useMediaQuery,
} from '@mui/material'
import Link from '../Link'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import SettingsIcon from '@mui/icons-material/Settings'
import InventoryIcon from '@mui/icons-material/Inventory'
import PlaceIcon from '@mui/icons-material/Place'
import EmailIcon from '@mui/icons-material/Email'
import { useRouter } from 'next/router'
import { useId } from 'react'
import { useTranslations } from 'next-intl'

const authenticated = 'authenticated'

const LogIn = () => {
  const router = useRouter()
  const from = router.asPath === '/' ? '' : `?from=${router.asPath}`
  const theme = useTheme()
  const isDense = useMediaQuery(theme.breakpoints.down('sm'))

  const t = useTranslations('Header.userMenu')
  return (
    <MenuItem
      dense={isDense}
      component={Link}
      href={`/auth/login${from}`}
      sx={{ px: { xs: 1, sm: 2 }, py: 1 }}
    >
      <ListItemIcon
        sx={{
          display: {
            xs: 'none',
            sm: 'flex',
          },
          flexShrink: 0,
        }}
      >
        <LoginIcon fontSize="small" />
      </ListItemIcon>
      <Typography component="div" variant="inherit" sx={{ width: '100%' }}>
        {t('logIn')}
      </Typography>
    </MenuItem>
  )
}

const LogOut = () => {
  const t = useTranslations('Header.userMenu')
  const theme = useTheme()
  const isDense = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <MenuItem
      dense={isDense}
      onClick={() => {
        signOut({
          callbackUrl: '/',
        })
      }}
      sx={{ px: { xs: 1, sm: 2 }, py: 1 }}
    >
      <ListItemIcon
        sx={{
          display: {
            xs: 'none',
            sm: 'flex',
          },
          flexShrink: 0,
        }}
      >
        <LogoutIcon fontSize="small" />
      </ListItemIcon>
      <Typography variant="inherit" component="div" sx={{ width: '100%' }}>
        {t('logOut')}
      </Typography>
    </MenuItem>
  )
}

export default function UserMenu(props) {
  const theme = useTheme()
  const { locale } = useRouter()
  const isDense = useMediaQuery(theme.breakpoints.down('sm'))

  const { data: session, status } = useSession()
  const { open, anchorEl, handleClose } = props

  const id = useId()
  const menuId = `${id}-menu`

  const t = useTranslations('Header.userMenu')
  const menuItems = [
    {
      text: t('myAds'),
      href: '/my/ads',
      icon: InventoryIcon,
    },
    {
      text: t('myCollectionPoints'),
      href: '/my/collection-points',
      icon: PlaceIcon,
    },
    {
      text: t('mySubscriptions'),
      href: '/my/subscriptions',
      icon: EmailIcon,
    },
    {
      text: t('mySettings'),
      href: '/my/account',
      icon: SettingsIcon,
    },
  ]

  const showSubmenu = (item, index) => {
    const Icon = item.icon

    return (
      <MenuItem dense={isDense} onClick={handleClose} key={index} sx={{ p: 0 }}>
        <Typography
          component="div"
          variant="inherit"
          noWrap
          sx={{ width: '100%' }}
        >
          <Link
            href={item.href}
            locale={locale}
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              minWidth: 0,
              px: { xs: 1, sm: 2 },
              py: 1,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <ListItemIcon
              sx={{
                display: {
                  xs: 'none',
                  sm: 'flex',
                },
                flexShrink: 0,
              }}
            >
              <Icon />
            </ListItemIcon>

            <Typography noWrap variant="inherit">
              {item.text}
            </Typography>
          </Link>
        </Typography>
      </MenuItem>
    )
  }

  return (
    <Menu
      open={open}
      className="userMenu"
      id={menuId}
      onClose={handleClose}
      anchorEl={anchorEl}
      slotProps={{
        list: {
          'aria-label': 'Меню пользователя',
        },
      }}
    >
      <MenuItem dense={isDense} divider>
        <ListItemText
          style={{
            textAlign: 'center',
            color: theme.palette.secondary.main,
          }}
          secondary={session ? session.user?.name : ''}
        />
      </MenuItem>
      <MenuItem dense={isDense}>
        <ListItemText
          style={{
            color: theme.palette.secondary.main,
            textTransform: 'uppercase',
          }}
          secondary={t('header')}
        />
      </MenuItem>
      {menuItems.map((item, index) => {
        return showSubmenu(item, index)
      })}
      {status === 'authenticated' ? <LogOut /> : <LogIn />}
    </Menu>
  )
}

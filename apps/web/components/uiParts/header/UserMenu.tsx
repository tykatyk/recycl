import { useTheme } from '@mui/material/styles'
import {
  MenuItem,
  ListItem,
  MenuList,
  ListItemText,
  ListItemIcon,
  Menu,
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

  const t = useTranslations('Header.userMenu')
  return (
    <MenuItem component={Link} href={`/auth/login${from}`}>
      <ListItemIcon>
        <LoginIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>{t('logIn')}</ListItemText>
    </MenuItem>
  )
}

const LogOut = ({ status }) => {
  const t = useTranslations('Header.userMenu')
  return (
    <MenuItem
      onClick={() => {
        if (status === 'authenticated') {
          signOut({
            callbackUrl: '/',
          })
        }
      }}
    >
      <ListItemIcon>
        <LogoutIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>{t('logOut')}</ListItemText>
    </MenuItem>
  )
}

export default function UserMenu(props) {
  const theme = useTheme()
  const { locale } = useRouter()

  const { data: session, status } = useSession()
  const { open, anchorEl, handleClose } = props

  const id = useId()
  const menuId = `${id}-menu`

  const t = useTranslations('Header.userMenu')
  const menuItems = [
    {
      text: t('header'),
      items: [
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
      ],
    },
    {
      text: t('mySettings'),
      href: '/my/account',
      icon: SettingsIcon,
    },
  ]

  const showSubmenu = (item, index) => {
    const Icon = item.icon

    if (item.items) {
      return (
        <ListItem sx={{ flexDirection: 'column' }} key={index}>
          <ListItemText
            sx={{
              color: theme.palette.secondary.main,
              textTransform: 'uppercase',
              width: '100%',
            }}
            secondary={item.text}
          />

          <MenuList disablePadding>
            {item.items.map((i, k) => {
              return showSubmenu(i, k)
            })}
          </MenuList>
        </ListItem>
      )
    } else {
      return (
        <MenuItem
          onClick={handleClose}
          key={index}
          component={Link}
          href={item.href}
          locale={locale}
        >
          <ListItemIcon>{Icon ? <Icon /> : null}</ListItemIcon>
          <ListItemText>{item.text}</ListItemText>
        </MenuItem>
      )
    }
  }

  return (
    <Menu
      open={open}
      id={menuId}
      onClose={handleClose}
      anchorEl={anchorEl}
      slotProps={{
        list: {
          'aria-label': 'Меню пользователя',
        },
      }}
    >
      {status === authenticated && (
        <MenuItem divider>
          <ListItemText
            style={{
              textAlign: 'center',
              color: theme.palette.secondary.main,
            }}
            secondary={session ? session.user?.name : ''}
          />
        </MenuItem>
      )}
      {status === authenticated &&
        menuItems.map((item, index) => {
          return showSubmenu(item, index)
        })}
      {status === authenticated ? <LogOut status={status} /> : <LogIn />}
    </Menu>
  )
}

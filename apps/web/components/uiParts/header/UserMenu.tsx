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
import { initializeApollo } from '../../../lib/apolloClient/apolloClient'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import SettingsIcon from '@mui/icons-material/Settings'
import InventoryIcon from '@mui/icons-material/Inventory'
import PlaceIcon from '@mui/icons-material/Place'
import EmailIcon from '@mui/icons-material/Email'
import { useRouter } from 'next/router'
import { useId } from 'react'

const authenticated = 'authenticated'
const apolloClient = initializeApollo()

const menuItems = [
  {
    text: 'Мои',
    items: [
      {
        text: 'Обьявления о наличии вторсырья',
        href: '/my/ads',
        icon: InventoryIcon,
      },
      {
        text: 'Пункты приема вторсырья',
        href: '/my/collection-points',
        icon: PlaceIcon,
      },
      {
        text: 'Подписки на уведомления',
        href: '/my/subscriptions',
        icon: EmailIcon,
      },
    ],
  },
  {
    text: 'Настройки',
    href: '/my/account',
    icon: SettingsIcon,
  },
]

export default function UserMenu(props) {
  const theme = useTheme()
  const { asPath } = useRouter()

  const { data: session, status } = useSession()
  const preventDefault = () => false
  const { open, anchorEl, handleClose } = props

  const id = useId()
  const menuId = `${id}-menu`

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
        <MenuItem onClick={handleClose} key={index}>
          <ListItemIcon>{Icon ? <Icon /> : null}</ListItemIcon>
          <ListItemText>
            <Link
              href={item.href}
              onClick={preventDefault}
              color="inherit"
              underline="none"
              sx={{ display: 'inline-block', width: '100%' }}
            >
              {item.text}
            </Link>
          </ListItemText>
        </MenuItem>
      )
    }
  }

  let logIn = (
    <>
      <ListItemIcon>
        <LoginIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>
        <Link
          href={`/auth/login/?from=${asPath}`}
          color="inherit"
          underline="none"
          sx={{ display: 'inline-block', width: '100%' }}
        >
          Войти
        </Link>
      </ListItemText>
    </>
  )

  if (status === authenticated) {
    logIn = (
      <>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>
          <Link
            href="/"
            onClick={async () => {
              ;(preventDefault(),
                await signOut({
                  callbackUrl: `${window.location.origin}`,
                }))
              await apolloClient.resetStore()
            }}
            color="inherit"
            underline="none"
            sx={{ display: 'inline-block', width: '100%' }}
          >
            Выйти
          </Link>
        </ListItemText>
      </>
    )
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
      <MenuItem onClick={handleClose}>{logIn}</MenuItem>
    </Menu>
  )
}

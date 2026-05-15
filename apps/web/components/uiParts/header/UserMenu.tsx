import { useTheme } from '@mui/material/styles'
import {
  MenuItem,
  ClickAwayListener,
  Grow,
  Paper,
  ListItem,
  MenuList,
  ListItemText,
  ListItemIcon,
  Popper,
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

const authenticated = 'authenticated'

const apolloClient = initializeApollo()

export default function UserMenu(props) {
  const theme = useTheme()

  const { data: session, status } = useSession()
  const preventDefault = () => false
  const { open, anchorEl, handleClose, handleListKeyDown } = props

  const menuItems = [
    {
      text: 'Мои',
      items: [
        {
          text: 'Обьявления о наличии вторсырья',
          href: '/my/applications',
          icon: InventoryIcon,
        },
        {
          text: 'Пункты приема вторсырья',
          href: '/my/events',
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
          href="/auth/login"
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
    <Popper
      open={open}
      anchorEl={anchorEl}
      role={undefined}
      transition
      disablePortal
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin:
              placement === 'bottom' ? 'center top' : 'center bottom',
          }}
        >
          <Paper>
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList id="menu-list-grow" onKeyDown={handleListKeyDown}>
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
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  )
}

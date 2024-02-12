import { styled, useTheme } from '@mui/material/styles'
import {
  MenuItem,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  List,
  ListItem,
  MenuList,
  ListItemText,
} from '@mui/material'
import Link from '../Link'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import { initializeApollo } from '../../../lib/apolloClient/apolloClient'

const authenticated = 'authenticated'

const PREFIX = 'UserMenu'

const classes = {
  link: `${PREFIX}-link`,
}

const StyledPopper = styled(Popper)({
  [`& .${classes.link}`]: {
    width: '100%',
    height: '100%',
  },
})

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
          text: 'Обьявления о наличии отходов',
          href: '/my/applications',
        },
        {
          text: 'Обьявления о вывозе отходов',
          href: '/my/events',
        },
        {
          text: 'Пункты приема отходов',
          href: '#',
        },
      ],
    },
    {
      text: 'Настройки',
      href: '/my/account',
    },
  ]

  const showSubmenu = (item, index) => {
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
          <Link
            href={item.href}
            onClick={preventDefault}
            color="inherit"
            underline="none"
            className={classes.link}
          >
            {item.text}
          </Link>
        </MenuItem>
      )
    }
  }

  let logIn = (
    <Link
      href="/auth/login"
      color="inherit"
      underline="none"
      className={classes.link}
    >
      Войти
    </Link>
  )

  if (status === authenticated) {
    logIn = (
      <Link
        href="/"
        onClick={async () => {
          preventDefault(),
            await signOut({
              callbackUrl: `${window.location.origin}`,
            })
          await apolloClient.resetStore()
        }}
        color="inherit"
        underline="none"
        className={classes.link}
      >
        Выйти
      </Link>
    )
  }

  return (
    <StyledPopper
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
                  <ListItem divider>
                    <ListItemText
                      style={{
                        textAlign: 'center',
                        color: theme.palette.secondary.main,
                      }}
                      secondary={session.user.name}
                    />
                  </ListItem>
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
    </StyledPopper>
  )
}

import React from 'react'
import { styled } from '@mui/material/styles'
import { List, ListItem, ListItemText, Typography } from '@mui/material'
import Link from '../Link'

const PREFIX = 'NavigationLinks'

const classes = {
  navLinks: `${PREFIX}-navLinks`,
  link: `${PREFIX}-link`,
}

const StyledTypography = styled(Typography)(({ theme }) => ({
  [`&.${classes.navLinks}`]: {
    flexGrow: 1,
  },

  [`& .${classes.link}`]: {
    '&:hover': {
      color: '#adce5d',
    },
  },
}))

export default function HeaderLinks(props) {
  const preventDefault = () => false

  const links = [
    {
      text: 'Сдать отходы',
      href: '/proposals',
    },
    {
      text: 'Получить отходы',
      href: '/applications',
    },
    {
      text: 'Сортировать отходы',
      href: '#',
    },
  ]

  const styles = {}
  if (props.isDesktop) {
    ;(styles.display = 'inline-block'), (styles.width = 'auto')
  }
  return (
    <StyledTypography
      component="nav"
      align="right"
      className={classes.navLinks}
    >
      <List>
        {links.map((link, index) => (
          <ListItem key={index} style={styles}>
            <ListItemText>
              <Link
                href={link.href}
                onClick={preventDefault}
                color="inherit"
                underline="none"
                className={classes.link}
              >
                {link.text}
              </Link>
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </StyledTypography>
  )
}

HeaderLinks.defaultProps = {
  isDesktop: true,
}

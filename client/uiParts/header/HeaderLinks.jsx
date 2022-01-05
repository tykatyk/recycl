import React from 'react'
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  makeStyles,
} from '@material-ui/core'
import Link from '../Link.jsx'

const useStyles = makeStyles((theme) => ({
  navLinks: {
    flexGrow: 1,
  },
}))

export default function HeaderLinks(props) {
  const classes = useStyles()

  const preventDefault = () => false

  const links = [
    {
      text: 'Сдать отходы',
      href: '#',
    },
    {
      text: 'Получить отходы',
      href: '/removal/application',
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
    <Typography component="nav" align="right" className={classes.navLinks}>
      <List>
        {links.map((link, index) => (
          <ListItem key={index} style={styles}>
            <ListItemText>
              <Link href={link.href} onClick={preventDefault} color="inherit">
                {link.text}
              </Link>
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Typography>
  )
}

HeaderLinks.defaultProps = {
  isDesktop: true,
}

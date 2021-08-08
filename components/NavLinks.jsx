import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import { Link as RouterLink } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  navLinks: {
    flexGrow: 1
  }
}))

export default function NavLinks(props) {
  const classes = useStyles()

  const preventDefault = () => false

  const links = [
    {
      text: 'Заявки на сортировку',
      href: '#'
    },
    {
      text: 'Заявки на вывоз',
      href: '/removal'
    },
    {
      text: 'Переработчики',
      href: '#'
    },
    {
      text: 'Сортировщики',
      href: '#'
    }
  ]

  const styles = {}
  if (props.isDesktop) {
    ;(styles.display = 'inline-block'), (styles.width = 'auto')
  }
  console.log(props.isDesktop)
  return (
    <Typography component="nav" align="right" className={classes.navLinks}>
      <List>
        {links.map((link, index) => (
          <ListItem key={index} style={styles}>
            <ListItemText>
              <Link
                to={link.href}
                onClick={preventDefault}
                color="inherit"
                component={RouterLink}
              >
                {link.text}
              </Link>
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Typography>
  )
}

NavLinks.defaultProps = {
  isDesktop: true
}

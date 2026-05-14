import { List, ListItem, ListItemText, Typography } from '@mui/material'
import Link from '../Link'

export default function HeaderLinks(props) {
  const { isDesktop = ture } = props

  const preventDefault = () => false

  const links = [
    {
      text: 'Пункты приема вторсырья',
      href: '/collection-points',
    },
    {
      text: 'Объявления о наличии вторсырья',
      href: '/availability',
    },
  ]

  const styles = {}
  if (isDesktop) {
    ;((styles.display = 'inline-block'), (styles.width = 'auto'))
  }
  return (
    <Typography component="nav" align="right" sx={{ flexGrow: 1 }}>
      <List>
        {links.map((link, index) => (
          <ListItem key={index} style={styles}>
            <ListItemText>
              <Link
                href={link.href}
                onClick={preventDefault}
                color="inherit"
                underline="none"
                sx={{
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
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

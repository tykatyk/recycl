import { Box, Link, List, ListItem, ListItemText } from '@mui/material'

type LinkData = {
  text: string
  href: string
}
export default function DesktopNavigation({ links }: { links: LinkData[] }) {
  return (
    <Box
      component="nav"
      sx={{
        width: '100%',
        textAlign: 'right',
      }}
    >
      <List sx={{ width: '100%' }}>
        {links.map((link, index: number) => (
          <ListItem
            key={index}
            sx={{
              display: 'inline-block',
              width: 'auto',
            }}
          >
            <ListItemText>
              <Link
                href={link.href}
                onClick={() => false}
                color="inherit"
                underline="none"
                sx={{
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {link.text}
              </Link>
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

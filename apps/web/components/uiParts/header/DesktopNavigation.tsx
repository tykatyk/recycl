import { Box, Link, List, ListItem, ListItemText } from '@mui/material'
import { useRouter } from 'next/router'

type LinkData = {
  text: string
  href: string
}
export default function DesktopNavigation({ links }: { links: LinkData[] }) {
  const router = useRouter()

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
                  textDecoration:
                    router.asPath === link.href ||
                    router.asPath.includes(`${link.href}/list`)
                      ? 'underline'
                      : 'none',
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

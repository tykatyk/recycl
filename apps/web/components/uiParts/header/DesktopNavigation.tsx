import { Box, List, ListItem, ListItemText } from '@mui/material'
import { useRouter } from 'next/router'
import Link from '../Link'

type LinkData = {
  text: string
  href: string
}
export default function DesktopNavigation({ links }: { links: LinkData[] }) {
  const router = useRouter()
  const { locale } = router

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
                locale={locale}
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

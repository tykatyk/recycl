import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import LocationPinIcon from '@mui/icons-material/LocationPin'
import ListIcon from '@mui/icons-material/List'
import Link from './Link'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'

type AdSidebarChangeViewProps = {
  listViewUrl: string
  mapViewUrl: string
}

export default function AdSidebarChangeView(props: AdSidebarChangeViewProps) {
  const router = useRouter()
  const { locale } = router
  const { listViewUrl = '#', mapViewUrl = '#' } = props
  const isListView = router.asPath.includes('/list')
  const t = useTranslations('AdSidebarChangeView')

  return (
    <ListItem disableGutters dense divider>
      <ListItemButton
        component={Link}
        href={isListView ? mapViewUrl : listViewUrl}
        locale={locale}
      >
        <ListItemIcon>
          {isListView ? (
            <LocationPinIcon color="secondary" />
          ) : (
            <ListIcon color="secondary" />
          )}
        </ListItemIcon>
        <ListItemText primary={isListView ? t('viewOnMap') : t('viewOnList')} />
      </ListItemButton>
    </ListItem>
  )
}

import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import LocationPinIcon from '@mui/icons-material/LocationPin'
import ListIcon from '@mui/icons-material/List'
import { useRouter } from 'next/router'

const viewOnList = 'Смотреть списком'
const viewOnMap = 'Смотреть на карте'

type AdSidebarChangeViewProps = {
  listViewUrl: string
  mapViewUrl: string
}

export default function AdSidebarChangeView(props: AdSidebarChangeViewProps) {
  const router = useRouter()
  const { listViewUrl = '#', mapViewUrl = '#' } = props
  const isListView = router.asPath.includes('/list')

  return (
    <ListItem disableGutters dense divider>
      <ListItemButton
        component="a"
        href={isListView ? mapViewUrl : listViewUrl}
      >
        <ListItemIcon>
          {isListView ? (
            <LocationPinIcon color="secondary" />
          ) : (
            <ListIcon color="secondary" />
          )}
        </ListItemIcon>
        <ListItemText primary={isListView ? viewOnMap : viewOnList} />
      </ListItemButton>
    </ListItem>
  )
}

import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'

import LocationPinIcon from '@mui/icons-material/LocationPin'
import ListIcon from '@mui/icons-material/List'

const viewOnList = 'Смотреть списком'
const viewOnMap = 'Смотреть на карте'
const listViewUrl = '/ads/list'
const mapViewUrl = '/ads'

type AdSidebarChangeViewProps = {
  isMapView: boolean
}

export default function AdSidebarChangeView(props: AdSidebarChangeViewProps) {
  const { isMapView } = props
  return (
    <ListItem disableGutters dense divider>
      <ListItemButton component="a" href={isMapView ? listViewUrl : mapViewUrl}>
        <ListItemIcon>
          {isMapView ? (
            <ListIcon color="secondary" />
          ) : (
            <LocationPinIcon color="secondary" />
          )}
        </ListItemIcon>
        <ListItemText primary={isMapView ? viewOnList : viewOnMap} />
      </ListItemButton>
    </ListItem>
  )
}

import React from 'react'
import {
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core'
import MapSidebarQuantityForm from './MapSidebarQuantityForm'
import LineWeightIcon from '@material-ui/icons/LineWeight'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

export default function MapSidebarQuantity(props) {
  const { open, onClick, min, max } = props

  return (
    <>
      <ListItem button key={'Количество'} onClick={onClick}>
        <ListItemIcon>
          <LineWeightIcon />
        </ListItemIcon>
        <ListItemText primary={'Количество'} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto">
        <List>
          <ListItem>
            <MapSidebarQuantityForm min={min} max={max} />
          </ListItem>
        </List>
      </Collapse>
    </>
  )
}

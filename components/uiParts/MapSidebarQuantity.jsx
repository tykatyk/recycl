import React from 'react'
import {
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import MapSidebarQuantityForm from './MapSidebarQuantityForm'
import LineWeightIcon from '@mui/icons-material/LineWeight'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'

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

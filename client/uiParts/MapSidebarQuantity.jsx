import React from 'react'
import { Collapse, List, ListItem } from '@material-ui/core'
import MapSidebarQuantityForm from './MapSidebarQuantityForm'

export default function MapSidebarQuantity(props) {
  const { open } = props

  return (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <List>
        <ListItem>
          <MapSidebarQuantityForm />
        </ListItem>
      </List>
    </Collapse>
  )
}

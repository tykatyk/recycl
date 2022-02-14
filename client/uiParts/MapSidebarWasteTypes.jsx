import React from 'react'
import { Checkbox, Collapse } from '@material-ui/core'
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { useQuery } from '@apollo/client'
import { GET_WASTE_TYPES } from '../../lib/graphql/queries/wasteType'
import BlurOnIcon from '@material-ui/icons/BlurOn'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

export default function MapSidebarWasteTypes(props) {
  const { loading, data, error } = useQuery(GET_WASTE_TYPES)
  const { open, onClick, checked, handleChange } = props

  return (
    <>
      <ListItem button key={'Тип отходов'} onClick={onClick}>
        <ListItemIcon>
          <BlurOnIcon />
        </ListItemIcon>
        <ListItemText primary={'Тип отходов'} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {data && data.getWasteTypes && (
          <List>
            {data.getWasteTypes.map((item) => {
              const labelId = `checkbox-list-label-${item['_id']}`
              return (
                <ListItem
                  role={undefined}
                  button
                  key={item['_id']}
                  onClick={handleChange(item['_id'])}
                >
                  <Checkbox
                    edge="start"
                    checked={checked.indexOf(item['_id']) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                  <ListItemText
                    id={labelId}
                    primary={item.name}
                    primaryTypographyProps={{ variant: 'body2', noWrap: true }}
                  />
                </ListItem>
              )
            })}
          </List>
        )}
      </Collapse>
    </>
  )
}

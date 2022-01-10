import React, { useState } from 'react'
import { Checkbox, Collapse, makeStyles } from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { useQuery } from '@apollo/client'
import { GET_WASTE_TYPES } from '../../lib/graphql/queries/wasteType'

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}))

export default function MapSidebarWasteTypes(props) {
  const classes = useStyles()
  const [checked, setChecked] = useState([0])

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }
    setChecked(newChecked)
  }
  const { loading, data, error } = useQuery(GET_WASTE_TYPES)
  const { open } = props

  if (data && data.getWasteTypes) {
    return (
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List>
          {data.getWasteTypes.map((item) => {
            const labelId = `checkbox-list-label-${item['_id']}`
            return (
              <ListItem
                role={undefined}
                button
                key={item['_id']}
                onClick={handleToggle(item.name)}
                className={classes.nested}
              >
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(item.name) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
                <ListItemText id={labelId} primary={item.name} />
              </ListItem>
            )
          })}
        </List>
      </Collapse>
    )
  }
  return null
}

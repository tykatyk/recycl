import React from 'react'
import { styled } from '@mui/material/styles'
import {
  Collapse,
  Radio,
  List,
  Typography,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material'
import { useQuery } from '@apollo/client'
import { GET_WASTE_TYPES } from '../../lib/graphql/queries/wasteType'
import PageLoadingCircle from './PageLoadingCircle'
import BlurOnIcon from '@mui/icons-material/BlurOn'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'

const PREFIX = 'MapSidebarWasteTypes'

const classes = {
  loading: `${PREFIX}-loading`,
  error: `${PREFIX}-error`,
}

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({ theme }) => ({
  [`& .${classes.loading}`]: {
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
  },

  [`& .${classes.error}`]: {
    whiteSpace: 'normal',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
}))

export default function MapSidebarWasteTypes(props) {
  const { loading, data, error } = useQuery(GET_WASTE_TYPES)
  const { open, onClick, selectedValue, handleChange } = props

  return (
    <Root>
      <ListItemButton key={'Тип отходов'} onClick={onClick}>
        <ListItemIcon>
          <BlurOnIcon />
        </ListItemIcon>
        <ListItemText primary={'Тип отходов'} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      {loading && <PageLoadingCircle className={classes.loading} />}
      {error && (
        <Typography
          className={classes.error}
          color="error"
          variant="body2"
          align="center"
        >
          Не удалось загрузить типы отходов
        </Typography>
      )}
      {data && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          {data && data.getWasteTypes && (
            <List>
              {data.getWasteTypes.map((item) => {
                const labelId = `checkbox-list-label-${item['name']}`
                return (
                  <ListItemButton
                    role={undefined}
                    key={item['_id']}
                    onClick={handleChange(item['name'])}
                  >
                    <Radio
                      checked={selectedValue === item['name']}
                      value={item['_id']}
                      name="waste-type"
                      inputProps={{ 'aria-label': item.name }}
                    />
                    <ListItemText
                      id={labelId}
                      primary={item.name}
                      primaryTypographyProps={{
                        variant: 'body2',
                        noWrap: true,
                      }}
                    />
                  </ListItemButton>
                )
              })}
            </List>
          )}
        </Collapse>
      )}
    </Root>
  )
}

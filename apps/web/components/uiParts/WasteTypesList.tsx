import React from 'react'
import { css, styled } from '@mui/material/styles'
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

export default function WasteTypesList(props) {
  const { loading, data, error } = useQuery(GET_WASTE_TYPES)
  const { open, onClick, selectedValue, handleChange } = props

  return (
    <List disablePadding sx={{ flex: '1 1 100%' }}>
      <ListItem disableGutters dense>
        <ListItemButton key={'Тип вторсырья'} onClick={onClick}>
          <ListItemIcon>
            <BlurOnIcon />
          </ListItemIcon>
          <ListItemText primary={'Тип вторсырья'} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        {loading && (
          <PageLoadingCircle
            css={css({
              display: 'flex',
              justifyContent: 'center',
              position: 'relative',
            })}
          />
        )}
        {error && (
          <Typography
            sx={{
              whiteSpace: 'normal',
              ml: 2,
              mr: 2,
            }}
            color="error"
            variant="body2"
            align="center"
          >
            Не удалось загрузить типы отходов
          </Typography>
        )}
      </ListItem>

      <ListItem disableGutters dense>
        {data && (
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
            sx={{ width: '100%' }}
          >
            {data && data.getWasteTypes && (
              <List sx={{ width: '100%' }} component={'div'}>
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
      </ListItem>
    </List>
  )
}

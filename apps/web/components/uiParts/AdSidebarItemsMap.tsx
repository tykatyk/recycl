import {
  Autocomplete,
  Box,
  ListItem,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'

type WasteItem = {
  _id: string
  name: string
}

export default function AdSidebarItemsMap(props: {
  handleChange: (newValue: string) => void
}) {
  const [wasteTypes, setWasteTypes] = useState<WasteItem[]>([])
  const { handleChange } = props

  useEffect(() => {
    const fetcher = async () => {
      try {
        const response = await fetch('/api/waste-types')
        const data = await response.json()

        setWasteTypes(data)
      } catch (error) {
        console.log(error)
      }
    }
    fetcher()
  }, [])

  return (
    <ListItem disableGutters dense divider>
      <Box
        sx={{
          p: 1,
          mb: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography
            component="h1"
            variant="body1"
            sx={{ fontWeight: 'bold' }}
            align="center"
            color="#91d608"
          >
            Карта наличия вторсырья
          </Typography>
        </Box>
        <Box sx={{ width: '100%' }}>
          <Box>
            <Autocomplete
              disablePortal
              options={wasteTypes}
              sx={{ width: '100%' }}
              onChange={(event, newValue) => {
                handleChange(newValue ? newValue.name : '')
              }}
              getOptionLabel={(option) => {
                if (option) {
                  return option.name
                }
                return ''
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="wasteType"
                  name="wasteType"
                  label="Тип вторсырья"
                />
              )}
            />
          </Box>
        </Box>
      </Box>
    </ListItem>
  )
}

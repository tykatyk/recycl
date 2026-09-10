import {
  Autocomplete,
  Box,
  ListItem,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { wasteTypeNames } from '@recycl/shared/dist/constants'
import { wasteTypeFetcher } from '../../lib/helpers/dataFetcher'
import type { Waste } from '../../lib/types/waste'

export default function AdSidebarItemsMap(props: {
  handleChange: (newValue: string) => void
  h1: string
}) {
  const [wasteTypes, setWasteTypes] = useState<Waste[]>([])
  const { handleChange, h1 } = props
  const t = useTranslations('AdSidebarItemsMap')
  const tWasteTypes = useTranslations('WasteTypes')

  useEffect(() => {
    const fetcher = async () => {
      try {
        const data: Waste[] = await wasteTypeFetcher()
        const sorted = data.sort((a, b) =>
          tWasteTypes(a.name).localeCompare(tWasteTypes(b.name)),
        )
        setWasteTypes(sorted)
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
            {h1}
          </Typography>
        </Box>
        <Box sx={{ width: '100%' }}>
          <Box>
            <Autocomplete<Waste>
              disablePortal
              options={wasteTypes}
              sx={{ width: '100%' }}
              onChange={(event, newValue) => {
                handleChange(newValue ? newValue.name : '')
              }}
              getOptionLabel={(option) =>
                wasteTypeNames.includes(option.name)
                  ? tWasteTypes(option.name)
                  : ''
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="wasteType"
                  name="wasteType"
                  label={t('wasteType')}
                />
              )}
            />
          </Box>
        </Box>
      </Box>
    </ListItem>
  )
}

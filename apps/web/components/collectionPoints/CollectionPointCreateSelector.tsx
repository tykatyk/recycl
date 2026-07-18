import Layout from '../layouts/Layout'
import { useState } from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Typography,
} from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { collectionPointTypes } from '@recycl/shared/dist/constants'

const baseUrl = '/my/collection-points/create'

export default function CollectionPointCreateSelector() {
  const title = 'Выберите тип пункта приема вторсырья | Recycl'
  const router = useRouter()
  const [selected, setSelected] = useState<string>('')

  return (
    <Layout title={title}>
      <Box>
        <Typography component="h1" variant="h4" sx={{ mb: 4 }}>
          Выберите тип пункта приема вторсырья, который вы хотите создать
        </Typography>

        <Grid
          container
          maxWidth={'md'}
          sx={{
            '& > div': {
              pb: 3,
            },
            border: 'none',
          }}
        >
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                {'Тип пункта приема вторсырья'}
              </InputLabel>
              <Select
                name={'collectionPointType'}
                labelId="collection-point-type-label"
                id="collection-point-type"
                label={'Тип пункта приема вторсырья'}
                value={selected}
                onChange={(e: SelectChangeEvent<string>) => {
                  setSelected(e.target.value)
                }}
              >
                {Object.keys(collectionPointTypes).map((key, index) => (
                  <MenuItem key={index} value={key}>
                    {collectionPointTypes[key]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Button
                variant="contained"
                onClick={() => {
                  if (!selected) return
                  router.push(`${baseUrl}/${selected}`)
                }}
              >
                Выбрать
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  )
}

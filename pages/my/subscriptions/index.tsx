import {
  Grid,
  Typography,
  Tabs,
  Box,
  FormControlLabel,
  Switch,
  Button,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import Layout from '../../../components/layouts/Layout'
import NoRows from '../../../components/uiParts/NoRows'
const mobileStationAvailable = `Получать уведомления о появлении передвижных пунктов приема отходов из мох обьявлений о наличии отходов`
const wasteAvailable = `Получать уведомления о добавлении новых объявлений о наличии отходов`
const titleHeading = 'Мои подписки на получение уведомлений'
const wasteAvailableHref = '/my/subscriptions/wasteAvailable'
import SettingsIcon from '@mui/icons-material/Settings'
import { useEffect, useState } from 'react'

export default function MySubscriptions() {
  const [checked, setChecked] = useState(false)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
  }

  async function fetchSubscriptionStatus() {
    return await fetch('/api/subscriptions', {
      method: 'GET',
    })
  }

  useEffect(() => {
    fetchSubscriptionStatus()
      .then((respone) => {
        return respone.json
      })
      .then((result) => {
        console.log(result)
      })
      .catch((err) => console.log(err))
  }, [])

  return (
    <Layout title={`${titleHeading} | Recycl`}>
      <Typography gutterBottom variant="h4" component="h1" sx={{ mb: 8 }}>
        {titleHeading}
      </Typography>

      <Grid
        container
        spacing={1}
        sx={{
          alignItems: 'center',
          borderTop: '1px solid #fff',
          borderBottom: '1px solid #fff',
          pt: 2,
          pb: 2,
        }}
      >
        <Grid item xs={12}>
          <Typography>{mobileStationAvailable}</Typography>
        </Grid>

        <Grid item xs={12}>
          <Box>
            <FormControlLabel
              control={
                <Switch
                  color="secondary"
                  checked={checked}
                  onChange={handleChange}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label="Включено"
            />
          </Box>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={1}
        sx={{
          alignItems: 'center',
          // borderTop: '1px solid #fff',
          borderBottom: '1px solid #fff',
          pt: 2,
          pb: 2,
        }}
      >
        <Grid item xs={12}>
          <Typography> {wasteAvailable}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Box>
            <FormControlLabel
              control={<Switch defaultChecked color="secondary" />}
              label="Включено"
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box>
            <Button
              startIcon={<SettingsIcon />}
              color="secondary"
              href={wasteAvailableHref}
            >
              Настроить
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Layout>
  )
}

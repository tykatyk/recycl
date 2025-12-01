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
import { useEffect, useMemo, useState } from 'react'

export default function MySubscriptions() {
  const [checked, setChecked] = useState(false)
  const [allSubs, setAllSubs] = useState([])
  const [userSubs, setUserSubs] = useState([])
  const userSubsForSearch = useMemo(() => {
    return new Set(userSubs)
  }, [userSubs])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
  }

  async function fetchAllSubs() {
    return await fetch('/api/subscriptions/variant', {
      method: 'GET',
    })
      .then((respone) => {
        return respone.json()
      })
      .then((result) => {
        setAllSubs(result)
      })
      .catch((err) => console.log(err))
  }

  async function fetchUserSubs() {
    return await fetch('/api/subscriptions', {
      method: 'GET',
    })
      .then((respone) => {
        return respone.json()
      })
      .then((result) => {
        setUserSubs(result.elements || [])
      })
      .catch((err) => console.log(err))
  }

  async function updateUserSubs(userSubs) {
    return await fetch('/api/subscriptions', {
      method: 'POST',
      body: JSON.stringify({ userSubs }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((respone) => {
        return respone.json()
      })
      .then((result) => {
        console.log('updated user sub')
        console.log(result)
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    fetchUserSubs()
    fetchAllSubs()
  }, [])

  useEffect(() => {})

  return (
    <Layout title={`${titleHeading} | Recycl`}>
      <Typography gutterBottom variant="h4" component="h1" sx={{ mb: 8 }}>
        {titleHeading}
      </Typography>

      {allSubs.map((sub, index) => {
        return (
          <Grid
            key={index}
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
              <Typography>{sub.description}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      color="secondary"
                      checked={userSubsForSearch.has(sub.name)}
                      onChange={async (e) => {
                        handleChange(e)
                        let updatedSubs
                        if (userSubsForSearch.has(sub.name)) {
                          updatedSubs = userSubs.filter((subToFilter) => {
                            return subToFilter.name !== sub.name
                          })
                        } else {
                          updatedSubs = [...userSubs, sub.name]
                        }
                        setUserSubs(updatedSubs)

                        await updateUserSubs(updatedSubs)
                      }}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  }
                  label="Включено"
                />
              </Box>
            </Grid>
          </Grid>
        )
      })}

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

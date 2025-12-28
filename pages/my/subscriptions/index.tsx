import {
  Grid,
  Typography,
  FormControlLabel,
  Switch,
  Button,
} from '@mui/material'
import Layout from '../../../components/layouts/Layout'
import PageLoadingCircle from '../../../components/uiParts/PageLoadingCircle'
import SettingsIcon from '@mui/icons-material/Settings'
import Snackbars from '../../../components/uiParts/Snackbars'
import { useEffect, useMemo, useState } from 'react'
const loadingErrorText = 'Ошибка при загрузке данных'
const updatingErrorText = 'Ошибка при обновлении данных'
const titleHeadingText = 'Мои подписки на получение уведомлений'
const enabledText = 'Включено'
const disabledText = 'Выключено'
const configText = 'Настроить'
const allSubsApi = '/api/subscriptions/variant'
const getUserSubsApi = '/api/subscriptions'
const updateUserSubsApi = '/api/users'
const wasteAvailable = 'wasteAvailable'
const wasteAvailableHref = '/my/subscriptions/wasteAvailable'

type SubscriptionVariant = {
  name: String
  description: String
}

export default function MySubscriptions() {
  const [backendError, setBackendError] = useState('')
  const [allSubs, setAllSubs] = useState<SubscriptionVariant[]>([])
  const [userSubs, setUserSubs] = useState<String[]>([])
  const [loading, setLoading] = useState(false)
  const userSubsForSearch = useMemo(() => {
    return new Set(userSubs)
  }, [userSubs])

  const handleClose = () => setBackendError('')

  const handleChange = async (subName: String) => {
    let updatedSubs: String[] = []
    if (userSubsForSearch.has(subName)) {
      updatedSubs = userSubs.filter((item) => {
        return item !== subName
      })
    } else {
      updatedSubs = [...userSubs, subName]
    }
    setUserSubs(updatedSubs)
    await updateUserSubscriptions(updatedSubs)
  }

  async function fetchAllSubscriptions() {
    return await fetch(allSubsApi, {
      method: 'GET',
    })
      .then((respone) => {
        return respone.json()
      })
      .then((result: SubscriptionVariant[]) => {
        return result
      })
  }

  async function fetchUserSubscriptions() {
    return await fetch(getUserSubsApi, {
      method: 'GET',
    })
      .then((respone) => {
        return respone.json()
      })
      .then((result) => {
        return result.subscriptions || []
      })
  }

  async function updateUserSubscriptions(updatedSubs: typeof userSubs) {
    await fetch(updateUserSubsApi, {
      method: 'POST',
      body: JSON.stringify({ updatedSubs }),
      headers: { 'Content-Type': 'application/json' },
    }).catch((_) => setBackendError(updatingErrorText))
  }

  useEffect(() => {
    async function setSubs() {
      setLoading(true)
      try {
        const allSubs = await fetchAllSubscriptions()
        setAllSubs(allSubs)
        const userSubs = await fetchUserSubscriptions()
        setUserSubs(userSubs)
      } catch (_) {
        setBackendError(loadingErrorText)
      }

      setLoading(false)
    }
    setSubs()
  }, [])

  let content: React.ReactNode = null

  const data = allSubs.map((sub, index) => {
    return (
      <Grid
        key={index}
        container
        spacing={1}
        sx={{
          alignItems: 'center',
          borderBottom: '1px solid #7d7d7d',
          pt: 3,
          pb: 3,
        }}
      >
        <Grid item xs={12}>
          <Typography>{sub.description}</Typography>
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                color="secondary"
                checked={userSubsForSearch.has(sub.name)}
                onChange={async (e) => {
                  await handleChange(sub.name)
                }}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            }
            label={userSubsForSearch.has(sub.name) ? enabledText : disabledText}
          />
        </Grid>
        {sub.name === wasteAvailable ? (
          <Grid item xs={12}>
            <Button
              startIcon={<SettingsIcon />}
              color="secondary"
              href={wasteAvailableHref}
              disabled={userSubsForSearch.has(sub.name) ? false : true}
            >
              {configText}
            </Button>
          </Grid>
        ) : null}
      </Grid>
    )
  })

  if (loading) {
    content = <PageLoadingCircle />
  } else {
    content = data
  }

  return (
    <Layout title={`${titleHeadingText} | Recycl`}>
      <Typography gutterBottom variant="h4" component="h1" sx={{ mb: 8 }}>
        {titleHeadingText}
      </Typography>
      {content}
      <Snackbars
        severity="error"
        message={backendError}
        open={!!backendError}
        handleClose={handleClose}
      />
    </Layout>
  )
}

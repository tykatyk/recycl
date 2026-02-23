import {
  Grid,
  Typography,
  FormControlLabel,
  Switch,
  Button,
  Box,
} from '@mui/material'
import Layout from '../../../components/layouts/Layout'
import PageLoadingCircle from '../../../components/uiParts/PageLoadingCircle'
import SettingsIcon from '@mui/icons-material/Settings'
import Snackbars from '../../../components/uiParts/Snackbars'
import RedirectUnathenticatedUser from '../../../components/uiParts/RedirectUnathenticatedUser'
import { useEffect, useMemo, useState } from 'react'
import type { SubscriptionVariant } from '../../../lib/db/models/subscriptionVariant'

const loadingErrorText = 'Ошибка при загрузке данных'
const updatingErrorMessage = 'Ошибка при обновлении данных'
const titleHeadingText = 'Мои подписки на получение уведомлений'
const enabledText = 'Включено'
const disabledText = 'Выключено'
const configText = 'Настроить'
const subscriptionVariantsApi = '/api/subscriptions/variant'
const subscriptionsApi = '/api/subscriptions'
const mySubscriptionsUrl = '/my/subscriptions/'

const getSubscriptionConfigUrl = (id: string) => {
  return `${mySubscriptionsUrl}${id}`
}

type UserSubs = string[]

export default function MySubscriptions() {
  const [backendError, setBackendError] = useState('')
  const [allSubs, setAllSubs] = useState<
    ({ _id: string } & SubscriptionVariant)[]
  >([])
  const [userSubs, setUserSubs] = useState<UserSubs>([])
  const [loading, setLoading] = useState(false)

  const userSubsForSearch = useMemo(() => {
    return new Set(userSubs)
  }, [userSubs])

  const handleClose = () => setBackendError('')

  const handleChange = async (id: string) => {
    let updatedUserSubs: UserSubs = []
    let subscribed = false

    if (userSubsForSearch.has(id)) {
      updatedUserSubs = userSubs.filter((item) => {
        return item !== id
      })
    } else {
      updatedUserSubs = [...userSubs, id]
      subscribed = true
    }
    setUserSubs(updatedUserSubs)
    await updateUserSubscription({ variant: id, subscribed })
  }

  async function fetchAllSubscriptions() {
    return await fetch(subscriptionVariantsApi)
      .then((respone) => {
        return respone.json()
      })
      .then((result) => {
        //ToDo
        return result
      })
  }

  async function fetchUserSubscriptions() {
    return await fetch(subscriptionsApi)
      .then((respone) => {
        return respone.json()
      })
      .then((result) => {
        return result || []
      })
  }
  async function updateUserSubscription(subscription: {
    variant: string
    subscribed: boolean
  }) {
    await fetch(subscriptionsApi, {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: { 'Content-Type': 'application/json' },
    }).catch((_) => setBackendError(updatingErrorMessage))
  }

  useEffect(() => {
    async function setSubs() {
      try {
        const allSubs = await fetchAllSubscriptions()
        setAllSubs(allSubs)
        const userSubs = await fetchUserSubscriptions()
        setUserSubs(userSubs)
      } catch (e) {
        setBackendError(loadingErrorText)
      }
    }

    setLoading(true)
    setSubs().finally(() => setLoading(false))
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
          <Typography>{sub.title}</Typography>
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                color="secondary"
                checked={userSubsForSearch.has(sub._id)}
                onChange={async (e) => {
                  await handleChange(sub._id)
                }}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            }
            label={userSubsForSearch.has(sub._id) ? enabledText : disabledText}
          />
        </Grid>
        {sub.isConfigurable ? (
          <Grid item xs={12}>
            <Button
              startIcon={<SettingsIcon />}
              color="secondary"
              href={getSubscriptionConfigUrl(sub._id)}
              disabled={userSubsForSearch.has(sub._id) ? false : true}
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
      <RedirectUnathenticatedUser>
        <Box>
          <Typography gutterBottom variant="h4" component="h1" sx={{ mb: 4 }}>
            {titleHeadingText}
          </Typography>
          {content}
        </Box>

        <Snackbars
          severity="error"
          message={backendError}
          open={!!backendError}
          handleClose={handleClose}
        />
      </RedirectUnathenticatedUser>
    </Layout>
  )
}

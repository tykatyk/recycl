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
import type { SubscriptionVariant } from '@recycl/shared/dist/server/db/models/subscriptionVariant'
import { subscriptionVariantNames } from '@recycl/shared/dist/server/subscription'
import { subscriptionConfig } from '../../../lib/helpers/subscription'
import HeadingWithDescription, {
  HeadingDetails,
} from '../../../components/uiParts/HeadingWithDescription'

const loadingErrorText = 'Ошибка при загрузке данных'
const updatingErrorMessage = 'Ошибка при обновлении данных'
const titleHeadingText = 'Мои подписки на получение уведомлений'
const enabledText = 'Включено'
const disabledText = 'Выключено'
const configText = 'Настроить'

const subscriptionVariantsApi = '/api/subscriptions/variant'
const subscriptionsApi = '/api/subscriptions'

type SubscriptionName = string[]

type SubsVarNameType = typeof subscriptionVariantNames

export default function MySubscriptions() {
  const [backendError, setBackendError] = useState('')
  const [allSubs, setAllSubs] = useState<
    ({ _id: string } & SubscriptionVariant)[]
  >([])
  const [userSubs, setUserSubs] = useState<SubscriptionName>([])
  const [loading, setLoading] = useState(false)
  const [showDetails, setShowDetails] = useState<
    SubsVarNameType[keyof SubsVarNameType][]
  >([])

  const userSubsForSearch = useMemo(() => {
    return new Set(userSubs)
  }, [userSubs])

  const handleClose = () => setBackendError('')

  const handleChange = async (name: string) => {
    let updatedUserSubs: SubscriptionName = []
    let subscribed = false

    if (userSubsForSearch.has(name)) {
      updatedUserSubs = userSubs.filter((item) => {
        return item !== name
      })
    } else {
      updatedUserSubs = [...userSubs, name]
      subscribed = true
    }
    setUserSubs(updatedUserSubs)
    await updateUserSubscription({ variant: name, subscribed })
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
    return await fetch('/api/subscriptions?subscribed=true')
      .then((respone) => {
        if (!respone.ok) {
          throw new Error('Ошибка сервера')
        }
        return respone.json()
      })
      .then((result) => {
        return result || []
      })
      .catch((err) => {
        setBackendError(err.message)
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
          pb: 3,
        }}
      >
        <Grid size={{ xs: 12 }}>
          <HeadingWithDescription
            detailedDescription={
              <HeadingDetails
                details={subscriptionConfig[sub.name].description}
              />
            }
          >
            <Typography>{subscriptionConfig[sub.name].title}</Typography>
          </HeadingWithDescription>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
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
        <Grid size={{ xs: 12 }}>
          <Button
            variant="contained"
            size="small"
            endIcon={<SettingsIcon />}
            href={subscriptionConfig[sub.name].href}
            disabled={userSubsForSearch.has(sub.name) ? false : true}
          >
            {configText}
          </Button>
        </Grid>
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
          <Typography sx={{ mb: 4 }} variant="h4" component="h1">
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

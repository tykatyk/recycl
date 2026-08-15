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
import RedirectUnathenticatedUser from '../../../components/uiParts/RedirectUnathenticatedUser'
import { useEffect, useMemo, useState } from 'react'
import type { SubscriptionVariant } from '@recycl/shared/dist/server/db/models/subscriptionVariant'
import { subscriptionConfig } from '../../../lib/helpers/subscription'
import HeadingWithDescription, {
  HeadingDetails,
} from '../../../components/uiParts/HeadingWithDescription'
import { enqueueSnackbar } from 'notistack'

const errorMessage = 'Что то пошло не так'
const enabledText = 'Включено'
const disabledText = 'Выключено'
const configText = 'Настроить'

const api = '/api/my/subscriptions'

const brand = process.env.NEXT_PUBLIC_BRAND || ''
const h1 = 'Мои подписки на получение уведомлений'
const title = `${h1} | ${brand}`

type SubscriptionName = string[]

export default function MySubscriptions() {
  const [allSubs, setAllSubs] = useState<
    ({ _id: string } & SubscriptionVariant)[]
  >([])
  const [userSubs, setUserSubs] = useState<SubscriptionName>([])
  const [loading, setLoading] = useState(false)

  const userSubsForSearch = useMemo(() => {
    return new Set(userSubs)
  }, [userSubs])

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
    const response = await fetch(`${api}/variant`)
    if (!response.ok) {
      throw new Error(errorMessage)
    }
    return await response.json()
  }

  async function fetchUserSubscriptions() {
    const response = await fetch(`${api}?subscribed=true`)
    if (!response.ok) {
      throw new Error(errorMessage)
    }
    return (await response.json()) || []
  }

  async function updateUserSubscription(subscription: {
    variant: string
    subscribed: boolean
  }) {
    const response = await fetch(api, {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: { 'Content-Type': 'application/json' },
    })
    if (!response.ok) {
      throw new Error(errorMessage)
    }
  }

  useEffect(() => {
    async function setSubs() {
      try {
        const allSubs = await fetchAllSubscriptions()
        setAllSubs(allSubs)
        const userSubs = await fetchUserSubscriptions()
        setUserSubs(userSubs)
      } catch (e) {
        enqueueSnackbar(errorMessage, { variant: 'error' })
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
    <Layout title={title}>
      <RedirectUnathenticatedUser>
        <Box>
          <Typography
            sx={{ mt: 2, mb: 3, width: '100%' }}
            variant="h4"
            component="h1"
          >
            {h1}
          </Typography>
          {content}
        </Box>
      </RedirectUnathenticatedUser>
    </Layout>
  )
}

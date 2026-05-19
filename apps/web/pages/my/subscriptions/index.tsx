import {
  Grid,
  Typography,
  FormControlLabel,
  Switch,
  Button,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material'
import Layout from '../../../components/layouts/Layout'
import PageLoadingCircle from '../../../components/uiParts/PageLoadingCircle'
import SettingsIcon from '@mui/icons-material/Settings'
import Snackbars from '../../../components/uiParts/Snackbars'
import RedirectUnathenticatedUser from '../../../components/uiParts/RedirectUnathenticatedUser'
import { useEffect, useMemo, useState } from 'react'
import type { SubscriptionVariant } from '@recycl/shared/dist/server/db/models/subscriptionVariant'
import HelpIcon from '@mui/icons-material/Help'
import { subscriptionVariantNames } from '@recycl/shared/dist/server/subscription'

const loadingErrorText = 'Ошибка при загрузке данных'
const updatingErrorMessage = 'Ошибка при обновлении данных'
const titleHeadingText = 'Мои подписки на получение уведомлений'
const enabledText = 'Включено'
const disabledText = 'Выключено'
const configText = 'Настроить'
const subscriptionConfig = {
  wasteAvailable: {
    title:
      'Получать уведомления о появлении в моем регионе вторсырья для переработки или утилизации',
    description: `Подписка предназначена для тех, кто занимается сбором вторсырья для дальнейшей переработки или утилизации. Она позволяет находить сырье, которое вам нужно, в местах, в которых вы работаете. Для добавления подписки укажите местоположение, относительно которого будет производится поиск, радиус поиска и один или несколько видов вторсырья. После добавления подписки, вы будете получать уведомления на электронную почту о новых объявлениях о наличии вторсырья.`,
    href: '/my/subscriptions/waste-available',
  },
  wasteRemoval: {
    title:
      'Получать уведомления о появлении в моем регионе пунктов приема вторсырья',
    description: `Подписка предназначена для тех, кто хочет сдать вторсырье на переработку, но поблизости нет пунктов приема. Данные о типах и местоположении вторсырья, для которых будет производится поиск пунктов приема, берутся из ваших объявлений о наличии вторсырья. Для добавления подписки укажите радиус, в котором будет производится поиск.`,
    href: '/my/subscriptions/waste-removal',
  },
} as const
const subscriptionVariantsApi = '/api/subscriptions/variant'
const subscriptionsApi = '/api/subscriptions'
const mySubscriptionsUrl = '/my/subscriptions/'

type SubscriptionName = string[]

const SubscriptionDetails = (props: { details: string }) => {
  const { details } = props

  return (
    <Box
      bgcolor="secondary.main"
      sx={{
        p: 2,
        border: '1px dashed #ccc',
        borderRadius: '8px',
      }}
    >
      <Typography
        sx={{
          fontWeight: 300,
          fontSize: '0.875rem',
          color: 'secondary.contrastText',
        }}
      >
        {details}
      </Typography>
    </Box>
  )
}
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>{subscriptionConfig[sub.name].title}</Typography>
              <Tooltip title="Подробнее об этой подписке">
                <IconButton
                  onClick={() => {
                    const updated = showDetails.includes(sub.name)
                      ? showDetails.filter((item) => item !== sub.name)
                      : [...showDetails, sub.name]
                    setShowDetails(updated)
                  }}
                >
                  <HelpIcon />
                </IconButton>
              </Tooltip>
            </Box>
            {showDetails.includes(sub.name) ? (
              <SubscriptionDetails
                details={subscriptionConfig[sub.name].description}
              />
            ) : null}
          </Box>
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

import Layout from '../../../../components/layouts/Layout'
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
import Head from 'next/head'
import { useTranslations } from 'next-intl'
import CanonicalUrl from '../../../../components/uiParts/CanonicalUrl'
import RedirectUnauthenticatedUser from '../../../../components/uiParts/RedirectUnauthenticatedUser'

const baseUrl = '/my/collection-points/create'
const brand = process.env.NEXT_PUBLIC_BRAND || ''

export default function CreateCollectionPoint() {
  const router = useRouter()
  const { locale, locales, defaultLocale, asPath } = router
  const [selected, setSelected] = useState<string>('')
  const t = useTranslations('CreateCollectionPointPage')
  const tCollectionPointTypes = useTranslations('CollectionPointTypes')

  return (
    <RedirectUnauthenticatedUser>
      <Head>
        <title>{`${t('title')} | ${brand}`}</title>
        <meta name="robots" content="noindex, nofollow"></meta>
        <CanonicalUrl
          asPath={asPath}
          locale={locale}
          defaultLocale={defaultLocale}
          locales={locales}
        />
      </Head>
      <Layout>
        <Box>
          <Typography component="h1" variant="h4" sx={{ mb: 4 }}>
            {t('selectCollectionPointType')}
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
                  {t('inputLabel')}
                </InputLabel>
                <Select
                  name={'collectionPointType'}
                  labelId="collection-point-type-label"
                  id="collection-point-type"
                  label={t('selectLabel')}
                  value={selected}
                  onChange={(e: SelectChangeEvent<string>) => {
                    setSelected(e.target.value)
                  }}
                >
                  {collectionPointTypes.map((key, index) => (
                    <MenuItem key={index} value={key}>
                      {tCollectionPointTypes(key)}
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
                    router.push(`${baseUrl}/${selected}`, undefined, { locale })
                  }}
                >
                  {t('submit')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Layout>
    </RedirectUnauthenticatedUser>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}`)).default,
    },
  }
}

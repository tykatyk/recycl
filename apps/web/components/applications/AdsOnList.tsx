import { useEffect, useState } from 'react'
import MapLayout from '../layouts/MapLayout'
import AdsSidebarListView from '../uiParts/AdSidebarListView'
import { Box } from '@mui/material'
import { useSnackbar } from 'notistack'
import type {
  ClusterProperties,
  FeatureProperties,
} from '@recycl/shared/dist/server/types'
import Header from '../uiParts/header/Header'
import Footer from '../uiParts/Footer'

const errorMessage = 'Что-то пошло не так'

const mainCss = {
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 auto',
}

export default function AdsOnList() {
  const [selectedValue, setSelectedValue] = useState('')
  const { enqueueSnackbar } = useSnackbar()

  const handleChange = (value: string) => setSelectedValue(value)

  useEffect(() => {
    if (!selectedValue) return

    // const fetcher = async () => {
    //   try {
    //     const query = new URLSearchParams({
    //       wasteType: selectedValue,
    //     })

    //     const response = await fetch(`/api/ads?${query.toString()}`)

    //     if (!response.ok) {
    //       throw new Error('Response is not OK')
    //     }

    //     const data  = await response.json()

    //     if (data) {
    //       //ToDo: implement
    //     } else {
    //       //ToDo: implement
    //     }
    //   } catch (error) {
    //     console.log(error)
    //     enqueueSnackbar(errorMessage, {
    //       variant: 'error',
    //     })
    //   }
    // }

    // fetcher()
  }, [selectedValue])

  return (
    <MapLayout
      title={`Объявления о наличии вторсырья | ${process.env.NEXT_PUBLIC_BRAND}`}
    >
      <AdsSidebarListView
        handleChange={handleChange}
        selectedValue={selectedValue}
      />

      <Box component="main" sx={mainCss}>
        <Header />

        <Footer />
      </Box>
    </MapLayout>
  )
}

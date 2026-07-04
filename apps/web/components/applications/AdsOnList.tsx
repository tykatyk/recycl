import { useEffect, useState } from 'react'
import { Box, Container } from '@mui/material'
import { useSnackbar } from 'notistack'
import AdSidebarItemsList from '../uiParts/AdSidebarItemsList'
import AdSidebar from '../uiParts/AdSidebar'
import Head from '../uiParts/Head'
import {
  Main,
  StyledFooter,
  StyledHeader,
  drawerWidth,
} from '../uiParts/AdPageComponents'

const errorMessage = 'Что-то пошло не так'

export default function AdsOnList() {
  const [selectedValue, setSelectedValue] = useState('')
  const { enqueueSnackbar } = useSnackbar()

  const handleChange = (value: string) => setSelectedValue(value)
  const [drawerOpen, setDrawerOpen] = useState(true)
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen)
  }

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
    <>
      <Head
        title={`Объявления о наличии вторсырья | ${process.env.NEXT_PUBLIC_BRAND}`}
      />
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <StyledHeader drawerOpen={drawerOpen} />
        <Box sx={{ display: 'flex', flexBasis: '100%' }}>
          <AdSidebar
            sx={{
              width: drawerWidth,
            }}
            drawerOpen={drawerOpen}
            drawerWidth={drawerWidth}
            handleDrawerToggle={handleDrawerToggle}
          >
            <AdSidebarItemsList handleChange={setSelectedValue} />
          </AdSidebar>

          <Main drawerOpen={drawerOpen}>
            <Box
              sx={(theme) => ({
                display: 'flex',
                alignItems: 'center',
                padding: theme.spacing(0, 1),
                // necessary for content to be below app bar
                ...theme.mixins.toolbar,
                justifyContent: 'flex-end',
              })}
            />
            {/* //content here */}
            <Container></Container>
          </Main>
        </Box>

        <StyledFooter drawerOpen={drawerOpen} />
      </Box>
    </>
  )
}

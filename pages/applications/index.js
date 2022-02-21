import React from 'react'
import { useRouter } from 'next/router'
import IndexPage from '../../client/applications/Index.jsx'
import AppliicationsOnMap from '../../client/applications/ApplicationsOnMap.jsx'

export default function Index() {
  const router = useRouter()
  const { city, wasteType } = router.query

  if (city && wasteType) {
    return <IndexPage />
  }

  return <AppliicationsOnMap />
}

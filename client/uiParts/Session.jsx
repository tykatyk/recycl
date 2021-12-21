import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import PageLoadingCircle from '../uiParts/PageLoadingCircle.jsx'

export default function Session(props) {
  const { children } = props
  const { status } = useSession()
  const router = useRouter()

  if (status === 'loading') return <PageLoadingCircle />

  if (status === 'unauthenticated') {
    router.push({
      pathname: '/auth/login',
      query: {
        from: router.pathname,
      },
    })
    return <div>Перенаправление...</div>
  }

  if (status === 'authenticated') {
    return children || ''
  }
}

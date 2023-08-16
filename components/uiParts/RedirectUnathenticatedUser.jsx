import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import PageLoadingCircle from './PageLoadingCircle'

export default function RedirectUnathenticatedUser(props) {
  const { children = null } = props
  const { status } = useSession()
  const router = useRouter()

  if (status === 'loading') return <PageLoadingCircle />
  if (status === 'unauthenticated') {
    router.push({
      pathname: '/auth/login',
      query: {
        from: `${process.env.NEXT_PUBLIC_URL}${router.asPath}`,
      },
    })
    return null
  }

  if (status === 'authenticated') {
    return <>{children}</>
  }
}

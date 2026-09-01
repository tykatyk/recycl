import { ReactNode, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import PageLoadingCircle from './PageLoadingCircle'

interface RedirectUnauthenticatedUserProps {
  children: ReactNode
}

export default function RedirectUnauthenticatedUser({
  children,
}: RedirectUnauthenticatedUserProps) {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace({
        pathname: '/auth/login',
        query: {
          from: router.asPath,
        },
      })
    }
  }, [status, router])

  if (status === 'authenticated') {
    return <>{children}</>
  }

  return <PageLoadingCircle />
}

import React from 'react'
import Events from '../../../components/events/Events'
import { SSProps } from '../../../lib/types/frontend/removalEventTypes'

export default function InactiveEvents({ variant }) {
  return <Events variant={variant} />
}

export const getServerSideProps: (req: any) => Promise<SSProps> = async ({
  req,
}) => {
  return {
    props: { variant: 'active' },
  }
}

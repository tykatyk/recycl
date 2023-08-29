import React from 'react'
import Events from '../../../components/events/Events'
import { EventProps } from '../../../lib/types/frontend/removalEventTypes'

export default function ActiveEvents({ variant }) {
  return <Events variant={variant} />
}

type SSProps = {
  props: EventProps
}
export const getServerSideProps: (req: any) => Promise<SSProps> = async ({
  req,
}) => {
  return {
    props: { variant: 'active' },
  }
}

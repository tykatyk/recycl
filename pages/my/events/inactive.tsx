import React from 'react'
import AllEvents from '../../../components/events/AllEvents.tsx'

export default function InactiveEvents({ type }) {
  return <AllEvents type={type} />
}

export const getServerSideProps = async ({ req }) => {
  return {
    props: { type: 'inactive' },
  }
}

import React from 'react'
import ShowSingle from '../../components/applications/ShowSingle.jsx'

export default function updateRemovalApplication(props) {
  const { id } = props //removal application id
  return <ShowSingle id={id} />
}

export async function getServerSideProps(context) {
  const { id } = context.query

  return {
    props: {
      id,
    },
  }
}

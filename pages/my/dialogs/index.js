import React from 'react'
import Dialogs from '../../../components/dialogs/DialogsPage.jsx'
import { DELETE_STALE_DIALOGS } from '../../../lib/graphql/queries/message'
import appoloClient from '../../../lib/appoloClient/appoloClient'
import { getSession } from 'next-auth/react'

export default function Index() {
  return <Dialogs />
}

export async function getServerSideProps(context) {
  const res = { props: {} }

  await appoloClient
    .mutate({
      mutation: DELETE_STALE_DIALOGS,
      context: {
        headers: {
          cookie: context.req.headers.cookie,
        },
      },
    })
    .then((result) => {
      // console.log('result is')
      // console.log(result)
    })
    .catch((error) => {
      // console.log('error in indexjs')
      // console.log(JSON.stringify(error, null, 2))
    })
  return res
}

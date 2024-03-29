import React from 'react'
import Dialogs from '../../../components/dialogs/DialogsPage'
import { DELETE_STALE_DIALOGS } from '../../../lib/graphql/queries/message'
import { initializeApollo } from '../../../lib/apolloClient/apolloClient'

export default function Index() {
  return <Dialogs />
}

export async function getServerSideProps(context) {
  const res = { props: {} }

  const apolloClient = initializeApollo()
  await apolloClient
    .mutate({
      mutation: DELETE_STALE_DIALOGS,
      context: {
        headers: {
          //manually pass cookies to request
          //since mutate function doesn't include them automatically.
          //With cookies grapql server can access session and get user instance from it
          //otherwise session is null and user is undefined
          cookie: context.req.headers.cookie,
        },
      },
    })
    .then((result) => {
      res.props.deletedCount = result.data.deleteStaleDialogs.deletedCount
    })
    .catch((error) => {
      console.log(error)
      res.props.staleDialogsDeletionError = true
    })
  return res
}

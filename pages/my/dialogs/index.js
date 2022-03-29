import React from 'react'
import Dialogs from '../../../components/dialogs/DialogsPage.jsx'
import { DELETE_STALE_DIALOGS } from '../../../lib/graphql/queries/message'
import appoloClient from '../../../lib/appoloClient/appoloClient'

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
          //manually pass cookies to request
          //since mutate function doesn't include them automatically.
          //With cookies grapql server can access session and get user instance from it
          //otherwise session is null and user is undefined
          cookie: context.req.headers.cookie,
        },
      },
    })
    .then((data) => {
      res.props.deletedCount = data.deleteStaleDialogs.deletedCount
    })
    .catch((error) => {
      console.log(error)
      res.props.staleDialogsDeletionError = true
    })
  return res
}

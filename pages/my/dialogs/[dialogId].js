import React from 'react'
import ChatPage from '../../../components/ChatPage.jsx'

export default function Chat(props) {
  return <ChatPage dialogId={props.dialogId} />
}

export async function getServerSideProps(context) {
  const { dialogId } = context.params

  return {
    props: {
      dialogId,
    },
  }
}

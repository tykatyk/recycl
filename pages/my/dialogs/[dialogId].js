import React from 'react'
import ChatPage from '../../../components/ChatPage.jsx'

// export default function Chat(props) {
export default function Chat() {
  // return <ChatPage dialogId={props.dialogId} />
  return <ChatPage />
}

// export async function getServerSideProps(context) {
//   const { dialogId } = context.params

//   return {
//     props: {
//       dialogId,
//     },
//   }
// }

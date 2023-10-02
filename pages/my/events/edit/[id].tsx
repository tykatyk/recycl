import React from 'react'
import CreateUpdate from '../../../../components/events/CreateUpdate'
import { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { EventProps as InitialEventData } from '../../../../lib/types/event'
import { useRouter } from 'next/router'
import queries from "../../../../lib/db/queries"
import dbConnect from "../../../../lib/db/connection"

export default function CreateEvent({
  event,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <CreateUpdate event={event} />
}

export const getServerSideProps = (async (context) => {
  
  const {id} = context.params
  await dbConnect()
  const event = await queries.eventQueries.get(id)
  //ToDo: Add try catch
  console.log(JSON.parse(JSON.stringify(event)));
  return {
    props: { event:event ? JSON.parse(JSON.stringify(event)): null },
  }
}) satisfies GetServerSideProps<InitialEventData>

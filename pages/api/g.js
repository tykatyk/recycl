import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import dbConnect from '../../lib/db/connection'
import typeDefs from '../../lib/graphql/typeDefs'
import resolvers from '../../lib/graphql/resolvers'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../pages/api/auth/[...nextauth]'

import { User } from '../../lib/db/models'

const context = async (req, res) => {
  //ToDo: Remove try catch
  try {
    await dbConnect()
  } catch (error) {
    throw new Error("Can't connect to the database")
  }
  const contextObj = { req, res, user: null }
  try {
    const session = await getServerSession(req, res, authOptions)
    if (!session) return contextObj
    contextObj.user = await User.findById(session.id, { password: 0 })

    return contextObj
  } catch (error) {
    console.log(error)
    return contextObj
  }
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  context,
})
export default startServerAndCreateNextHandler(apolloServer, { context })
/*
const startServer = apolloServer.start()

//ToDo: make graphql server to be run on separate server, not on Nextjs server
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', `${process.env.NEXT_PUBLIC_URL}`)
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  if (req.method === 'OPTIONS') {
    res.end()
    return false
  }

  await startServer
  await apolloServer.createHandler({
    path: '/api/g',
  })(req, res)
}

export const config = {
  api: {
    bodyParser: false,
  },
}
*/

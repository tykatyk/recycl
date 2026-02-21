import sendpulse from 'sendpulse-api'
import { apiHandler } from '../../../lib/helpers/errorHelpers'
import { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import fs from 'fs'

const tokenAgeSeconds = 3600
let tokenIsValid = true

export const TOKEN_STORAGE = path.join(process.cwd(), 'sendpulseTokenStorage')

async function requestHandler(req: NextApiRequest, res: NextApiResponse) {
  sendpulse.init(
    process.env.SENDPULSE_ID,
    process.env.SENDPULSE_SECRET,
    TOKEN_STORAGE,
    function (token: any) {
      if (!token) {
        console.error('No sendpulse email token')
        return
      }
      if (token && token.is_error) {
        tokenIsValid = false

        sendpulse.getToken((data: any) => {
          if (data && data.is_error) {
            tokenIsValid = false
            console.error('Cannot get sendpulse email token')
            return
          }
        })
        console.error('Sendpulse email token error')
        return
      }
    },
  )

  const stats = fs.statSync(path)
  const age = (Date.now() - stats.mtimeMs) / 1000

  return res.status(200).json({})
}

export default apiHandler(requestHandler)

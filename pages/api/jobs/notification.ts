import { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import fs from 'fs'
import { apiHandler } from '../../../lib/helpers/errorHelpers'
import EmailSendingMetrix from '../../../lib/helpers/email/emailSendingMetrix'

import processSubscriptions from '../../../lib/jobs/sendSubscriptionEmails'
import { func } from 'prop-types'

const lockPath = path.join(process.cwd(), 'subscriptionNotification.lock')

const metrix = new EmailSendingMetrix()
const metrixPath = path.join(process.cwd(), 'subscriptionNotification.lock')

function createLock() {
  try {
    fs.writeFileSync(lockPath, '', { flag: 'wx' })
    return true
  } catch (err: any) {
    if (err.code === 'EEXIST') {
      console.log('Lock file already exists')
    }
    console.log('Cannot create a lock')
    return false
  }
}

function removeLock() {
  if (fs.existsSync(lockPath)) fs.unlinkSync(lockPath)
}

//ToDo: not implemented correctly
function writeMetrixToFile(metrixText: string) {
  try {
    fs.writeFileSync(lockPath, '', { flag: 'wx' })
  } catch (err: any) {
    if (err.code === 'EEXIST') {
      console.error('Metrix file already exists')
    }
    console.error('Cannot write a metrix file')
  }
}

function prepareMetrixText(metrix: EmailSendingMetrix) {
  return Object.entries(metrix)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')
}

async function notifications(req: NextApiRequest, res: NextApiResponse) {
  //ToDo: Add token authorization
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  if (!createLock()) {
    return res.status(500).json('Cannot create a lock file')
  }

  try {
    console.log('Job started.')

    await processSubscriptions(metrix)
    const metrixText = prepareMetrixText(metrix)
    writeMetrixToFile(metrixText)

    console.log('Job finished.')

    res.json('Job finished succesfully')
  } catch (err) {
    console.error('Job failed:', err)
    res.status(500).json('An error while sending notification emails')
  } finally {
    removeLock()
  }
}

process.on('SIGINT', removeLock) // Ctrl+C
process.on('SIGTERM', removeLock) // kill
process.on('exit', removeLock) // graceful exit

export default apiHandler(notifications)

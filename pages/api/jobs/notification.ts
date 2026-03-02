//ToDo: this job should be done on the outer server

import { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import fs from 'fs/promises'
import { apiHandler } from '../../../lib/helpers/errorHelpers'
import sendSubscriptionEmails from '../../../lib/helpers/subscriptions/sendSubscriptionEmails'
import { createLock, removeLock, isStaleLock } from '../../../lib/helpers/file'
import { ensureUsersSubscribed } from '../../../lib/helpers/subscriptions/ensureUsersSubscribed'
import { prepareSubscriptionData } from '../../../lib/helpers/subscriptions/prepareSubscriptionData'
import { canSendEmails } from '../../../lib/helpers/email'

const lockDirectory = path.join(
  __dirname,
  '../../../locks/subscriptionNotification.lock',
)

const lockPath = `${lockDirectory}/subscriptionNotification.lock`

const jobStartedMessage = 'Job started.'
const cantCreateLockMessage = 'Cannot create a lock file'

async function requestHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const auth = req.headers['authorization']
  // if (auth !== `Bearer ${process.env.SEND_SUBSCRIPTION_EMAILS_TOKEN}`) {
  //   return res.status(401).end()
  // }

  try {
    const lockStats = await fs.stat(lockPath).catch(() => null)

    if (lockStats) {
      const lockIsStale = isStaleLock(lockStats)
      if (lockIsStale) {
        console.log('Stale lock found. Removing it.')
        await removeLock(lockPath)
      } else {
        console.log('Job is already running.')
        return res.status(409).json('Job is already running')
      }
    }

    if (!canSendEmails()) return

    if (!(await createLock(lockDirectory, lockPath))) {
      console.error(cantCreateLockMessage)
      return res.status(500).json(cantCreateLockMessage)
    }
    console.log(jobStartedMessage)

    await ensureUsersSubscribed()

    const subscriptionData = await prepareSubscriptionData()

    sendSubscriptionEmails(subscriptionData)

    res.json(jobStartedMessage)
  } catch (err) {
    console.error('Job failed:', err)
    res.status(500).json('An error while sending notification emails')
  } finally {
    //ToDo: catch
    await removeLock(lockPath)
  }
}

export default apiHandler(requestHandler)

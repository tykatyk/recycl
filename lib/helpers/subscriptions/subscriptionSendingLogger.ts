import path from 'path'
import fs from 'fs/promises'
import dateFormatter from '../../../lib/helpers/dateFormatter'
import { ensureDirectoryExists } from '../file'
import { SubscriptionSendingStats } from './subscriptionSendingStats'

const metricsDirectory = path.join(__dirname, '../../../logs')

export const writeStatsToFile = async (metrics: SubscriptionSendingStats) => {
  try {
    await ensureDirectoryExists(metricsDirectory)

    const jobStartedDate = dateFormatter(metrics.jobStarted, 'T', '-')
    //ToDo: rename metrix file
    const path = `${metricsDirectory}/${jobStartedDate}.txt`

    const metricsText = metrics.getSummary()

    await fs.writeFile(path, metricsText, {
      flag: 'wx',
    })
  } catch (err: any) {
    console.log(err)
    if (err.code === 'EEXIST') {
      console.error('Metrics file already exists')
    }
    console.log(err)
  }
}

export const logProgress = (
  total: number,
  metrics: SubscriptionSendingStats,
) => {
  const processed = metrics.totalEmailsProcessed
  console.log(`Jobs processed: ${processed} out of ${total}`)
}

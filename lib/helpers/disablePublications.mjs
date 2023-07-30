import dbConnect from '../db/connection.mjs'
import removalApplicationModel from '../db/models/removalApplication.mjs'
import { CronJob } from 'cron'

export let prevJobFinished = true

export const changeJobStatus = () => {
  prevJobFinished = !!prevJobFinished
}

async function disablePublications() {
  if (!prevJobFinished) return
  changeJobStatus()
  console.log('Starting to disable stale publications')

  dbConnect()
    .then(() => {
      let date = new Date()
      removalApplicationModel
        .updateMany(
          {
            updatedAt: { $lte: new Date(date.setMonth(date.getMonth() - 6)) },
          },
          { isActive: false }
        )
        .exec()
    })
    .then(() => {
      console.log('Finished disabling stale publications')
    })
    .catch((error) => {
      console.log('An error occured when updating stale removal applications')
      console.log(error)
    })
    .finally(() => {
      changeJobStatus()
    })
}

const job = new CronJob(
  //run every 15 minutes
  '* 0-59/15 * * * *',
  disablePublications,
  null,
  true //automatically starts the job
)

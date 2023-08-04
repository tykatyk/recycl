import dbConnect from '../../lib/db/connection.mjs'
import removalApplicationModel from '../../lib/db/models/removalApplication.mjs'
import lockfile from 'proper-lockfile'
import { writeFile } from 'node:fs'

const fileName = 'public/locks/lock'

export default async function disablePublications(req, res) {
  return dbConnect()
    .then(() => {
      return new Promise((resolve, reject) => {
        writeFile(fileName, '', { flag: 'wx' }, (err) => {
          if (!err || err.code === 'EEXIST') {
            resolve()
          }
          reject()
        })
      })
    })
    .then(() => {
      return lockfile.lock(fileName, {
        onCompromised: () => {
          console.log('The lock is compromised')
        },
      })
    })
    .then(() => {
      console.log('Starting to disable expired ads')

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
      console.log('Finished disabling expired publications')
      res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .end(JSON.stringify('OK. Expired ads disabled'))
    })
    .catch((err) => {
      console.log(err)
      res
        .status(500)
        .setHeader('Content-Type', 'application/json')
        .end(JSON.stringify('An error occured while disabling expired ads'))
    })
    .finally(() => {
      return lockfile.unlock(fileName)
    })
}

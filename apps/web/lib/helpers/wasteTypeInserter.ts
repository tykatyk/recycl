import {
  dbConnect,
  WasteType as WasteTypeModel,
} from '@recycl/shared/dist/server/db'
import { wasteTypeNames } from '@recycl/shared/dist/constants'

const wasteTypes = wasteTypeNames.map((name) => {
  return { name }
})

const databaseUrl = 'mongodb://127.0.0.1:27017/recycldb2'

export default async function isertWasteTypes() {
  await dbConnect(databaseUrl)
  console.log('Start inserting waste types')
  await WasteTypeModel.insertMany(wasteTypes)
  console.log('Finished inserting waste types')
}

isertWasteTypes()

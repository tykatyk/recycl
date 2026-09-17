import {
  dbConnect,
  WasteType as WasteTypeModel,
  SubscriptionVariantModel,
} from '@recycl/shared/dist/server/db'
import { wasteTypeNames } from '@recycl/shared/dist/constants'

const mapper = (items) => {
  const mapped = items.map((item) => ({
    updateOne: {
      // 1. Define the criteria to check if the document already exists
      filter: {
        name: item,
      },
      // 2. Set the data ONLY if a new document is being inserted
      update: {
        $setOnInsert: {
          name: item,
        },
      },
      // 3. Upsert creates the document if no match is found
      upsert: true,
    },
  }))
  return mapped
}

const wasteTypes = mapper(wasteTypeNames)
const subscriptionVariants = mapper(['wasteAvailable', 'wasteRemoval'])

const databaseUrl = 'mongodb://127.0.0.1:27017/recycldb'

async function insertWasteTypes() {
  console.log('Start inserting waste types')
  const result = await WasteTypeModel.bulkWrite(wasteTypes)
  console.log(`Inserted waste types: ${result.upsertedCount}`)
  console.log(`Skipped/Matched waste types: ${result.matchedCount}`)
}
async function insertSubscriptionVariants() {
  console.log('Start inserting subscription variants')
  const result = await SubscriptionVariantModel.bulkWrite(subscriptionVariants)
  console.log(`Inserted subscription variants: ${result.upsertedCount}`)
  console.log(`Skipped/Matched subscription variants: ${result.matchedCount}`)
}

async function inserter() {
  try {
    await dbConnect(databaseUrl)
    await insertWasteTypes()
    await insertSubscriptionVariants()
  } catch (error) {
    console.log('An error while inserting into database', error)
  }
}

inserter()

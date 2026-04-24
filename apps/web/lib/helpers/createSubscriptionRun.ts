import {
  SubscriptionRunModel,
  SubscriptionVariantModel,
} from '@recycl/shared/dist/server/db'

export async function createSubscriptionRun(params: {
  subscriptionVariantName: string
  requestedBy?: string | null
}) {
  const { subscriptionVariantName, requestedBy } = params

  const variant = await SubscriptionVariantModel.findOne({
    name: subscriptionVariantName,
  })

  if (!variant) {
    throw new Error('Subscription variant not found')
  }
  return SubscriptionRunModel.create({
    subscriptionVariantName,
    status: 'queued',
    requestedBy: requestedBy ?? null,
    requestedAt: new Date(),
  })
}

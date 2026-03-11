import {
  SubscriptionEmailRunModel,
  SubscriptionVariantModel,
} from '../../db/models'

export async function createSubscriptionRun(params: {
  subscriptionVariantId: string
  requestedBy?: string | null
}) {
  const variant = await SubscriptionVariantModel.findById(
    params.subscriptionVariantId,
  )

  if (!variant) {
    throw new Error('Subscription variant not found')
  }

  return SubscriptionEmailRunModel.create({
    subscriptionVariantId: params.subscriptionVariantId,
    status: 'queued',
    requestedBy: params.requestedBy ?? null,
    requestedAt: new Date(),
  })
}

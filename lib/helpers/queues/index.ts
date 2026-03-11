import { JOB_PREPARE_SUBSCRIPTION_RUN } from './jobNames'

export const getJobId = (options: { offset: number; limit: number }) => {
  const { offset = 0, limit = 1 } = options
  return `${JOB_PREPARE_SUBSCRIPTION_RUN}-page-${Math.floor(offset / limit)}`
}

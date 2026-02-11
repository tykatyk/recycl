import { unsubscribeApiResponseCodes } from '../../lib/subscriptions/unsubscribeApiResponseCodes'

const {
  SUCCESS,
  TOKEN_NOT_FOUND,
  TOKEN_EXPIRED,
  USER_NOT_FOUND,
  SUBSCRIPTION_NOT_FOUND,
  TOKEN_USED,
} = unsubscribeApiResponseCodes

export type UnsubscribeApiResponse = {
  status:
    | typeof SUCCESS
    | typeof TOKEN_NOT_FOUND
    | typeof TOKEN_EXPIRED
    | typeof USER_NOT_FOUND
    | typeof SUBSCRIPTION_NOT_FOUND
    | typeof TOKEN_USED
}

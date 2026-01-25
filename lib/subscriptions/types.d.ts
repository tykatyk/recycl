import {
  unsubscribeApiResponseCodes,
  unsubscribeApiResponseStatuses,
} from '../../lib/subscriptions/unsubscribeApiResponseCodes'

const {
  OK,
  USER_NOT_FOUND,
  SUBSCRIPTION_NOT_FOUND,
  TOKEN_NOT_FOUND,
  TOKEN_EXPIRED,
  TOKEN_USED,
} = unsubscribeApiResponseCodes

const { SUCCESS, ERROR } = unsubscribeApiResponseStatuses

export type UnsubscribeApiResponse =
  | {
      status: typeof SUCCESS
      message: typeof OK
    }
  | {
      status: typeof ERROR
      error:
        | typeof USER_NOT_FOUND
        | typeof SUBSCRIPTION_NOT_FOUND
        | typeof TOKEN_NOT_FOUND
        | typeof TOKEN_EXPIRED
        | typeof TOKEN_USED
    }

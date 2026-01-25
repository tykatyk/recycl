export const unsubscribeApiResponseCodes = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  SUBSCRIPTION_NOT_FOUND: 'SUBSCRIPTION_NOT_FOUND',
  TOKEN_NOT_FOUND: 'TOKEN_NOT_FOUND',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_USED: 'TOKEN_USED',
  OK: 'OK',
} as const

export const unsubscribeApiResponseStatuses = {
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
} as const

export const documentActivityStatus = {
  active: 'active',
  blocked: 'blocked',
  disabled: 'disabled',
} as const

export const collectionPointTypes = [
  'stationery',
  'mobile',
  'container',
] as const

export type CollectionPointVariant = (typeof collectionPointTypes)[number]

export const userRoles = { user: 'user', admin: 'admin' }

export const complaintContentVariants = ['ad', 'collectionPoint'] as const

export const AD_EXPIRATION_PERIOD = 30
export const CHANGE_EMAIL_EXPIRATION_PERIOD = 10

export const minRadius = 1
export const maxRadius = 200


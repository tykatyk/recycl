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

export const minRadius = 0
export const maxRadius = 200

export const wasteTypeNames = [
  'aluminumCans',
  'dangerousWaste',
  'electronicWaste',
  'largeHouseholdAppliances',
  'tetraPack',
  'wood',
  'textile',
  'paper',
  'metal',
  'batteries',
  'organicAnimalWaste',
  'tiers',
  'rubberOther',
  'glassBottles',
  'glassPerfumeBottles',
  'glassOther',
  'plasticLids',
  'plasticBags',
  'plasticBottles',
  'plasticOther',
  'otherWaste',
] as const

export const documentActivityStatus = {
  active: 'active',
  blocked: 'blocked',
  disabled: 'disabled',
} as const

export const collectionPointTypes = {
  stationery: 'Стационарный',
  mobile: 'Передвижной',
  container: 'Сортировочный контейнер',
} as const

export const userRoles = { user: 'user', admin: 'admin' }

export const complaintContentVariants = ['ad', 'collectionPoint'] as const

export const AD_EXPIRATION_PERIOD = 30
export const CHANGE_EMAIL_EXPIRATION_PERIOD = 10

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

export const complaintContentVariants = ['ad', 'collectionPoint'] as const

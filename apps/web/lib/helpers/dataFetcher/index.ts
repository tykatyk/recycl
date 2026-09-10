import type { Waste } from '../../types/waste'

export const wasteTypeFetcher = async () => {
  const result = await fetch(`/api/waste-types`)

  const data: Waste[] = await result.json()
  return data
}

export const userPhoneFetcher = async () => {
  const result = await fetch(`/api/my/account/phone`)
  return await result.json()
}

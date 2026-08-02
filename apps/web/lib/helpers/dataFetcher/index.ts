export const wasteTypeFetcher = async () => {
  const result = await fetch(`/api/waste-types`)
  return await result.json()
}

export const userPhoneFetcher = async () => {
  const result = await fetch(`/api/my/account/phone`)
  return await result.json()
}

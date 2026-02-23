import { getAccessToken } from './sendPulseTokenManager'

const BASE_URL = 'https://api.sendpulse.com'

export async function sendPulseFetcher(
  endpoint: string,
  options: RequestInit = {},
) {
  let token = await getAccessToken()

  const fetcher = async () => {
    return await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
  }

  let response = await fetcher()

  // If token expired unexpectedly, retry once
  if (response.status === 401) {
    token = await getAccessToken()
    response = await fetcher()
  }

  return response.json()
}

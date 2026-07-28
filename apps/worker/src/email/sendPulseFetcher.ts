import { getAccessToken } from './sendPulseTokenManager'
import { incrementRequestCount } from './sendPulseApiRequestLimiter'

const BASE_URL = 'https://api.sendpulse.com'
const MAX_REQUEST_TIME_MS = 5000

export async function sendPulseFetcher<TResponse = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<TResponse> {
  let token = await getAccessToken()

  const fetcher = async () => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(MAX_REQUEST_TIME_MS),
    })
    await incrementRequestCount()
    return response
  }

  let response = await fetcher()

  // If token expired unexpectedly, retry once
  if (response.status === 401) {
    token = await getAccessToken()
    response = await fetcher()
  }

  return response.json() as TResponse
}

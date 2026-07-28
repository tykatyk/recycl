import dotenv from 'dotenv'
import fs from 'fs/promises'
import path from 'path'

const TOKEN_PATH = path.join(
  process.cwd(),
  'sendpulseTokenStorage',
  'sendpulse-token.json',
)

interface TokenData {
  access_token: string
  token_type: 'Bearer'
  expires_in: number
}

dotenv.config()

if (!process.env.SENDPULSE_ID) {
  throw new Error('SENDPULSE_ID is not defined')
}
if (!process.env.SENDPULSE_SECRET) {
  throw new Error('SENDPULSE_ID is not defined')
}

const TOKEN_URL = 'https://api.sendpulse.com/oauth/access_token'

// Prevent concurrent refresh calls
let refreshPromise: Promise<string> | null = null

async function readToken(): Promise<TokenData | null> {
  try {
    const data = await fs.readFile(TOKEN_PATH, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    console.error('Failed to read token file:', err)
    // throw new Error('Failed to read token file:', err)
    return null
  }
}

async function saveToken(token: TokenData) {
  await fs.mkdir(path.dirname(TOKEN_PATH), { recursive: true })
  await fs.writeFile(TOKEN_PATH, JSON.stringify(token, null, 2))
}

async function requestNewToken(): Promise<TokenData> {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: process.env.SENDPULSE_ID,
      client_secret: process.env.SENDPULSE_SECRET,
    }),
  })

  if (res.ok) {
    const data = (await res.json()) as TokenData
    return {
      access_token: data.access_token,
      token_type: 'Bearer',
      expires_in: Date.now() + data.expires_in * 1000,
    }
  }
  throw new Error(
    'Incorrect respose while requesting new Sendpulse access token',
  )
}

export async function getAccessToken(): Promise<string> {
  const token = await readToken()

  // If valid for at least 5 more minutes, reuse it
  if (token && Date.now() < token.expires_in - 5 * 60 * 1000) {
    return token.access_token
  }

  // Prevent multiple refreshes at same time
  if (!refreshPromise) {
    refreshPromise = (async () => {
      let newToken: TokenData

      newToken = await requestNewToken()
      await saveToken(newToken)
      refreshPromise = null
      return newToken.access_token
    })()
  }

  return refreshPromise
}

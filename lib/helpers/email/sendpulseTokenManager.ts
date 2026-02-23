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

const CLIENT_ID = process.env.SENDPULSE_ID!
const CLIENT_SECRET = process.env.SENDPULSE_SECRET!
const TOKEN_URL = 'https://api.sendpulse.com/oauth/access_token'

// Prevent concurrent refresh calls
let refreshPromise: Promise<string> | null = null

async function readToken(): Promise<TokenData | null> {
  try {
    const data = await fs.readFile(TOKEN_PATH, 'utf-8')
    return null
    // return JSON.parse(data)
  } catch (err) {
    console.error('Failed to read token file:', err)
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
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  })

  const data = await res.json()

  return {
    access_token: data.access_token,
    token_type: 'Bearer',
    expires_in: Date.now() + data.expires_in * 1000,
  }
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

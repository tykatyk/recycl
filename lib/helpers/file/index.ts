import { Stats } from 'fs'
import fs from 'fs/promises'

export const ensureDirectoryExists = async (path: string) => {
  try {
    await fs.mkdir(path, { recursive: true })
  } catch (error) {
    if (error.code !== 'EEXIST') {
      console.error(`Error creating directory: ${error.message}`)
    }
    throw error
  }
}

export const createLock = async (lockDirectory: string, lockPath: string) => {
  try {
    await ensureDirectoryExists(lockDirectory)
    await fs.writeFile(lockPath, '', { flag: 'wx' })
    return true
  } catch (err: any) {
    if (err.code === 'EEXIST') {
      console.error('Lock file already exists')
    }
    console.error('Cannot create a lock')
    return false
  }
}

export const removeLock = async (lockPath: string) => {
  await fs.unlink(lockPath)
}

export const isStaleLock = (stats: Stats) => {
  if (stats && Date.now() - stats.mtimeMs > 13 * 60 * 60 * 1000) {
    return true
  }
  return false
}

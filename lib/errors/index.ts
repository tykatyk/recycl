import type { SendPulseError } from '../types/email'
export const internalServerError = new Error('Internal server error')

export class TimeoutError extends Error {
  code: string

  constructor(message = 'Operation timed out') {
    super(message)
    this.name = 'TimeoutError'
    this.code = 'ETIMEDOUT'
  }
}

export const createAbortError = (message?: string) => {
  const err = new Error(message ?? 'Job execution aborted due to timeout')
  err.name = 'AbortError'
  return err
}

export const createSendPulseError = (params: SendPulseError) => {
  const { error_code, message } = params
  const err = new Error(`Error code: ${error_code}, message: ${message}`)
  err.name = 'SendPulseError'
  return err
}

import type { SendPulseError } from './types'

export const createSendPulseError = (params: SendPulseError) => {
  const { error_code, message } = params
  const err = new Error(`Error code: ${error_code}, message: ${message}`)
  err.name = 'SendPulseError'
  return err
}

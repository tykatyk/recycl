export const internalServerError = new Error('Internal server error')

export class TimeoutError extends Error {
  code: string

  constructor(message = 'Operation timed out') {
    super(message)
    this.name = 'TimeoutError'
    this.code = 'ETIMEDOUT'
  }
}

export const createAbortError = () => {
  const err = new Error('Job execution aborted due to timeout')
  err.name = 'AbortError'
  return err
}

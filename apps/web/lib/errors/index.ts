export const INTERNAL_SERVER_ERROR = 'Internal server error'
export const METHOD_NOT_ALLOWED = 'Method not allowed'

export class TimeoutError extends Error {
  code: string

  constructor(message = 'Operation timed out') {
    super(message)
    this.name = 'TimeoutError'
    this.code = 'ETIMEDOUT'
  }
}

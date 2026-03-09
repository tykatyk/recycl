export class SubscriptionSendingStats {
  jobStarted: Date
  jobFinished: Date
  totalEmailsToProcess: number
  totalEmailsProcessed: number
  totalErrors: number
  errorMessages: string[]
  append: (data: any) => void
  getSummary: () => string

  constructor() {
    this.jobStarted = new Date()
    this.jobFinished = this.jobStarted
    this.totalEmailsToProcess = 0
    this.totalEmailsProcessed = 0
    this.totalErrors = 0
    this.errorMessages = []
    this.append = (data) => {
      this.totalEmailsProcessed++

      if (data && !data.error_code) return

      this.totalErrors++

      const { error_code, message } = data

      const parts: string[] = []

      parts.push(`ErrorCode: ${error_code}`)
      parts.push(`Message: ${message}`)

      const errorMessage =
        parts.length > 0
          ? parts.join(', ')
          : 'Message: unknown error while sending an email'

      this.errorMessages.push(errorMessage)
    }

    this.getSummary = () => {
      const summary = [
        `jobStarted: ${this.jobStarted}`,
        `jobFinished: ${this.jobFinished}`,
        `totalEmailsToProcess: ${this.totalEmailsToProcess}`,
        `totalEmailsProcessed: ${this.totalEmailsProcessed}`,
        `totalErrors: ${this.totalErrors}`,
      ].join('\n')

      const errors = this.errorMessages.length
        ? `errorMessages:\n${this.errorMessages.join('\n')}`
        : 'errorMessages: none'

      return [summary, errors].join('\n')
    }
  }
}

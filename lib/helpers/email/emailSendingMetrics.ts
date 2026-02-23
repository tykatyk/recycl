export interface MetricsSummary {
  jobStarted: Date
  jobFinished: Date
  totalEmailsProcessed: number
  totalErrors: number
  errorMessages: string[]
}

export class EmailSendingMetrics {
  jobStarted: MetricsSummary['jobStarted']
  jobFinished: MetricsSummary['jobFinished']
  totalEmailsProcessed: MetricsSummary['totalEmailsProcessed']
  totalErrors: MetricsSummary['totalErrors']
  errorMessages: MetricsSummary['errorMessages']
  append: (data: any) => void
  getSummary: () => MetricsSummary

  constructor() {
    this.jobStarted = new Date()
    this.jobFinished = this.jobStarted
    this.totalEmailsProcessed = 0
    this.totalErrors = 0
    this.errorMessages = []
    this.append = (data) => {
      this.totalEmailsProcessed++

      if (!data.error_code) return

      this.totalErrors++

      const { error_code, message } = data

      const parts: string[] = []

      if (error_code) {
        parts.push(`ErrorCode: ${error_code}`)
      }

      if (message) {
        parts.push(`Message: ${message}`)
      }

      const errorMessage =
        parts.length > 0
          ? parts.join(', ')
          : 'Message: unknown error while sending an email'

      this.errorMessages.push(errorMessage)
    }

    this.getSummary = () => {
      return {
        jobStarted: this.jobStarted,
        jobFinished: this.jobFinished,
        totalEmailsProcessed: this.totalEmailsProcessed,
        totalErrors: this.totalErrors,
        errorMessages: this.errorMessages,
      }
    }
  }
}

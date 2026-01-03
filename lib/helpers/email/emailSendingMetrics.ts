export default class EmailSendingMetrics {
  jobStarted: Date
  jobFinished: Date
  totalEmailsProcessed: number
  totalErrors: number
  errorMessages: string[]

  constructor() {
    this.jobStarted = new Date()
    this.jobFinished = this.jobStarted
    this.totalEmailsProcessed = 0
    this.totalErrors = 0
    this.errorMessages = []
  }
}

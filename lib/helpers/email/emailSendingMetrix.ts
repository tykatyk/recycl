export default class EmailSendingMetrix {
  jobStarted: Date
  jobFinished: Date
  totalEmails: number
  totalEmailsToProcess: number
  totalEmailsProcessed: number
  totalErrors: number
  errorMessages: string[]

  constructor() {
    this.jobStarted = new Date()
    this.jobFinished = this.jobStarted
    this.totalEmails = 0
    this.totalEmailsToProcess = 0
    this.totalEmailsProcessed = 0
    this.totalErrors = 0
    this.errorMessages = []
  }
}

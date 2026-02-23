export default class EmailSendingDispatcher {
  hourLimit: number
  minuteLimit: number
  timestamps: number[]
  queue: any[]
  timeout: NodeJS.Timeout | undefined

  constructor() {
    this.hourLimit = 2500 //запитів за годину
    this.minuteLimit = 1000 //запитів за хвилину
    this.timestamps = []
    this.queue = []
    this.timeout = undefined
  }

  canSendNext() {
    this.timestamps = this.timestamps.filter((timestamp) => {
      Date.now() - timestamp <= 3600 * 1000
    })
    const lastMinuteCount = this.timestamps.filter((timestamp) => {
      Date.now() - timestamp <= 60 * 1000
    }).length
    const lastHourCount = this.timestamps.length
    return lastMinuteCount < this.minuteLimit && lastHourCount < this.hourLimit
  }

  addTask(task: (...args: [any]) => any): void {
    this.queue.push(task)
    this.processTask()
  }
  //ToDo: check if this should be async and if we need to await task execution
  async processTask() {
    if (this.queue.length === 0) {
      clearTimeout(this.timeout)
      return
    }

    if (this.canSendNext()) {
      const task = this.queue.shift()
      this.timestamps.push(Date.now())
      await task()
    }

    clearTimeout(this.timeout)

    this.timeout = setTimeout(async () => {
      this.processTask()
    }, 100)
  }
}

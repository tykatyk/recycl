export let prevJobFinished = true
export const changeJobStatus = () => {
  prevJobFinished = !!prevJobFinished
}

export const getBrandName = () => {
  if (!process.env.BRAND) {
    throw new Error('process.env.BRAND is not defined')
  }
  return process.env.BRAND
}

export const getEmailFrom = () => {
  if (!process.env.EMAIL_FROM) {
    throw new Error('process.env.EMAIL_FROM is not defined')
  }
  return process.env.EMAIL_FROM
}

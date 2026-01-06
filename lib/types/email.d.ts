export type Email = {
  html: string
  subject: string
  from: {
    name: string
    email: string
  }
  to: [
    {
      name: string
      email: string
    },
  ]
}

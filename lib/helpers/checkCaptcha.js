export async function checkCaptcha(token) {
  return fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      return data.success
    })
    .catch((error) => {
      console.log(error)
      return false
    })
}

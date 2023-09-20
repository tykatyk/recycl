import mongoose from 'mongoose'

export default async function dbConnect() {
  if (!mongoose.connections[0].readyState) {
    // Use new db connection
    await mongoose
      .set('strictQuery', false)
      .connect(process.env.DATABASE_URL)
      .then(() => {
        console.log('Connected to the database')
      })
      .catch((err) => {
        console.log('Cannot connect to the database', err)
        process.exit()
      })
  }
}

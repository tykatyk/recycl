import mongoose from 'mongoose'

export default async function dbConnect() {
  const uri = process.env.DATABASE_URL
  if (!uri) {
    console.log('Database url is not defined in environment variables')
    return
  }

  if (!mongoose.connections[0].readyState) {
    // Use new db connection
    await mongoose
      .connect(uri)
      .then(() => {
        console.log('Connected to the database')
      })
      .catch((err) => {
        console.log('Cannot connect to the database\n', err)
        process.exit(1)
      })
  }
}

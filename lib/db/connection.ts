import mongoose from 'mongoose'

export default async function dbConnect() {
  const uri = process.env.DATABASE_URL
  if (!uri) {
    throw new Error('Database url is not defined\n')
  }

  if (!mongoose.connections[0].readyState) {
    await mongoose
      .connect(uri)
      .then(() => {
        console.log('Connected to the database\n')
      })
      .catch((err) => {
        throw new Error('Cannot connect to the database\n')
      })
  }
}

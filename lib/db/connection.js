import mongoose from 'mongoose'

export default async (handler) => async (req, res) => {
  if (mongoose.connections[0].readyState) {
    // Use current db connection
    return await handler(req, res)
  }

  // Use new db connection
  await mongoose
    .connect(process.env.DATABASE_URL, {
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useNewUrlParser: true,
    })
    .then(() => {
      console.log('Connected to the database')
    })
    .catch((err) => {
      console.log('Cannot connect to the database', err)
      process.exit()
    })
  return await handler(req, res)
}

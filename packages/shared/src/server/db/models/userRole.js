import mongoose from 'mongoose'
const Schema = mongoose.Schema

const userRoleSchema = Schema(
  {
    name: String,
  },
  { timestamps: true }
)
export default mongoose.models.UserRole ||
  mongoose.model('UserRole', userRoleSchema)

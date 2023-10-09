import { WasteType } from '../models/index'

const wasteTypeQueries = {
  create: async (data) => {
    return await new WasteType(data).save()
  },

  get: async (id) => {
    return await WasteType.findById(id).exec()
  },

  getAll: async () => {
    return await WasteType.find().sort({ name: 1 }).exec()
  },

  update: async (id, newValue) => {
    return await WasteType.findByIdAndUpdate(id, newValue, {
      new: true,
    }).exec()
  },

  delete: async (id) => {
    return await this.model.findByIdAndRemove(id).exec()
  },

  deleteMany: async (ids) => {
    return await WasteType.deleteMany({ _id: { $in: ids } }).exec()
  },
}
export default wasteTypeQueries

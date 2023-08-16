import { WasteType } from '../models/index'

const wasteTypeQueries = {
  create: async (data) => {
    try {
      return await new WasteType(data).save()
    } catch (err) {
      return err
    }
  },

  get: async (id) => {
    try {
      return await WasteType.findById(id).exec()
    } catch (err) {
      return err
    }
  },

  getAll: async () => {
    try {
      return await WasteType.find().sort({ name: 1 }).exec()
    } catch (err) {
      return err
    }
  },

  update: async (id, newValue) => {
    try {
      return await WasteType.findByIdAndUpdate(id, newValue, {
        new: true,
      }).exec()
    } catch (err) {
      return err
    }
  },

  delete: async (id) => {
    try {
      return await this.model.findByIdAndRemove(id).exec()
    } catch (err) {
      return err
    }
  },

  deleteMany: async (ids) => {
    try {
      return await WasteType.deleteMany({ _id: { $in: ids } }).exec()
    } catch (err) {
      return err
    }
  },
}
export default wasteTypeQueries

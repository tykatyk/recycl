import { WasteType } from '../models'

export default {
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
      return await WasteType.find()
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

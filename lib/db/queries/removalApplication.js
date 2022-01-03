import removalApplication from '../../validation/removalApplication'
import { RemovalApplication } from '../models'

export default {
  create: async (data, user) => {
    if (!user) return null
    try {
      data.userId = user['_id']
      const removalAppliaction = new RemovalApplication(data)
      return await removalAppliaction.save()
    } catch (err) {
      return err
    }
  },

  get: async (id) => {
    try {
      return await RemovalApplication.findById(id).populate('wasteType').exec()
    } catch (err) {
      return err
    }
  },

  getAll: async () => {
    try {
      return await RemovalApplication.find().populate('wasteType')
    } catch (err) {
      return err
    }
  },

  /*getWithMessageCount: async () => {
    try {
      return await RemovalApplication.aggregate([
        {
          $lookup: {
            from: 'messages',
            let: { id: '$_id' },
            pipeline: [{ $match: { $expr: { $eq: ['$$id', '$aplId'] } } }],
            as: 'messageCount',
          },
        },
        { $addFields: { messageCount: { $size: '$messageCount' } } },
        {
          $sort: { createdAt: -1 },
        },
      ])
    } catch (err) {
      return err
    }
  },*/

  getWithMessageCount: async () => {
    try {
      return await RemovalApplication.aggregate([
        {
          $lookup: {
            from: 'wastetypes',
            localField: 'wasteType',
            foreignField: '_id',
            as: 'wasteType',
          },
        },
        { $unwind: '$wasteType' },
        {
          $lookup: {
            from: 'messages',
            let: { id: '$_id' },
            pipeline: [{ $match: { $expr: { $eq: ['$$id', '$aplId'] } } }],
            as: 'messageCount',
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $project: {
            document: '$$ROOT',
            messageCount: { $size: '$messageCount' },
          },
        },
      ])
    } catch (err) {
      return err
    }
  },

  update: async (id, newValue) => {
    try {
      return await RemovalApplication.findByIdAndUpdate(id, newValue, {
        new: true,
      }).exec()
    } catch (err) {
      return err
    }
  },

  delete: async (id) => {
    try {
      return await RemovalApplication.findByIdAndRemove(id).exec()
    } catch (err) {
      return err
    }
  },

  deleteMany: async (ids) => {
    try {
      return await RemovalApplication.deleteMany({ _id: { $in: ids } }).exec()
    } catch (err) {
      return err
    }
  },
}

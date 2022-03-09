import { Message } from '../models'

export default {
  create: async (data, user) => {
    if (!user) return null
    try {
      return await new Message(data).save()['_id']
    } catch (err) {
      return err
    }
  },

  get: async (id) => {
    try {
      return await Message.findById(id).exec()
    } catch (err) {
      return err
    }
  },

  getAll: async (user) => {
    if (!user) return null
    const id = user['_id']
    try {
      const result = await Message.aggregate([
        { $match: { receiver: id } },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: {
              sender: '$sender',
              ad: '$ad',
            },
            id: { $first: '$_id' },
            text: { $first: '$text' },
            sender: { $first: '$sender' },
            ad: { $first: '$ad' },
            createdAt: { $first: '$createdAt' },
          },
        },
        {
          $lookup: {
            from: 'removalapplications',
            localField: 'ad',
            foreignField: '_id',
            as: 'ad',
          },
        },
        { $unwind: '$ad' },
        {
          $lookup: {
            from: 'users',
            localField: 'sender',
            foreignField: '_id',
            as: 'sender',
          },
        },
        { $unwind: '$sender' },
        {
          $lookup: {
            from: 'wastetypes',
            localField: 'ad.wasteType',
            foreignField: '_id',
            as: 'ad.wasteType',
          },
        },
        { $unwind: '$ad.wasteType' },
        {
          $project: {
            _id: '$id',
            text: 1,
            sender: {
              _id: 1,
              name: 1,
            },
            ad: {
              _id: 1,
              wasteLocation: {
                description: 1,
              },
              wasteType: {
                name: 1,
              },
            },
            createdAt: 1,
          },
        },
        { $sort: { createdAt: -1 } },
      ])
      return result
    } catch (error) {
      return error
    }
  },

  getNumberOfUnread: async (user) => {
    if (!user) return null
    const id = user['_id']
    return await Message.countDocuments({
      $and: [{ receiver: id }, { isViewed: false }],
    })
  },

  getByApplicationAndUser: async (aplId) => {
    try {
      return await Message.aggregate([
        {
          $match: {
            application: aplId,
          },
          $sort: {
            createdAt: 'desc',
          },
          $group: {
            id: initiatorId,
            lastMessage: {
              $last: 'message',
            },
            isRead: {
              $last: 'isRead',
            },
          },
          $lookkup: {
            from: 'removalapplications',
            let: { aplId: '$aplId' },
            pipeline: [
              { $match: { $expr: { $eq: ['$$application', '$_id'] } } },
            ],
            as: 'removalApplication',
          },
          $addFields: {
            wasteLocation: '$wasteLocation.description',
            wasteType: '$wasteType',
          },
        },
      ])
    } catch (err) {
      return err
    }
  },

  delete: async (id) => {
    try {
      return await Message.findByIdAndRemove(id).exec()
    } catch (err) {
      return err
    }
  },

  deleteMany: async (ids, user) => {
    if (!user) return null
    try {
      const result = await Message.deleteMany({ _id: { $in: ids } }).exec()
      return result.deletedCount
    } catch (error) {
      return error
    }
  },
}

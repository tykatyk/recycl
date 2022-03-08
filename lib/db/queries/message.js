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
      return await Message.find({
        $and: [{ $or: { to: id } }, { $or: { from: id } }],
      })
    } catch (err) {
      return err
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

  deleteMany: async (ids) => {
    try {
      return await Message.deleteMany({ _id: { $in: ids } }).exec()
    } catch (err) {
      return err
    }
  },
}

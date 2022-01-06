import { Message } from '../models'

export default {
  create: async (data) => {
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

  getAll: async () => {
    try {
      return await Message.find()
    } catch (err) {
      return err
    }
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

  update: async (id, newMessage) => {
    try {
      return await Message.findByIdAndUpdate(id, newMessage, {
        new: true,
      }).exec()
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

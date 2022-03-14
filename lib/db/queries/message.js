import { Message } from '../models'
import { internalServerError } from '../../errors/index.js'

export default {
  create: async (data, user) => {
    if (!user) return null
    try {
      return await new Message(data).save()['_id']
    } catch (error) {
      throw internalServerError
    }
  },

  get: async (id) => {
    try {
      return await Message.findById(id).exec()
    } catch (error) {
      throw internalServerError
    }
  },

  getDialogs: async (user) => {
    if (!user) return null
    const id = user['_id']
    try {
      const matchStage = { $match: { $or: [{ receiver: id }, { sender: id }] } }
      const groupStage = {
        $group: {
          _id: {
            sender: '$sender',
            receiver: '$receiver',
            ad: '$ad',
          },
          viewed: { $first: '$viewed' },
          text: { $first: '$text' },
          sender: { $first: '$sender' },
          receiver: { $first: '$receiver' },
          ad: { $first: '$ad' },
          createdAt: { $first: '$createdAt' },
        },
      }

      const result = await Message.aggregate([
        {
          $facet: {
            dialogs: [
              matchStage,
              { $sort: { createdAt: -1 } },
              groupStage,
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
                  from: 'users',
                  localField: 'receiver',
                  foreignField: '_id',
                  as: 'receiver',
                },
              },
              { $unwind: '$receiver' },
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
                  _id: {
                    $concat: [
                      { $toString: '$ad._id' },
                      { $toString: '$sender._id' },
                      { $toString: '$receiver._id' },
                    ],
                  },
                  viewed: 1,
                  text: 1,
                  sender: {
                    _id: 1,
                    name: 1,
                  },
                  receiver: {
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
            ],
            total: [matchStage, groupStage, { $count: 'count' }],
          },
        },
      ])
      const processedResult = {
        dialogs: [],
        totalCount: 0,
      }
      if (result.length > 0) {
        processedResult.dialogs = result[0].dialogs
        processedResult.totalCount = result[0].total[0].count
      }

      return processedResult
    } catch (error) {
      throw internalServerError
    }
  },

  getUnreadDialogsIDs: async (user) => {
    if (!user) return null
    const id = user['_id']

    try {
      const result = await Message.aggregate([
        { $match: { $and: [{ receiver: id }, { isViewed: false }] } },
        {
          $group: {
            _id: {
              sender: '$sender',
              receiver: '$receiver',
              ad: '$ad',
            },
          },
        },
        {
          $project: {
            _id: {
              $concat: [
                { $toString: '$_id.ad' },
                { $toString: '$_id.sender' },
                { $toString: '$_id.receiver' },
              ],
            },
          },
        },
      ])
      return result.length > 0 ? result.map((element) => element._id) : []
    } catch (error) {
      throw internalServerError
    }
  },

  delete: async (id) => {
    try {
      return await Message.findByIdAndRemove(id).exec()
    } catch (error) {
      throw internalServerError
    }
  },

  deleteDialogs: async (ids, user) => {
    if (!user) return null
    try {
      const result = await Message.deleteMany({ _id: { $in: ids } }).exec()
      return result.deletedCount
    } catch (error) {
      throw internalServerError
    }
  },
}

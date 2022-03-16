import mongoose from 'mongoose'
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

  getDialogs: async (offset, limit = 25, user) => {
    if (!user) return null
    const id = user['_id']
    let offsetQuery = null
    if (offset) {
      offsetQuery = {
        _id: {
          $lt: mongoose.Types.ObjectId(offset),
        },
      }
    }
    const andQuery = [{ $or: [{ receiver: id }, { sender: id }] }]
    if (offsetQuery) andQuery.push(offsetQuery)

    const dialogsMatchStage = {
      $match: {
        $and: andQuery,
      },
    }
    const totalMatchStage = {
      $match: {
        $and: [{ $or: [{ receiver: id }, { sender: id }] }],
      },
    }
    const groupStage = {
      $group: {
        _id: {
          ad: '$ad',
          sender: '$sender',
          receiver: '$receiver',
        },
        messages: {
          $first: '$$ROOT',
        },
      },
    }
    try {
      const result = await Message.aggregate([
        {
          $facet: {
            dialogs: [
              dialogsMatchStage,
              groupStage,
              { $sort: { _id: -1 } },
              { $limit: limit },
              {
                $lookup: {
                  from: 'removalapplications',
                  localField: 'messages.ad',
                  foreignField: '_id',
                  as: 'messages.ad',
                },
              },
              { $unwind: '$messages.ad' },
              {
                $lookup: {
                  from: 'users',
                  localField: 'messages.sender',
                  foreignField: '_id',
                  as: 'messages.sender',
                },
              },
              { $unwind: '$messages.sender' },
              {
                $lookup: {
                  from: 'users',
                  localField: 'messages.receiver',
                  foreignField: '_id',
                  as: 'messages.receiver',
                },
              },
              { $unwind: '$messages.receiver' },
              {
                $lookup: {
                  from: 'wastetypes',
                  localField: 'messages.ad.wasteType',
                  foreignField: '_id',
                  as: 'messages.ad.wasteType',
                },
              },
              { $unwind: '$messages.ad.wasteType' },
              {
                $project: {
                  _id: {
                    $concat: [
                      { $toString: '$messages.ad._id' },
                      { $toString: '$messages.sender._id' },
                      { $toString: '$messages.receiver._id' },
                    ],
                  },
                  messages: {
                    _id: 1,
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
              },
              {
                $group: {
                  _id: '$_id',
                  messages: {
                    $push: '$messages',
                  },
                },
              },
              { $sort: { _id: -1 } },
            ],
            total: [totalMatchStage, groupStage, { $count: 'count' }],
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
      console.log(processedResult)
      return processedResult
    } catch (error) {
      console.log(error)
      throw internalServerError
    }
  },

  getUnreadDialogsIDs: async (user) => {
    if (!user) return null
    const id = user['_id']

    try {
      const result = await Message.aggregate([
        { $match: { $and: [{ receiver: id }, { viewed: false }] } },
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

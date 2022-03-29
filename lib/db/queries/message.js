import mongoose from 'mongoose'
import { Message } from '../models'
import { internalServerError } from '../../errors/index.js'

export default {
  create: async (data, user) => {
    if (!user) return null
    try {
      return await new Message(data).save()['_id']
    } catch (error) {
      console.log(error)
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
    const offsetQuery = {}
    if (offset) offsetQuery._id = { $lt: mongoose.Types.ObjectId(offset) }
    const matchStageForTotal = {
      $or: [
        { dialogInitiatorId: mongoose.Types.ObjectId(id) },
        { dialogReceiverId: mongoose.Types.ObjectId(id) },
      ],
    }

    const matchStageForDialogs = {
      $and: [matchStageForTotal, offsetQuery],
    }

    try {
      const result = await Message.aggregate([
        {
          $facet: {
            dialogs: [
              {
                $match: matchStageForDialogs,
              },
              { $sort: { _id: -1 } },
              {
                $group: {
                  _id: '$dialogId',
                  messageId: { $first: '$_id' },
                  text: { $first: '$text' },
                  ad: { $first: '$ad' },
                  senderId: { $first: '$senderId' },
                  senderName: { $first: '$senderName' },
                  receiverId: { $first: '$receiverId' },
                  receiverName: { $first: '$receiverName' },
                  dialogId: { $first: '$dialogId' },
                  dialogInitiatorId: { $first: '$dialogInitiatorId' },
                  dialogReceiverId: { $first: '$dialogReceiverId' },
                  viewed: { $first: '$viewed' },
                  createdAt: { $first: '$createdAt' },
                },
              },
              { $sort: { messageId: -1 } },
              { $limit: limit },
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
                  from: 'wastetypes',
                  localField: 'ad.wasteType',
                  foreignField: '_id',
                  as: 'ad.wasteType',
                },
              },
              { $unwind: '$ad.wasteType' },
              {
                $project: {
                  _id: '$messageId',
                  text: 1,
                  ad: {
                    _id: 1,
                    wasteLocation: {
                      description: 1,
                    },
                    wasteType: {
                      name: 1,
                    },
                  },
                  senderId: 1,
                  senderName: 1,
                  receiverId: 1,
                  receiverName: 1,
                  dialogId: 1,
                  dialogInitiatorId: 1,
                  dialogReceiverId: 1,
                  viewed: 1,
                  createdAt: 1,
                },
              },
            ],
            total: [
              {
                $match: matchStageForTotal,
              },
              {
                $group: {
                  _id: '$dialogId',
                },
              },
              { $count: 'count' },
            ],
          },
        },
      ])
      const processedResult = {
        dialogs: [],
        totalCount: 0,
      }

      if (result[0] && result[0].dialogs && result[0].dialogs.length > 0) {
        processedResult.dialogs = result[0].dialogs
        processedResult.totalCount = result[0].total[0].count
      }
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
        {
          $match: {
            $and: [
              { receiverId: mongoose.Types.ObjectId(id) },
              { viewed: false },
            ],
          },
        },
        {
          $group: {
            _id: '$dialogId',
          },
        },
      ])
      return result.length > 0 ? result.map((element) => element._id) : []
    } catch (error) {
      console.log(error)
      throw internalServerError
    }
  },

  deleteOne: async (id) => {
    try {
      return await Message.findByIdAndRemove(id).exec()
    } catch (error) {
      throw internalServerError
    }
  },

  deleteMany: async (ids, user) => {
    if (!user) return null
    try {
      const result = await Message.deleteMany({ _id: { $in: ids } }).exec()
      return result.deletedCount
    } catch (error) {
      console.log(error)
      throw internalServerError
    }
  },

  deleteStaleDialogs: async (user) => {
    if (!user) return null
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    try {
      const dialogsToDelete = await Message.aggregate([
        {
          $match: {
            $or: [
              { dialogReceiverId: mongoose.Types.ObjectId(user._id) },
              { dialogSenderId: mongoose.Types.ObjectId(user._id) },
            ],
          },
        },
        {
          $group: {
            _id: '$dialogId',
            messageId: { $first: '$_id' },
            createdAt: { $first: '$createdAt' },
          },
        },
        {
          $match: {
            createdAt: {
              $lte: sixMonthsAgo,
            },
          },
        },
        {
          $project: {
            _id: 1,
          },
        },
      ])

      const deleted = await Message.deleteMany({
        dialogId: { $in: dialogsToDelete },
      })

      return deleted
    } catch (error) {
      console.log(error)
      throw internalServerError
    }
  },

  deleteDialogs: async (dialogs, user) => {
    if (!user) return null
    try {
      Promise.all([
        Message.deleteMany({
          $or: [
            {
              $and: [
                { dialogId: { $in: dialogs } },
                { senderId: mongoose.Types.ObjectId(user.id) },
                {
                  receiverId: {
                    $exists: false,
                  },
                },
              ],
            },
            {
              $and: [
                { dialogId: { $in: dialogs } },
                { receiverId: mongoose.Types.ObjectId(user.id) },
                {
                  senderId: {
                    $exists: false,
                  },
                },
              ],
            },
          ],
        }).exec(),

        Message.updateMany(
          {
            $and: [
              { dialogId: { $in: dialogs } },
              { senderId: mongoose.Types.ObjectId(user.id) },
            ],
          },
          {
            $unset: {
              senderId: '',
            },
          }
        ).exec(),
        Message.updateMany(
          {
            $and: [
              { dialogId: { $in: dialogs } },
              { receiverId: mongoose.Types.ObjectId(user.id) },
            ],
          },
          {
            $unset: {
              receiverId: '',
            },
          }
        ).exec(),
      ]).then(() => {
        return 42 // ToDo: refactor return value
      })
    } catch (error) {
      console.log(error)
      throw internalServerError
    }
  },
}

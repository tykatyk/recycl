import mongoose from 'mongoose'
import { Message } from '../models/index'
import { internalServerError } from '../../errors/index'

const messageQueries = {
  create: async (data, user) => {
    if (!user) return null
    try {
      return await Message.create(data)
    } catch (error) {
      console.log(error)
      throw internalServerError
    }
  },

  update: async (id, payload, user) => {
    if (!user) return
    try {
      return await Message.findByIdAndUpdate(
        new mongoose.Types.ObjectId(id),
        payload,
        {
          returnDocument: 'after',
        }
      ).exec()
    } catch (error) {
      throw internalServerError
    }
  },

  //ToDo: seems like this is not used
  get: async (id) => {
    try {
      return await Message.findById(id).exec()
    } catch (error) {
      throw internalServerError
    }
  },
  //ToDo: Maybe set limit to env variable
  getDialogs: async (offset = 0, limit = 25, user) => {
    if (!user) return null
    const id = user['_id']

    const matchStageForTotal = {
      $or: [
        { dialogInitiatorId: new mongoose.Types.ObjectId(id) },
        { dialogReceiverId: new mongoose.Types.ObjectId(id) },
      ],
    }

    try {
      const result = await Message.aggregate([
        {
          $facet: {
            dialogs: [
              {
                $match: matchStageForTotal,
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
              { $skip: offset },
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

  //ToDo: maybe rename to get dialog messages
  getDialog: async (
    dialogId,
    offset = '',
    limit = process.env.DEFAULT_PAGINATION_SIZE,
    user
  ) => {
    if (!dialogId || !user) return null
    const query = {
      dialogId,
    }

    if (offset) {
      query._id = {
        $lt: new mongoose.Types.ObjectId(offset),
      }
    }

    try {
      const result = await Message.find(query)
        .sort({ _id: -1 })
        .limit(limit)
        .populate({
          path: 'ad',
          populate: {
            path: 'wasteType',
          },
        })
      return result
    } catch (error) {
      console.log(error)
      throw internalServerError
    }
  },

  getUnreadDialogsIDs: async (currentDialogId, user) => {
    if (!user) return null
    const id = user['_id']

    try {
      const result = await Message.aggregate([
        {
          $match: {
            $and: [
              {
                $or: [
                  {
                    $and: [
                      { dialogReceiverId: new mongoose.Types.ObjectId(id) },
                      { receiverId: new mongoose.Types.ObjectId(id) },
                    ],
                  },
                  {
                    $and: [
                      { dialogInitiatorId: new mongoose.Types.ObjectId(id) },
                      { receiverId: new mongoose.Types.ObjectId(id) },
                    ],
                  },
                ],
              },
              { viewed: false },
              {
                //if user is in chat with someone
                //don't update counter for this dialog
                //since messages automatically appear in chat
                dialogId: {
                  $ne: currentDialogId ? currentDialogId : '',
                },
              },
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

  //physycally deletes stale dialogs for both parts of a dialog
  //i.e for sender and receiver of dialog messages
  deleteStaleDialogs: async (user) => {
    if (!user) return null
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    try {
      const dialogsToDelete = await Message.aggregate([
        {
          $match: {
            $or: [
              { dialogReceiverId: new mongoose.Types.ObjectId(user._id) },
              { dialogInitiatorId: new mongoose.Types.ObjectId(user._id) },
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

      return await Message.deleteMany({
        dialogId: { $in: dialogsToDelete },
      })
    } catch (error) {
      console.log(error)
      throw internalServerError
    }
  },

  deleteDialogs: async (dialogs, user) => {
    if (!user) return null
    try {
      return await Promise.all([
        //if a user deletes a dialog and his counterpart also deleted it,
        //we physically remove this dialog from the database
        //since no one is iterested in it
        Message.deleteMany({
          $and: [
            { dialogId: { $in: dialogs } },
            {
              $or: [
                {
                  $and: [
                    {
                      dialogInitiatorId: new mongoose.Types.ObjectId(user._id),
                    },
                    {
                      dialogReceiverId: {
                        $exists: false,
                      },
                    },
                  ],
                },
                {
                  $and: [
                    { dialogReceiverId: new mongoose.Types.ObjectId(user._id) },
                    {
                      dialogInitiatorId: {
                        $exists: false,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        }).exec(),
        //but if the oter user hasn't deleted this dialog yet
        //we just unsubscibe from it so that this dialog is still in the database
        //and the other user can see it
        Message.updateMany(
          {
            $and: [
              {
                $or: [
                  { dialogInitiatorId: new mongoose.Types.ObjectId(user._id) },
                  { dialogReceiverId: new mongoose.Types.ObjectId(user._id) },
                ],
              },
              { dialogId: { $in: dialogs } },
            ],
          },
          [
            {
              $set: {
                dialogInitiatorId: {
                  $cond: {
                    if: {
                      $eq: [
                        new mongoose.Types.ObjectId(user._id),
                        '$dialogInitiatorId',
                      ],
                    },
                    then: '$$REMOVE',
                    else: '$dialogInitiatorId',
                  },
                },
              },
            },
            {
              $set: {
                dialogReceiverId: {
                  $cond: {
                    if: {
                      $eq: [
                        new mongoose.Types.ObjectId(user._id),
                        '$dialogReceiverId',
                      ],
                    },
                    then: '$$REMOVE',
                    else: '$dialogReceiverId',
                  },
                },
              },
            },
          ]
        ).exec(),
      ]).then((data) => {
        //data is always array of 2 items
        //each item's data is mutually excluded
        //i.e. if first item's deletedCount property != 0,
        //then second item's nModified property is always = 0
        //and vice versa
        let deletedCount = 0
        data.forEach((item) => {
          if (item.deletedCount) deletedCount = item.deletedCount
          if (item.nModified) deletedCount = item.nModified
        })

        return { deletedCount }
      })
    } catch (error) {
      console.log(error)
      throw internalServerError
    }
  },
}
export default messageQueries

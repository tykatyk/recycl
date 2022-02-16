import getCoords from '../../getCoords'
import removalApplication from '../../validation/removalApplication' //ToDo: Add validation before create and update operations
import { RemovalApplication } from '../models'
import mongoose from 'mongoose'

export default {
  create: async (data, user) => {
    if (!user) return null

    const placeId = data.wasteLocation['place_id']
    const coords = await getCoords(placeId)

    if (!coords) {
      //ToDo: Throw GrpahQl error
    }

    try {
      data.userId = user['_id']
      data.wasteLocation.position = {}
      const locationCoords = data.wasteLocation.position
      locationCoords.type = 'Point'
      locationCoords.coordinates = coords

      const removalAppliaction = new RemovalApplication(data)
      return await removalAppliaction.save()
    } catch (error) {
      //ToDo: Throw GrpahQl error
      return error
    }
  },

  get: async (id) => {
    try {
      return await RemovalApplication.findById(id).populate('wasteType').exec()
    } catch (err) {
      return err
    }
  },

  getForMap: async (visibleRect, wasteTypes) => {
    if (
      !visibleRect ||
      visibleRect.length == 0 ||
      !wasteTypes ||
      wasteTypes.length == 0
    )
      return null

    try {
      const result = await RemovalApplication.aggregate([
        {
          $match: {
            'wasteLocation.position.coordinates': {
              $geoWithin: {
                $geometry: {
                  type: 'Polygon',
                  coordinates: visibleRect,
                },
              },
            },
            wasteType: {
              $eq: mongoose.Types.ObjectId(wasteTypes),
            },
          },
        },
        {
          $group: {
            _id: '$wasteLocation.place_id',
            totalWeight: { $sum: '$quantity' },

            wasteLocation: {
              $first: '$wasteLocation',
            },
          },
        },
      ]).allowDiskUse(true)
      return result
    } catch (error) {
      //ToDo: Throw GrpahQl error
      console.log(error)
      return error
    }
  },

  getAll: async () => {
    try {
      return await RemovalApplication.find().populate('wasteType')
    } catch (err) {
      return err
    }
  },

  getWithMessageCount: async (user) => {
    if (!user) return null
    try {
      return await RemovalApplication.aggregate([
        {
          $match: { userId: user['_id'] },
        },
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

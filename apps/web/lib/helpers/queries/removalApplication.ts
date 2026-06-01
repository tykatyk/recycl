import getCoords from '../getCoords'
import { RemovalApplicationModel } from '@recycl/shared/dist/server/db'
import { INTERNAL_SERVER_ERROR } from '../../errors'

const removalApplicationQueries = {
  create: async (data, user) => {
    if (!user) return null

    try {
      const placeId = data.wasteLocation['place_id']
      const coords = await getCoords(placeId)

      if (!coords || coords.length < 2) {
        throw new Error(`Cannot get coordinates for placeId ${placeId}`)
      }

      data.user = user['_id']
      data.wasteLocation.position = {}

      const locationCoords = data.wasteLocation.position
      locationCoords.type = 'Point'
      locationCoords.coordinates = coords

      const removalAppliaction = new RemovalApplicationModel(data)
      return await removalAppliaction.save()
    } catch (error) {
      console.log(error)
      throw new Error(INTERNAL_SERVER_ERROR)
    }
  },

  get: async (id: string) => {
    //ToDo: check if id is of type ObjectId
    try {
      const result = await RemovalApplicationModel.findById(id)
        // .populate('user')
        .exec()
      return result
    } catch (error) {
      console.log(error)
      throw new Error(INTERNAL_SERVER_ERROR)
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
      const result = await RemovalApplicationModel.aggregate([
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
              $eq: wasteTypes,
            },
          },
        },
        {
          $group: {
            _id: '$wasteLocation.place_id',
            totalWeight: { $sum: '$quantity' },
            totalProposals: { $sum: 1 },
            // wasteTypeId: { $first: '$wasteType' },
            wasteLocation: {
              $first: '$wasteLocation.position.coordinates',
            },
          },
        },
      ]).allowDiskUse(true)

      return result
    } catch (error) {
      console.log(error)
      throw new Error(INTERNAL_SERVER_ERROR)
    }
  },

  getAll: async (queryParams, user) => {
    try {
      if (!user) return null
      const query = {}

      if (queryParams.city) query['wasteLocation.place_id'] = queryParams.city

      return await RemovalApplicationModel.find(query)
    } catch (error) {
      console.log(error)
      throw new Error(INTERNAL_SERVER_ERROR)
    }
  },

  //get removal applications
  //and counts number of unread messages per application
  getWithMessageCount: async (user) => {
    if (!user) return null
    try {
      const result = await RemovalApplicationModel.aggregate([
        {
          $match: { user: user['_id'] },
        },
        // {
        //   $lookup: {
        //     from: 'wastetypes',
        //     localField: 'wasteType',
        //     foreignField: '_id',
        //     as: 'wasteType',
        //   },
        // },
        // { $unwind: '$wasteType' },
        {
          $lookup: {
            from: 'messages',
            let: { id: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ['$$id', '$ad'] }, { viewed: false }],
                  },
                },
              },
            ],
            as: 'messages',
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $project: {
            messageCount: { $size: '$messages' },
            document: '$$ROOT',
          },
        },
        {
          $unset: 'document.messages',
        },
      ])

      return result
    } catch (error) {
      console.log(error)
      throw new Error(INTERNAL_SERVER_ERROR)
    }
  },

  update: async (id, newValue) => {
    try {
      return await RemovalApplicationModel.findByIdAndUpdate(id, newValue, {
        new: true,
      }).exec()
    } catch (error) {
      console.log(error)
      throw new Error(INTERNAL_SERVER_ERROR)
    }
  },

  delete: async (id) => {
    try {
      return await RemovalApplicationModel.findByIdAndRemove(id).exec()
    } catch (error) {
      console.log(error)
      throw new Error(INTERNAL_SERVER_ERROR)
    }
  },

  deleteMany: async (ids) => {
    try {
      return await RemovalApplicationModel.deleteMany({
        _id: { $in: ids },
      }).exec()
    } catch (error) {
      console.log(error)
      throw new Error(INTERNAL_SERVER_ERROR)
    }
  },
}
export default removalApplicationQueries

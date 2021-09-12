import RemovalApplicationModel from './dbModels'

class RemovalApplicationDataService {
  async create(data) {
    const removalApplication = new RemovalApplicationModel(data)
    return await removalApplication.save()
  }

  async getOne(id) {
    return await RemovalApplicationModel.findById(id).exec()
  }
  async getAll() {
    return await RemovalApplicationModel.find().exec()
  }
  async update(id, newValue) {
    return await RemovalApplicationModel.findByIdAndUpdate(id, newValue, {
      new: true,
    }).exec()
  }
  async delete(id) {
    return await RemovalApplicationModel.findByIdAndRemove(id).exec()
  }
}

export default new RemovalApplicationDataService()

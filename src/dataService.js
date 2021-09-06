import http from './httpCommon'
import RemovalApplicationModel from './dbSchema'

class RemovalApplicationDataService {
  async create(data) {
    const removalApplication = new RemovalApplicationModel(data)
    return await removalApplication.save()
  }

  async find(id) {
    return await findById(id).exec()
  }
}

export default new RemovalApplicationDataService()

import { RemovalApplication, WasteType } from './dbModels'

class DbQueries {
  constructor(modelName) {
    this.models = {
      RemovalApplication,
      WasteType,
    }
    if (!this.models[modelName]) throw `${modelName} is unknow model name`
    this.model = this.models[modelName]
  }

  async create(data) {
    const modelInstance = new this.model(data)
    return await modelInstance.save()
  }

  async getOne(id) {
    return await this.model.findById(id).exec()
  }

  async getAll() {
    console.log(await WasteType.find({}))
    return await WasteType.find({})
  }

  async update(id, newValue, modelName) {
    return await this.model
      .findByIdAndUpdate(id, newValue, {
        new: true,
      })
      .exec()
  }

  async delete(id) {
    return await this.model.findByIdAndRemove(id).exec()
  }
}

export default DbQueries

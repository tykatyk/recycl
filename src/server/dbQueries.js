import { RemovalApplication, WasteType } from './dbModels'

class DbQueries {
  constructor(modelName) {
    this.models = {
      RemovalApplication,
      WasteType,
    }
    if (!this.models[modelName]) {
      console.log(new Error(`${modelName} is unknow model name`))
      return undefined
    }
    this.model = this.models[modelName]
  }

  async create(data) {
    try {
      const modelInstance = new this.model(data)
      return await modelInstance.save()
    } catch (err) {
      console.log(`Cannot create ${modelInstance.constructor.modelName}`)
    }
  }

  async getOne(id) {
    try {
      return await this.model.findById(id).exec()
    } catch (err) {
      console.log(`Cannot get ${this.model.collection.collectionName}`)
    }
  }

  async getAll() {
    try {
      return await this.model.find({})
    } catch (err) {
      console.log(`Cannot get ${this.model.collection.collectionName}`)
    }
  }

  async update(id, newValue, modelName) {
    try {
      return await this.model
        .findByIdAndUpdate(id, newValue, {
          new: true,
        })
        .exec()
    } catch (err) {
      console.log(`Cannot update ${this.model.collection.collectionName}`)
    }
  }

  async delete(id) {
    try {
      return await this.model.findByIdAndRemove(id).exec()
    } catch (err) {
      console.log(`Cannot delete ${this.model.collection.collectionName}`)
    }
  }
}

export default DbQueries

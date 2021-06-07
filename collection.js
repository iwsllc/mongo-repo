var sharedMongo = require('./shared-db')
var {ObjectID} = require('mongodb')

class Collection {
  set record(Model) {
    this.Model = Model
  }

  get record() {
    return this.Model
  }

  new(defaults) {
    if (this.Model == null) return {}
    if (defaults != null) return new this.Model({...this.defaults, ...defaults})
    return new this.Model()
  }

  mapMerge(docs) {
    return docs.map(d => this.merge(d))
  }

  merge(doc) {
    if (doc == null) return doc
    return this.new(doc)
  }

  check() {
    if (sharedMongo.client == null || sharedMongo.db == null) throw new Error('Need to initialize connection')
  }

  get collection() {
    this.check()
    return sharedMongo.db.collection(this.collectionName)
  }

  async findById(_id) {
    if (!ObjectID.isValid(_id)) throw new Error('id provided is not a valid ObjectID') // this was part of the original implementation; assuming all _id are objectID

    return await this.collection?.findOne({_id})
  }

  async find(query) {
    let result = await this.collection.find(query).toArray()
    if (result?.length) {
      return result.map(d => this.merge(d))
    }
    return []
  }

  async findCursor(query, options) {
    return await this.collection.findCursor(query, options)
  }

  async findOne(query) {
    let result = await this.collection.findOne(query)
    if (result != null) return this.merge(result)
    return result
  }

  async insert(data) {
    let result = await this.collection.insertOne(data)
    if (result?.result?.ok === 1 && result?.ops?.length) {
      return {
        doc: this.merge(result.ops[0]),
        driver: result,
      }
    }
  }

  async upsert(query, data) {
    let result = await this.collection.findOneAndUpdate(query, {$set: {...data}}, {upsert: true, returnDocument: 'after'})
    if (result.ok) return this.merge(result.value)
    return null
  }

  async findAndModify(query, sort, update, options) {
    let result = await this.collection.findAndModify(query, sort, update, options)
    return {ok: result.ok, value: this.merge(result.value)}
  }

  async findOneAndUpdate(query, update, options = {returnDocument: 'after'}) {
    let result = await this.collection.findOneAndUpdate(query, update, options)
    return {ok: result.ok, value: this.merge(result.value)}
  }

  async update(query, set, options) {
    return await this.updateMany(query, set, options)
  }

  async updateMany(query, set, options) {
    return await this.collection.updateMany(query, set, options)
  }

  async updateOne(query, set, options) {
    return await this.collection.updateOne(query, set, options)
  }

  async removeById(_id) {
    return await this.deleteOne({_id})
  }

  async deleteById(_id) {
    return await this.deleteOne({_id})
  }

  async deleteOne(query, options) {
    return await this.collection.deleteOne({query, options})
  }

  async remove(query, options) {
    return await this.deleteMany(query, options)
  }

  async deleteMany(query, options) {
    return await this.collection.deleteMany(query, options)
  }

  async count(query) {
    return await this.collection.countDocuments(query)
  }

  async aggregate(pipeline) {
    return new Promise((resolve, reject) => {
      return this.collection.aggregate(pipeline, (err, cursor) => {
        if (err) return reject(err)
        resolve(cursor)
      })
    })
  }
}

module.exports = Collection

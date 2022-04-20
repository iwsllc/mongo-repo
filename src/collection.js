/* eslint-disable new-cap */
const sharedMongo = require('./shared-db')
const mongodb = require('mongodb')
const _ = require('lodash')

class BaseCollection {
  constructor() {
    this.collectionName = ''

    // set a placeholder
    this.record = (defaults) => {
      if (defaults) { _.merge(this, defaults) }
      return this
    }
  }

  new(defaults) {
    return new this.record(defaults)
  }

  merge(err, doc, done) {
    if (err) return done(err)
    if (!doc) return done()
    done(null, this.new(doc))
  }

  findById(id, done) {
    if (typeof (id) === 'string' && mongodb.ObjectID.isValid(id)) {
      id = mongodb.ObjectID(id)
    }
    this.findOne({ _id: id }, (err, doc) => {
      this.merge(err, doc, done)
    })
  }

  find(query, done) {
    sharedMongo.open((err, db) => {
      if (err) return done(err)
      const collection = db.collection(this.collectionName)
      collection.find(query).toArray((err, docs) => {
        if (err) return done(err)
        if (!docs || !docs.length) return done(null, [])
        done(null, docs.map((d) => { return this.new(d) }))
      })
    })
  }

  findCursor(query, options, done) {
    if (typeof (options) === 'function') {
      done = options
      options = {}
    }
    sharedMongo.open((err, db) => {
      if (err) return done(err)
      const collection = db.collection(this.collectionName)
      done(null, collection.find(query, options))
    })
  }

  findOne(query, done) {
    sharedMongo.open((err, db) => {
      if (err) return done(err)
      const collection = db.collection(this.collectionName)
      collection.findOne(query, (err, doc) => { this.merge(err, doc, done) })
    })
  }

  insert(data, done) {
    sharedMongo.open((err, db) => {
      if (err) return done(err)

      const collection = db.collection(this.collectionName)
      collection.insert(data, (err, result) => {
        done(err, result && result.ops && result.ops.length ? this.new(result.ops[0]) : null, result)
      })
    })
  }

  upsert(query, data, done) {
    sharedMongo.open((err, db) => {
      if (err) return done(err)
      const collection = db.collection(this.collectionName)
      collection.update(query, data, { upsert: true }, (err, result) => {
        if (err) return done(err)
        if (result && result.result && result.result.upserted && result.result.upserted.length) {
          this.findById(result.result.upserted[0]._id, done)
        } else return done()
      })
    })
  }

  findAndModify(query, sort, update, options, done) {
    sharedMongo.open((err, db) => {
      if (err) return done(err)

      const collection = db.collection(this.collectionName)
      collection.findAndModify(query, sort, update, options, (err, result) => {
        return this.merge(err, result ? result.value : null, done)
      })
    })
  }

  update(query, setQuery, options, done) {
    if (typeof (options) === 'function') {
      done = options
      options = {}
    }
    sharedMongo.open((err, db) => {
      if (err) return done(err)

      const collection = db.collection(this.collectionName)
      collection.updateMany(query, setQuery, options, done)
    })
  }

  removeById(id, done) {
    if (typeof (id) === 'string' && mongodb.ObjectID.isValid(id)) {
      id = mongodb.ObjectID(id)
    }
    sharedMongo.open((err, db) => {
      if (err) return done(err)
      const collection = db.collection(this.collectionName)
      collection.remove({ _id: id }, {}, done)
    })
  }

  remove(query, options, done) {
    if (typeof (options) === 'function') {
      done = options
      options = {}
    }

    sharedMongo.open((err, db) => {
      if (err) return done(err)

      const collection = db.collection(this.collectionName)
      collection.deleteMany(query, options, done)
    })
  }

  count(query, done) {
    sharedMongo.open((err, db) => {
      if (err) return done(err)
      const collection = db.collection(this.collectionName)
      collection.count(query, done)
    })
  }

  aggregate(pipeline, options, next) {
    if (typeof options === 'function') {
      next = options
      options = {}
    }
    sharedMongo.open((err, db) => {
      if (err) return next(err)
      const collection = db.collection(this.collectionName)
      if (options.cursor) {
        const cursor = collection.aggregate(pipeline, options)
        next(null, cursor)
      } else {
        collection.aggregate(pipeline, options, (err, cursor) => {
          if (err) return next(err)
          cursor.toArray((err, docs) => {
            if (err) return next(err)
            return next(null, docs)
          })
        })
      }
    })
  }
}

module.exports = BaseCollection

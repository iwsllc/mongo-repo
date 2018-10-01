var sharedMongo = require('./shared-db')
var mongodb     = require("mongodb")
var _           = require("lodash")


class GenericDb {
  constructor() {
    this.collectionName = ""
  }

  record(defaults) {
    if (defaults)
      _.merge(this,defaults)
    return this
  }

  new(defaults) {
    return new this.record(defaults)
  }

  merge(err,doc,done) {
    if (err) return done(err)
    if (!doc) return done()
    done(null, this.new(doc))
  }

  findById(id, done) {
    if (typeof(id) === "string" && mongodb.ObjectID.isValid(id)) {
      id = mongodb.ObjectID(id)
    }
    this.findOne({_id : id}, (err, doc) => {
      this.merge(err, doc, done)
    })
  }

  find(query, done) {
    sharedMongo.openDefaultDb((err,db) => {
      if (err) return done(err)
      var collection = db.collection(this.collectionName)
      collection.find(query).toArray((err,docs) => {
        if (err) return done(err)
        if (!docs || !docs.length) return done(null, [])
        done(null, docs.map((d) => {return this.new(d)}))
      })
    })
  }
  findCursor(query, options, done) {
    if (typeof(options) === 'function')
    {
      done = options
      options = {}
    }
    sharedMongo.openDefaultDb((err, db) => {
      if (err) return done(err)
      var collection = db.collection(this.collectionName)
      done(null, collection.find(query, options))
    })
  }

  findOne(query, done) {
    sharedMongo.openDefaultDb((err,db) => {
      if (err) return done(err)
      var collection = db.collection(this.collectionName)
      collection.findOne(query, (err,doc) => { this.merge(err,doc,done) })
    })
  }

  insert(data, done) {
    sharedMongo.openDefaultDb((err,db) => {
      if (err) return done(err)

      var collection = db.collection(this.collectionName);
      collection.insert(data, (err, result) => {
        done(err,result && result.ops && result.ops.length ? this.new(result.ops[0]) : null, result);
      })
    })
  }

  upsert(query, data, done) {
    this.update(query, data, {upsert: true}, done)
  }

  findAndModify(query, sort, update, options, done) {
    sharedMongo.openDefaultDb((err,db) => {
      if (err) return done(err)

      var collection = db.collection(this.collectionName);
      collection.findAndModify(query, sort, update, options, (err, result) => {
        return this.merge(err, result ? result.value : null, done)
      })
    })
  }
  update(query, setQuery, options, done) {
    if (typeof(options) === 'function') {
      done = options
      options = {}
    }
    sharedMongo.openDefaultDb((err,db) => {
      if (err) return done(err)

    var collection = db.collection(this.collectionName);
    collection.update(query, setQuery, options, (err, writeResult) => {
      if (err) return done(err)
      done(null, writeResult.result)
    })
  })
  }

  removeById(id, done) {
    this.deleteOne({_id: id}, {}, done)
  }

  delete(query, options, done) {
    if (typeof(options) === 'function')
    {
      done = options
      options = {}
    }

    sharedMongo.openDefaultDb((err,db) => {
      if (err) return done(err)

      var collection = db.collection(this.collectionName)
      collection.deleteMany(query, options, done)
    })
  }
  deleteOne(query, options, done) {
    if (typeof(options) === 'function')
    {
      done = options
      options = {}
    }

    sharedMongo.openDefaultDb((err,db) => {
      if (err) return done(err)

      var collection = db.collection(this.collectionName)
      collection.deleteOne(query, options, done)
    })
  }
  remove(query, options, done) {
    this.deleteMany(query, options, done)
  }

  count(query, done) {
    sharedMongo.openDefaultDb((err,db) => {
      if (err) return done(err)
      var collection = db.collection(this.collectionName)
      collection.count(query, done)
    })
  }

  aggregate(pipeline, options, next) {
    if (typeof options === "function") {
      next = options
      options = {}
    }
    sharedMongo.openDefaultDb((err,db) => {
      if (err) return next(err)
      var collection = db.collection(this.collectionName)
      if (options.cursor) {
        let cursor = collection.aggregate(pipeline, options)
        next(null, cursor)
      } else
        collection.aggregate(pipeline, options, next)
    })
  }
}


module.exports = GenericDb

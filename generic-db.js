var sharedMongo = require('./shared-db')
var mongodb     = require("mongodb")
var _           = require("lodash")


var genericDb = function() {}

genericDb.prototype.collectionName = ''
genericDb.prototype.record = function(defaults) {
  if (defaults)
    _.merge(this,defaults)
  return this
}

genericDb.prototype.new = function(defaults) {
  return new this.record(defaults)
}

genericDb.prototype.merge = function(err,doc,done) {
  if (err) return done(err)
  if (!doc) return done()
  done(null, this.new(doc))
}

genericDb.prototype.findById = function(id, done) {
  if (typeof(id) === "string" && mongodb.ObjectID.isValid(id)) {
    id = mongodb.ObjectID(id)
  }
  this.findOne({_id : id}, (err, doc) => {
    this.merge(err, doc, done)
  })
}

genericDb.prototype.find = function(query, done) {
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
genericDb.prototype.findCursor = function(query, options, done) {
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

genericDb.prototype.findOne = function(query, done) {
  sharedMongo.openDefaultDb((err,db) => {
    if (err) return done(err)
    var collection = db.collection(this.collectionName)
    collection.findOne(query, (err,doc) => { this.merge(err,doc,done) })
  })
}

genericDb.prototype.insert = function(data, done) {
  sharedMongo.openDefaultDb((err,db) => {
    if (err) return done(err)

    var collection = db.collection(this.collectionName);
    collection.insert(data, (err, result) => {
      done(err,result && result.ops && result.ops.length ? this.new(result.ops[0]) : null, result);
    })
  })
}

genericDb.prototype.upsert = function(query, data, done) {
  this.update(query, data, {upsert: true}, done)
}

genericDb.prototype.findAndModify = function(query, sort, update, options, done) {
  sharedMongo.openDefaultDb((err,db) => {
    if (err) return done(err)

    var collection = db.collection(this.collectionName);
    collection.findAndModify(query, sort, update, options, (err, result) => {
      return this.merge(err, result ? result.value : null, done)
    })
  })
}
genericDb.prototype.update = function(query, setQuery, options, done) {
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

genericDb.prototype.removeById = function(id, done) {
  if (typeof(id) === "string" && mongodb.ObjectID.isValid(id)) {
    id = mongodb.ObjectID(id)
  }
  sharedMongo.openDefaultDb((err,db) => {
    if (err) return done(err)
    var collection = db.collection(this.collectionName)
    collection.remove({_id : id}, {}, done)
  })
}

genericDb.prototype.remove = function(query, options, done) {
  if (typeof(options) === 'function')
  {
    done = options
    options = {}
  }

  sharedMongo.openDefaultDb((err,db) => {
    if (err) return done(err)

    var collection = db.collection(this.collectionName)
    collection.remove(query, options, done)
  })
}

genericDb.prototype.count = function(query, done) {
  sharedMongo.openDefaultDb((err,db) => {
    if (err) return done(err)
    var collection = db.collection(this.collectionName)
    collection.count(query, done)
  })
}

genericDb.prototype.aggregate = function(pipeline, options, next) {
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


module.exports = genericDb

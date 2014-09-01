var sharedMongo = require('./shared-db')
var mongodb     = require("mongodb")
var _           = require("lodash")


var genericDb = function() {}

genericDb.prototype.collectionName = ''
genericDb.prototype.record = new function(){} //default

genericDb.prototype.new = function(defaults) {
  var n = new this.record()
  if (defaults)
    _.merge(n,defaults)
  return n
}

genericDb.prototype.merge = function(err,doc,done) {
  if (err) return done(err)
  done(null, this.mergeSync(doc))
}
genericDb.prototype.mergeSync = function(doc) {
  var result = doc
  if (doc) {
    result = this.new()
    _.merge(result,doc)
  }
  return result
}

genericDb.prototype.findById = function(id, done) {
  var self = this
  if (typeof(id) === 'string') {
    id = mongodb.ObjectID(id)
  }
  this.findOne({_id : id}, function(err,doc) { self.merge(err,doc,done) });
}

genericDb.prototype.find = function(query, done) {
  var self = this
  sharedMongo.open(function(err,db) {
    if (err) return done(err)

    var collection = db.collection(self.collectionName)
    collection.find(query).toArray(function(err,docs) {
      if (err) return done(err)
      if (!docs || !docs.length) return done(null, [])
      var rdocs = []
      _.forEach(docs,function(doc) {rdocs.push(_.merge(self.new(),doc))})
      done(null, rdocs)
    })
  })
}
genericDb.prototype.findCursor = function(query, options, done) {
  var self = this
  sharedMongo.open(function(err,db) {
    if (err) return done(err)

    var collection = db.collection(self.collectionName)
    done(null, collection.find(query, options))
  })
}

genericDb.prototype.findOne = function(query, done) {
  var self = this
  sharedMongo.open(function(err,db) {
    if (err) return done(err)

    var collection = db.collection(self.collectionName)
    collection.findOne(query, function(err,doc) { self.merge(err,doc,done) })
  })
}

genericDb.prototype.insert = function(data, done) {
  var self = this
  sharedMongo.open(function(err,db) {
    if (err) return done(err)

    var collection = db.collection(self.collectionName);
    collection.insert(data, function(err, records) {
      done(err,records && records.length ? records[0] : null);
    })
  })
}

genericDb.prototype.upsert = function(query, data, done) {
  this.update(query, data, {upsert : true}, done)
}

genericDb.prototype.findAndModify = function(query, sort, update, options, done) {
  var self = this
  sharedMongo.open(function(err,db) {
    if (err) return done(err)

    var collection = db.collection(self.collectionName);
    collection.findAndModify(query, sort, update, options, done)
  })
}
genericDb.prototype.update = function(query, setQuery, options, done) {
  var self = this
  if (typeof(options) === 'function') {
    done = options
    options = {}
  }
  sharedMongo.open(function(err,db) {
    if (err) return done(err)

    var collection = db.collection(self.collectionName);
    collection.update(query, setQuery, options, done)
  })
}

genericDb.prototype.removeById = function(id, done) {
  var self = this
  sharedMongo.open(function(err,db) {
    if (err) return done(err)

    var collection = db.collection(self.collectionName)
    collection.remove({_id : id}, {}, done)
  })
}

genericDb.prototype.remove = function(query, options, done) {
  var self = this

  if (typeof(options) === 'function')
  {
    done = options
    options = {}
  }

  sharedMongo.open(function(err,db) {
    if (err) return done(err)

    var collection = db.collection(self.collectionName)
    collection.remove(query, options, done)
  })
}

genericDb.prototype.count = function(query, done) {
  var self = this

  sharedMongo.open(function(err,db) {
    if (err) return done(err)

    var collection = db.collection(self.collectionName)
    collection.count(query, done)
  })
}

module.exports = genericDb

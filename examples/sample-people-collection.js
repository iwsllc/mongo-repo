var util        = require('util')
var async       = require('async')
var baseRepo    = require('../index').collection
var sharedMongo = require('../index').db
var model       = require("./model")

//Setting up collection definition
var repo = function() {
  baseRepo.call(this)
  this.collectionName = 'people'
  this.record = model
  return this
}
util.inherits(repo, baseRepo)


//sample extension on the collection
repo.prototype.findByEmail = function (email, done) {
  this.findOne({email : email}, done)
}

repo.prototype.ensureIndexes = function(done) {
  sharedMongo.open((err,db) => {
    if (err) return done(err)

    var collection = db.collection(this.collectionName)
    async.series([
     (cb) => {collection.ensureIndex({'email' : 1}, {}, cb)} //array index; could get large
     //more here.
    ], done)
  })
}


var db = new repo()
db.ensureIndexes() //always ensure them once.
module.exports = db

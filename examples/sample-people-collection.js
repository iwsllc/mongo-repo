var util        = require('util')
var base_collection    = require('../generic-db')

//sample record; will be used as a baseline for all find operations.
var record = function() {
  this._id   = null
  this.name  = null
  this.email = null
  return this
}

//  prototypes defined on record will carry through to the doc results
//  of the find operations
record.prototype.whatsMyName = function() { console.log("My name is " + this.name) }

//Setting up collection definition
var collection = function() {
  this.collectionName = 'people'
  this.record = record
  return this
}
util.inherits(collection, base_collection)


//sample extension on the collection
collection.prototype.findByEmail = function(email, done) {
  this.findOne({email : email}, done)
}

module.exports = new collection()

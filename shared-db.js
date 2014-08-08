var mongo    = require('mongodb')
var MongoClient = mongo.MongoClient, Server = mongo.Server

var SharedDb = function() {
  this.url = null
  this.sharedDb = null
  return this
}

SharedDb.prototype.init = function(url, done) {
  this.url = url
  this.open(done)
}
SharedDb.prototype.open = function(done) {
  var self = this;

  if (typeof done == "undefined")
    done = function(err,db) { if (err) console.log(err) } //empty placeholder

  if (!self.sharedDb) {
    MongoClient.connect(this.url, function(err, db) {
      if (err)
        return done(err)

      self.sharedDb = db;
      return done(null,self.sharedDb)
    })
  }
  else
    done(null,self.sharedDb)
}
SharedDb.prototype.close = function() {
  if (this.sharedDb)
    this.sharedDb.close();
}

module.exports = new SharedDb

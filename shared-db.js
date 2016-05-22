var mongo    = require('mongodb')
var MongoClient = mongo.MongoClient

var shared = function() {
  this.url = null
  this.shared = null
  return this
}

shared.prototype.init = function(url, done) {
  this.url = url
  this.open(done)
}
shared.prototype.open = function(done) {
  var self = this;

  if (typeof done === "undefined")
    done = function(err) { if (err) throw err } //empty placeholder

  if (!self.shared) {
    MongoClient.connect(this.url, function(err, db) {
      if (err)
        return done(err)

      self.shared = db;
      return done(null,self.shared)
    })
  }
  else
    done(null,self.shared)
}
shared.prototype.close = function() {
  if (this.shared)
    this.shared.close();
}

module.exports = new shared()

var mongo    = require('mongodb')
var MongoClient = mongo.MongoClient

class Shared {
  constructor() {
    this.url = null
    this.shared = null
  }
  init(url, done) {
    this.url = url
    this.open(done)
  }
  open(done) {
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
  close() {
    if (this.shared)
      this.shared.close();
  }
}


module.exports = new Shared()

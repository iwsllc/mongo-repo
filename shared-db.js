var mongo    = require('mongodb')
var MongoClient = mongo.MongoClient, Server = mongo.Server
var sharedDb    = null;

exports.open = function(mongoUrl, done) {
  if (typeof done == "undefined")
    done = function(err,db) { if (err) console.log(err) } //empty placeholder

  if (!sharedDb) {
    MongoClient.connect(mongoUrl, function(err, db) {
      if (err)
        return done(err)

      sharedDb = db;
      return done(null,sharedDb)
    })
  }
  else
    done(null,sharedDb)
}
exports.close = function() {
  if (sharedDb)
    sharedDb.close();
}

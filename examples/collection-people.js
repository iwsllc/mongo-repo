const async          = require("async")
const BaseCollection = require('../index').collection
const sharedMongo    = require('../index').db
const model          = require("./model-person")

class PeopleCollection extends BaseCollection {
  constructor() {
    super()
    this.collectionName = "people"
    this.record = model
  }
  findByEmail(email, done) {return this.findOne({email}, done)}
  ensureIndexes(done) {
    if (typeof done == 'undefined') done = function(err) {if (err) logger.log(err)}

    sharedMongo.open((err, db) => {
      if (err) return done(err)

      var collection = db.collection(this.collectionName)
      async.series([
        (cb) => {collection.ensureIndex({email: 1}, {unique: true}, cb)} //array index; could get large
      ],done)
    })
  }

}

var db = new PeopleCollection()
db.ensureIndexes() //always ensure them once.
module.exports = db

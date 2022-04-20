const BaseCollection = require('../src').collection
const sharedMongo = require('../src').db
const model = require('./model-person')

class PeopleCollection extends BaseCollection {
  constructor() {
    super()
    this.collectionName = 'people'
    this.record = model
  }

  findByEmail(email, done) { return this.findOne({ email }, done) }
  ensureIndexes(done) {
    if (typeof done === 'undefined') done = function(err) { if (err) console.error(err) }

    sharedMongo.open((err, db) => {
      if (err) return done(err)

      const collection = db.collection(this.collectionName)
      collection.ensureIndex({ email: 1 }, {}, done)
    })
  }
}

const db = new PeopleCollection()
module.exports = db

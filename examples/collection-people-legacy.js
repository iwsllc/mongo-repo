const BaseCollection = require('../index').collectionLegacy
const model = require('./model-person')

class PeopleCollection extends BaseCollection {
  constructor() {
    super()
    this.collectionName = 'people'
    this.record = model
  }

  findByEmail(email, done) { return this.findOne({email}, done) }
}

var db = new PeopleCollection()
module.exports = db

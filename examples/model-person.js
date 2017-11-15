var mongodb = require("mongodb")
var BaseRecord = require("./model-base")
var Address = require("./model-sub")

class PersonRecord extends BaseRecord {
  constructor(props = {}) {
    super(props)
    this.initDefaults({
      _id      : mongodb.ObjectID()
      ,firstName: null
      ,lastName : null
      ,email    : null
      ,phone    : null
      ,books    : 0
      ,home     : null
    })

    if (props.home) this.home = new Address(props.home)
  }
  fullName() {
    return `${this.firstName} ${this.lastName}`
  }
}

module.exports = PersonRecord

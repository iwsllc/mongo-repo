var base     = require("./base")
var mongodb  = require("mongodb")
var util     = require("util")
var location = require("./sub")

var record = function(defaults) {
  //defaults
  this._id       = mongodb.ObjectID()
  this.firstName = null
  this.lastName  = null
  this.email     = null
  this.phone     = null
  this.books     = 0
  this.home      = null

  base.call(this, defaults)

  if (defaults) {
    if (defaults.home)
      this.home = new location(defaults.home)
  }

  return this
}
util.inherits(record, base)

record.prototype.fullName = () => {
  return `${this.firstName} ${this.lastName}`
}

module.exports = record

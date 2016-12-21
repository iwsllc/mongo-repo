var base    = require("./base")
var util    = require("util")

var record = function(defaults) {
  this.address    = null
  this.city       = null
  this.state      = null
  this.postalCode = null
  this.country    = null

  base.call(this, defaults)
  return this
}
util.inherits(record, base)

record.prototype.fullAddress = function() {
  return `${address}; ${city}, ${state} ${postalCode}; ${country}`
}

module.exports = record

var _    = require("lodash")

var record = function(defaults) {
  if (defaults)
    _.merge(this, defaults)
  return this
}

module.exports = record

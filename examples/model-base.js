var _ = require('lodash')

class BaseRecord {
  constructor(defaults) {
    _.assignIn(this, defaults)
  }

  initDefaults(hash) {
    if (!hash) return
    for (var key in hash) {
      if (typeof this[key] === 'undefined') { this[key] = hash[key] }
    }
  }
}

module.exports = BaseRecord

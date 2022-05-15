const _ = require('lodash')

class BaseRecord {
  /**
   * @param {<Dictionary<string,any>} defaults Initialize this model with these key values.
   */
  constructor(defaults) {
    _.assignIn(this, defaults)
  }

  /**
   * @param {any} defaultsIfEmpty Provide default values when initalizing a new object. These will be yeild to keys provided by the constructor arguments
   * @returns void
   */
  initDefaults(defaultsIfEmpty) {
    if (defaultsIfEmpty == null) return
    _.defaults(this, defaultsIfEmpty)
  }
}

module.exports = BaseRecord

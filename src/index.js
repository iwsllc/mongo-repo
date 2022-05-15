const { getDb, closeDb, init } = require('./db')

module.exports = {
  collection: require('./collection'), // base collection class
  model: require('./model'), // base model class
  db: require('./shared-db'), // legacy; with callbacks
  getDbAsync: getDb,
  closeDbAsync: closeDb,
  initAsync: init
}

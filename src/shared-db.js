const { getDb, closeDb, init } = require('./db')

function legacyGetDb(dbName, done) {
  getDb(dbName)
    .then((db) => {
      done(null, db)
    })
    .catch(done)
}

// NOTE: Legacy API
exports.close = (done) => {
  closeDb()
    .then(() => { done?.() })
}

exports.init = (url, done) => {
  init(url)
    .then(() => {
      legacyGetDb(undefined, done)
    })
    .catch(done)
}
exports.open = (done) => {
  legacyGetDb(undefined, done)
}

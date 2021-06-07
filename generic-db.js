const Collection = require('./collection')

class GenericDb extends Collection {
  execPromise(asyncMethod, ...args) {
    // specific for these methods; there is always params and always a callback
    let callback = args?.length >= 1 ? args[args.length - 1] : null
    let params = args?.length >= 2 ? args.slice(0, args.length - 1) : null

    asyncMethod.call(this, ...params, callback)
      .then((result) => {
        if (callback != null) callback(null, result)
      })
      .catch((err) => {
        if (callback != null) callback(err)
      })
  }

  // overrides
  findById(id, done) { this.execPromise(super.findById, id, done) }
  find(query, done) { this.execPromise(super.find, query, done) }
  findCursor(query, options, done) { this.execPromise(super.findCursor, query, options, done) }
  findOne(query, done) { this.execPromise(super.findOne, query, done) }
  insert(data, done) {
    this.execPromise(super.insert, data, (err, result) => {
      done(err, result.doc, result.driver)
    })
  }

  upsert(query, data, done) { this.execPromise(super.upsert, query, data, done) }
  findAndModify(query, sort, update, options, done) {
    this.execPromise(super.findAndModify, query, sort, update, options, (err, found) => {
      if (err) return done(err)
      done(null, found.value)
    })
  }

  update(query, set, options, done) { this.execPromise(super.update, query, set, options, done) }
  removeById(id, done) { this.execPromise(super.removeById, id, done) }
  remove(query, options, done) { this.execPromise(super.remove, query, options, done) }
  count(query, done) { this.execPromise(super.count, query, done) }
  aggregate(aggregate, done) { this.execPromise(super.aggregate, aggregate, done) }
}

module.exports = GenericDb

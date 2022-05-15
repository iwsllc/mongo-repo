const { MongoClient } = require('mongodb')
const debug = require('debug')('web:lib:db')
const _ = require('lodash')

let _client = null

exports.init = async function(uri, options) {
  if (_client == null) {
    const optionsWithDefaults = _.defaults(options, { useUnifiedTopology: true })
    const url = new URL(uri)
    debug(`Connecting to MongoDb: ${url.host}`)
    _client = new MongoClient(uri, optionsWithDefaults)
    await _client.connect()
    await _client.db('admin').command({ ping: 1 }) // sanity check
  }
  return _client
}

exports.getDb = async function getDb(name) {
  if (_client == null) throw new Error('MongoDb connection not initialized.')
  return _client.db(name)
}

exports.closeDb = async function closeDb() {
  debug('Closing MongoDb connection...')
  if (_client == null) return
  await _client.close()
}

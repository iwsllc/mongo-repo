const { MongoClient } = require('mongodb')

let sharedClient = null

// NOTE: creates client and connects
const getClient = async(url) => {
  if (sharedClient == null) sharedClient = new MongoClient(url)
  await sharedClient.connect()

  const dbUrl = new URL(url)
  console.debug(`Connected to MongoDB server...${dbUrl.hostname} DB: ${dbUrl.pathname}`)
  return sharedClient
}

const init = async(url) => {
  await getClient(url)
  return await open()
}

function quickCheck() {
  if (sharedClient == null) throw new Error('Client not initialized.')
}
// uses open database (or if undefined default)
const open = async(dbName) => {
  quickCheck()
  if (dbName == null) await sharedClient.db()
  return await sharedClient.db(dbName)
}

const close = async() => {
  if (sharedClient != null) await sharedClient.close()
}

exports.open = (done) => {
  open()
    .then(db => done(null, db))
    .catch(done)
}
exports.close = (done) => {
  open()
    .then(done)
    .catch(done)
}

exports.init = (url, done) => {
  init(url)
    .then((db) => done(null, db))
    .catch(done)
}

exports.openAsync = open
exports.initAsync = init
exports.closeAsync = close

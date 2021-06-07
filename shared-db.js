const {MongoClient} = require('mongodb')
const {parse} = require('url')

class Database {
  open(url, opts, callback) {
    this.connect(url, opts)
      .then(() => {
        callback(null, this.db)
      })
      .catch((err) => {
        callback(err)
      })
  }

  async connect(url, opts) {
    let uri = parse(url)
    let host = uri.host
    let dbName = uri.pathname.slice(1)

    opts = {
      ...opts,
      ...{
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }

    this.client = await MongoClient.connect(url, opts)
    console.log(`Connected MongoDB to ${host}/${dbName}`)
    this.db = this.client.db(dbName)
  }

  async close() {
    console.log('Closing MongoDB connection')
    if (this.client) return this.client.close()
  }
}

module.exports = new Database()

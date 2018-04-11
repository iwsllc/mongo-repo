const mongo       = require('mongodb')
const MongoClient = mongo.MongoClient
const _           = require("lodash")
const url         = require("url")

class SharedDb {
  constructor(options = {}) {
    this.options = options
    this.client = null
  }
  init(options = {}, done) { //legacy mapping
    this.options = options
    _.defaults(this.options, {url: "", name: ""})
    let conArgs = url.parse(this.options.url)
    if (conArgs.pathname && !this.options.name) { //if no name provided but connection string contains pathname; set name from pathname
      this.options.name = conArgs.pathname.replace(/^\//, "")
    } else {
      //cannot determine database name from connection
    }

    this.open(done)
  }
  openDefaultDb(done) {
    this.open((err, client) => {
      if (err) return done(err)
      done(null, client.db(this.options.name))
    })
  }
  open(done) {
    if (typeof done === "undefined")
      done = (err) => { if (err) throw err } //empty placeholder

    if (!this.client)
      MongoClient.connect(this.options.url, {}, (err, connectedClient) => {
        if (err) return done(err)
        this.client = connectedClient
        return done(null, this.client)
      })
    else return done(null, this.client)
  }
  close() {
    this.client.close();
  }
}

module.exports = new SharedDb()

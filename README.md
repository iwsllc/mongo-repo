#Simple MongoDb Wrapper
[![Build Status](https://travis-ci.org/IWSLLC/mongo-repo.svg?branch=master)](https://travis-ci.org/IWSLLC/mongo-repo)


I use this utility for some of my own projects. It's a lightweight wrapper for the native mongodb NodeJs driver. The main advantage is the re-use of the common document definition. The find results will create new instances of the existing prototype and then merge the data into the instance.

It's meant to allow you to extend other native hooks you commonly use.

## Get Started
Extend the base collection in your own collection module. [Full example collection](./examples/collection-people.js)

[Model example](./examples/model-person.js)

```javascript
class Model {
  ///...
}

class PeopleCollection extends BaseCollection {
  //define collection name and base model type
  constructor() {
    super()
    this.collectionName = "people"
    this.record = Model
  }

  //optional helpers
  findByEmail(email, done) {return this.findOne({email}, done)}

  //optional index setup
  ensureIndexes(done) {
    if (typeof done == 'undefined') done = function(err) {if (err) logger.log(err)}

    sharedMongo.open((err, db) => {
      if (err) return done(err)

      var collection = db.collection(this.collectionName)
      async.series([
        (cb) => {collection.ensureIndex({email: 1}, {}, cb)}
        //more here
      ],done)
    })
  }
}
var db = new PeopleCollection()
db.ensureIndexes() //only run in dev/small dbs. Larger dbs should handle indexes more delicately.
module.exports = db
```

## Using collections
```javascript
//call once when bootstrapping your app with a connection pool.
require("../shared-db").init("mongodb://localhost:27017/mongo-repo-test", (err) => {
  if (err) return console.log(err)

  //use collection instance
  var people = require("./people")
  people.findByEmail("test@me.com", function(err, doc) {
    console.log(doc)
  })
})
```

## Included Helpers
 - find          - `function({query}, callback)` callback returns array of documents
 - findOne       - `function({query}, callback)` callback returns matching document
 - findById      - `function(_id, callback)` callback returns document
 - findAndModify - `function({query}, [sort], {update}, {options}, callback)` - native passthrough
 - insert        - `function({data}, callback)`  callback returns inserted document; assuming one doc
 - update        - `function({data}, callback)`  native passthrough
 - upsert        - `function({data}, callback)`  native passthrough
 - removeById    - `function(_id, callback)` native passthrough
 - remove        - `function({query}, callback)` native passthrough
 - count         - `function({query}, callback)` native passthrough

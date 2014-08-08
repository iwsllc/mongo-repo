#Simple MongoDb Wrapper

I use this utility for some of my own projects. It's a lightweight wrapper for the native mongodb NodeJs driver. The main advantage is the re-use of the common document definition. The find results will create new instances of the existing prototype and then merge the data into the instance.

It's meant to allow you to extend other native hooks you commonly use.

##Get Started
Extend the base collection in your own collection module

    var util        = require('util')
    var baseRepo    = require('skinny-mongo').collection

    //sample record; will be used as a baseline for all find operations.
    var record = function() {
      this._id   = null
      this.name  = null
      this.email = null
      return this
    }
    //You can add record prototypes and they'll be included on the find results.

    //Setup collection definition
    var collection = function() {
      this.collectionName = 'people'
      this.record = record
      return this
    }
    util.inherits(repo, baseRepo)

    //add more collection prototypes here like helper queries.
    collection.prototype.findByEmail = function(email,done) {
      this.findOne({email : email}, done)
    }

    module.exports = new collection()

##Using collections

    //call once when bootstrapping your app. This connection will get re-used with every call.
    var db = require("skinny-mongo").db

    //create collection instance
    var people = require("./people")
    people.findByEmail("test@me.com", function(err,doc) {
      console.log(doc.email)
    })


##Included Helpers

 - find          - function({query}, callback) callback returns array of documents
 - findOne       - function({query}, callback) callback returns matching document
 - findById      - function(_id, callback) callback returns document
 - findAndModify - function({query}, [sort], {update}, {options}, callback) - native passthrough
 - insert        - function({data}, callback)  callback returns inserted document; assuming one doc
 - update        - function({data}, callback)  native passthrough
 - upsert        - function({data}, callback)  native passthrough
 - removeById    - function(_id, callback) native passthrough
 - remove        - function({query}, callback) native passthrough
 - count         - function({query}, callback) native passthrough

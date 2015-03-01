should = require 'should'
collection = require("../generic-db")
db = new collection()

describe "Generic DB", ->
  describe "Model defaults", ->
    describe "When creating new instance of empty model", ->
      before ->
        @model = db.new()
      it "should setup a new instance", -> should.exist @model

    describe "When creating new instance of an existing model", ->
      before ->
        @model = db.new({something : 'test', number : 123})
      it "should setup a new instance with merged text", -> @model.something.should.be.ok
      it "should setup a new instance with merged number", -> @model.number.should.be.ok

    describe "When creating new instance of an existing model with a custom record type", ->
      before ->
        #modeled after our basic base class.
        base = (defaults) ->
          _.merge(@, defaults) if (defaults)
          @

        #custom default type
        record = (defaults) ->
          @something = 'test'
          @number = 1235
          base.call @,defaults
          @

        #custom collection; one should be implemented per collection
        custom_collection = ->
          collection.call @
          @collectionName = 'something_else'
          @record = record
          @
        require("util").inherits(custom_collection, collection)
        custom_collection.prototype.findBySomething = (something, done) -> done()

        @db = new custom_collection()
        @model = @db.new()

      it "should setup a new instance with merged text", -> @model.something.should.be.ok
      it "should setup a new instance with merged number", -> @model.number.should.be.ok
      it "should change the collection name", -> @db.collectionName.should.equal "something_else"
      it "should include override", -> (typeof @db.findBySomething).should.equal "function"

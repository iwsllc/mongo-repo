should     = require 'should'
collection = require "../generic-db"
db         = new collection()
sinon      = require "sinon"
models     = require "./test-model"

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
        @db = new models.collection()
        @model = @db.new()

      it "should setup a new instance with merged text", -> @model.something.should.be.ok
      it "should setup a new instance with merged number", -> @model.number.should.be.ok
      it "should change the collection name", -> @db.collectionName.should.equal "students"
      it "should include override", -> (typeof @db.findBySomething).should.equal "function"

should     = require 'should'
people     = require "../examples/collection-people"
model      = require "../examples/model-person"

describe "Generic DB", ->
  describe "Repo defaults", ->
    it "should change the collection name", -> people.collectionName.should.equal "people"
    it "should include override", -> (typeof people.findByEmail).should.equal "function"

  describe "Model defaults", ->
    describe "When creating new instance of empty model", ->
      before ->
        @model = people.new()
      it "should setup a new instance", -> should.exist @model

    describe "When creating new instance of an existing model", ->
      before ->
        @model = people.new({firstName : 'test', books : 123})

      it "should setup a new instance with merged text", -> @model.firstName.should.equal "test"
      it "should setup a new instance with merged number", -> @model.books.should.equal 123

{ expect }     = require 'chai'
people     = require "../examples/collection-people"
model      = require "../examples/model-person"

describe "Generic DB", ->
  describe "Repo defaults", ->
    it "should change the collection name", -> expect(people.collectionName).to.equal "people"
    it "should include override", -> expect(typeof people.findByEmail).to.equal "function"

  describe "Model defaults", ->
    describe "When creating new instance of empty model", ->
      before ->
        @model = people.new()
      it "should setup a new instance", -> expect(@model).to.be.ok
      it "should create default _id", -> expect(@model).to.be.ok

    describe "When creating new instance of empty model with overrides", ->
      before ->
        @model = people.new({firstName: 'test'})
      it "should create default _id", -> expect(@model.firstName).to.equal 'test' 
      it "should create default lastName", -> expect(@model.lastName).to.equal null
      it "should NOT create default thingThatDoesntExist", -> expect(@model.thingThatDoesntExist).to.equal undefined

    describe "When creating new instance of an existing model", ->
      before ->
        @model = people.new({firstName : 'test', books : 123})

      it "should setup a new instance with merged text", -> expect(@model.firstName).to.equal "test"
      it "should setup a new instance with merged number", -> expect(@model.books).to.equal 123

should = require 'should'
require("../shared-db").init("mongodb://localhost:27017/mongo-repo-test")

describe "Setting up db connection", ->
  it "should work", -> true.should.be.true

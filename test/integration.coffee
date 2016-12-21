async  = require 'async'
should = require 'should'
people = require "../examples/sample-people-collection"
model  = require "../examples/model"
shared = require("../index").db

describe "Integration tests", ->
  describe "insert", ->
    before (done) ->
      #native reset
      shared.open (err, db) =>
        done err if err?
        c = db.collection("people")
        async.series [
          (cb) -> c.remove {}, cb
          (cb) => people.insert {firstName: "test3"}, (err, result, driver_result) =>
            @result = result
            @driver_result = driver_result
            cb err
        ], done
    it "should return the inserted doc", -> @result.firstName.should.equal "test3"
    it "should return the inserted doc with an _id", -> should.exist @result._id
    it "should return the driver result", -> should.exist @driver_result
    it "should return the driver result, result", -> @driver_result.result.ok.should.equal 1

  describe "removeById", ->
    before (done) ->
      #native reset
      shared.open (err, db) =>
        done err if err?
        c = db.collection("people")
        async.series [
          (cb) -> c.remove {}, cb
          (cb) => people.insert {firstName: "test3"}, (err, result, driver_result) =>
            @result = result
            cb err
          (cb) => people.removeById @result._id.toString(), (err, driver_result) =>
            @driver_result = driver_result
            cb err
        ], done
    it "should return the driver result", -> should.exist @driver_result
    it "should return the driver result, result", -> @driver_result.result.ok.should.equal 1
    it "should return the driver result, affected 1", -> @driver_result.result.n.should.equal 1

  describe "findOne; model init", ->
    describe "When finding matching doc", ->
      before (done) ->
        #native reset
        shared.open (err,db) =>
          done err if err?
          c = db.collection("people")
          async.series [
            (cb) -> c.remove {}, cb
            (cb) -> c.insert {firstName : "test1"}, cb
            (cb) -> c.insert {firstName : "test2"}, cb
            (cb) -> c.insert {firstName : "test3"}, cb
            (cb) =>
              people.findOne {firstName : /^test/}, (err,doc) =>
                @result = doc
                cb err
          ],done

      it "should find match", -> should.exist @result
      it "should have first result", -> @result.firstName.should.equal "test1"
      it "should include model function", -> (typeof @result.fullName).should.equal "function"

  describe "find; model init", ->
    describe "When finding matching doc", ->
      before (done) ->
        #native reset
        shared.open (err,db) =>
          done err if err?
          c = db.collection("people")
          async.series [
            (cb) -> c.remove {}, cb
            (cb) -> c.insert {firstName : "test1"}, cb
            (cb) -> c.insert {firstName : "test2"}, cb
            (cb) -> c.insert {firstName : "test3"}, cb
            (cb) =>
              people.find {firstName : /^test/}, (err,docs) =>
                @result = docs
                cb err
          ],done

      it "should find match", -> should.exist @result
      it "should find match", -> @result.length.should.be.ok
      it "should have first result", -> @result[0].firstName.should.equal "test1"
      it "should include model function", -> (typeof @result[0].fullName).should.equal "function"

    describe "When finding matching doc with sub-type", ->
      before (done) ->
        #native reset
        shared.open (err,db) =>
          done err if err?
          c = db.collection("people")
          async.series [
            (cb) -> c.remove {}, cb
            (cb) -> c.insert {firstName : "test1", home : {address : 'test'}}, cb
            (cb) -> c.insert {firstName : "test2", home : {address : 'test'}}, cb
            (cb) -> c.insert {firstName : "test3", home : {address : 'test'}}, cb
            (cb) =>
              people.find {firstName : /^test/}, (err,docs) =>
                @result = docs
                cb err
          ],done

      it "should find match", -> should.exist @result
      it "should find match", -> @result.length.should.be.ok
      it "should have first result", -> @result[0].firstName.should.equal "test1"
      it "should include model function", -> (typeof @result[0].fullName).should.equal "function"
      it "should include sub model function", -> (typeof @result[0].home.fullAddress).should.equal "function"

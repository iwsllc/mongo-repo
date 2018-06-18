async  = require 'async'
should = require 'should'
people = require "../examples/collection-people"
model  = require "../examples/model-person"
shared = require("../index").db

describe "Integration tests", ->
  describe "insert", ->
    before (done) ->
      #native reset
      shared.openDefaultDb (err, db) =>
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
      shared.openDefaultDb (err, db) =>
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
        shared.openDefaultDb (err,db) =>
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
        shared.openDefaultDb (err,db) =>
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
        shared.openDefaultDb (err,db) =>
          done err if err?
          c = db.collection("people")
          async.series [
            (cb) -> c.remove {}, cb
            (cb) -> c.insert {firstName : "test1", home : {address : 'test'}}, cb
            (cb) -> c.insert {firstName : "test2", home : {address : 'test'}}, cb
            (cb) -> c.insert {firstName : "test3", home : {address : 'test'}}, cb
            (cb) =>
              people.find {firstName : /^test/}, (err, docs) =>
                @result = docs
                cb err
          ],done

      it "should find match", -> should.exist @result
      it "should find match", -> @result.length.should.be.ok
      it "should have first result", -> @result[0].firstName.should.equal "test1"
      it "should include model function", -> (typeof @result[0].fullName).should.equal "function"
      it "should include sub model function", -> (typeof @result[0].home.fullAddress).should.equal "function"

    describe "When findAndModify matching doc with sub-type", ->
      before (done) ->
        #native reset
        shared.openDefaultDb (err,db) =>
          done err if err?
          c = db.collection("people")
          async.series [
            (cb) -> c.remove {}, cb
            (cb) -> c.insert {firstName : "test1", home : {address : 'test'}}, cb
            (cb) -> c.insert {firstName : "test2", home : {address : 'test'}}, cb
            (cb) -> c.insert {firstName : "test3", home : {address : 'test'}}, cb
            (cb) => people.findAndModify {firstName : /^test/},[["_id", "asc"]],{$inc: {books: 1}},{new: true}, (err, @result) => cb err
          ],done

      it "should find match", -> should.exist @result
      it "should find matching record", -> @result.firstName.should.equal "test1"
      it "should increment property", -> @result.books.should.equal 1
      it "should include model function", -> (typeof @result.fullName).should.equal "function"
      it "should include sub model function", -> (typeof @result.home.fullAddress).should.equal "function"

    describe "When upsert new doc", ->
      before (done) ->
        #native reset
        shared.openDefaultDb (err, db) =>
          return done err if err?
          c = db.collection("people")
          async.series [
            (cb) => c.remove {}, cb
            (cb) => people.upsert {firstName : "test1"}, {firstName : "test1", home : {address : 'test'}}, (err, @result) => cb err
            (cb) => people.findById @result.upserted[0]._id, (err, @found) => cb err
          ], done

      it "should return result", -> should.exist @result
      it "should find matching record", -> @found.firstName.should.equal "test1"
      it "should include model function", -> (typeof @found.fullName).should.equal "function"
      it "should include sub model function", -> (typeof @found.home.fullAddress).should.equal "function"

  describe "count", ->
    describe "When counting", ->
      before (done) ->
        #native reset
        shared.openDefaultDb (err, db) =>
          done err if err?
          c = db.collection("people")
          async.series [
            (cb) -> c.remove {}, cb
            (cb) -> c.insert {firstName : "test1", home : {address : 'test'}}, cb
            (cb) -> c.insert {firstName : "test2", home : {address : 'test'}}, cb
            (cb) -> c.insert {firstName : "test3", home : {address : 'test'}}, cb
            (cb) => people.count {firstName : /^test/}, (err, @total) => cb(err)
          ],done
      it "should count total", -> @total.should.equal 3
  describe "aggregate", ->
    describe "When aggregating", ->
      before (done) ->
        #native reset
        shared.openDefaultDb (err, db) =>
          done err if err?
          c = db.collection("people")
          async.series [
            (cb) -> c.remove {}, cb
            (cb) -> c.insert {firstName : "test1", home : {address : 'test'}}, cb
            (cb) -> c.insert {firstName : "test2", home : {address : 'test'}}, cb
            (cb) -> c.insert {firstName : "test3", home : {address : 'test'}}, cb
            (cb) => people.aggregate [
              {$match: {firstName: /^test/}}
              {$group: {_id: 1, total: {$sum: 1}}}
            ], {cursor: null}, (err, cursor) =>
              # looks like this sends back a cursor always; rather than a buffered array when cursor option is null.
              cursor.toArray (err, @results) =>
                cb(err)
          ],done
      it "should count results", ->
        @results[0].total.should.eql 3
    describe "When aggregating with a cursor", ->
      before (done) ->
        #native reset
        shared.openDefaultDb (err, db) =>
          done err if err?
          c = db.collection("people")
          async.series [
            (cb) -> c.remove {}, cb
            (cb) -> c.insert {firstName : "test1", home : {address : 'test'}}, cb
            (cb) -> c.insert {firstName : "test2", home : {address : 'test'}}, cb
            (cb) -> c.insert {firstName : "test3", home : {address : 'test'}}, cb
            (cb) => people.aggregate [
                {$match: {firstName: /^test/}}
                {$group: {_id: 1, total: {$sum: 1}}}
              ], {cursor: {}}, (err, cursor) =>
                cb(err) if err
                cursor.toArray (err, @results) =>
                  cb(err)
          ], done

      it "should count results", -> @results[0].total.should.eql 3

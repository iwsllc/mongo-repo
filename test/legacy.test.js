/* eslint-disable no-unused-expressions */

const people = require('../examples/collection-people-legacy')
const Model = require('../examples/model-person')
const shared = require('../index').db

describe('Integration tests [Legacy]', function() {
  describe('insert', function() {
    before(function(done) {
      // native reset
      let c = shared.db.collection('people')
      c.removeMany({})
        .then(() => {
          this.model = new Model({firstName: 'test4'})
          people.insert(this.model, (err, result, driverResult) => {
            this.result = result
            this.driver_result = driverResult
            done(err)
          })
        })
        .catch(done)
    })
    it('should return the inserted doc', function() { expect(this.result.firstName).to.equal('test4') })
    it('should merge doc with Model', function() { expect(typeof this.result.doSomething).to.equal('function') })
    it('should return the inserted doc with an _id', function() { expect(this.result._id.toString()).to.equal(this.model._id.toString()) })
    it('should return the driver result, result', function() { expect(this.driver_result.result.ok).to.equal(1) })
  })

  describe('removeById', function() {
    before(async function() {
      // native resaet
      let c = shared.db.collection('people')
      await c.removeMany({})
      let result = await c.insertOne({firstName: 'test3'})
      let id = result.insertedId
      return await new Promise((resolve, reject) => {
        people.removeById(id, (err, result) => {
          if (err) return reject(err)
          this.result = result
          resolve()
        })
      })
    })
    it('should work', function() { expect(this.result.result.ok).to.equal(1) })
    it('should return affected rows 1', function() { expect(this.result.result.n).to.equal(1) })
  })

  describe('remove', function() {
    before(async function() {
      // native resaet
      let c = shared.db.collection('people')
      await c.deleteMany({})
      await c.insertMany([
        {firstName: 'test1', home: {address: 'test1'}},
        {firstName: 'test2', home: {address: 'test2'}},
        {firstName: 'test3', home: {address: 'test3'}},
      ])
      return await new Promise((resolve, reject) => {
        people.remove({firstName: /^test/}, (err, result) => {
          if (err) return reject(err)
          this.result = result
          resolve()
        })
      })
    })
    it('should work', function() { expect(this.result.result.ok).to.equal(1) })
    it('should return affected rows 3', function() { expect(this.result.result.n).to.equal(3) })
  })

  describe('findOne; model init', function() {
    describe('When finding matching doc', function() {
      before(async function() {
        // native resaet
        let c = shared.db.collection('people')
        await c.removeMany({})
        await c.insertMany([{firstName: 'test1'}, {firstName: 'test2'}, {firstName: 'test3'}])
        return await new Promise((resolve, reject) => {
          people.findOne({firstName: /^test/}, (err, found) => {
            if (err) return reject(err)
            this.result = found
            resolve()
          })
        })
      })
      it('should find doc', function() { expect(this.result.firstName).to.equal('test1') })
      it('should merge doc with Model', function() { expect(typeof this.result.doSomething).to.equal('function') })
    })
  })

  describe('find; model init', function() {
    describe('When finding matching docs', function() {
      before(async function() {
        let c = shared.db.collection('people')
        await c.removeMany({})
        await c.insertMany([{firstName: 'test1'}, {firstName: 'test2'}, {firstName: 'test3'}])
        return await new Promise((resolve, reject) => {
          people.find({firstName: /^test/}, (err, results) => {
            if (err) return reject(err)
            this.result = results
            resolve()
          })
        })
      })
      it('should find docs', function() { expect(this.result.length).to.equal(3) })
      it('should map/merge docs with Model', function() { expect(this.result.map(d => typeof d.doSomething)).to.include.members(['function']) })
    })
    describe('When finding matching doc with sub-type', function() {
      before(async function() {
        let c = shared.db.collection('people')
        await c.removeMany({})
        await c.insertMany([
          {firstName: 'test1', home: {address: 'test1'}},
          {firstName: 'test2', home: {address: 'test2'}},
          {firstName: 'test3', home: {address: 'test3'}},
        ])
        return await new Promise((resolve, reject) => {
          people.find({firstName: /^test/}, (err, docs) => {
            if (err) return reject(err)
            this.docs = docs
            resolve()
          })
        })
      })
      it('should find docs', function() { expect(this.docs.length).to.equal(3) })
      it('should map/merge docs with Model', function() { expect(this.docs.map(d => typeof d.doSomething)).to.include.members(['function']) })
      it('should map/merge docs\' subdocs with Address Model', function() { expect(this.docs.map(d => typeof d.home.fullAddress)).to.include.members(['string']) })
    })
  })

  describe('findAndModify', function() {
    describe('When findAndModify matching doc with sub-type', function() {
      before(async function() {
        let c = shared.db.collection('people')
        await c.removeMany({})
        await c.insertMany([
          {firstName: 'test1', home: {address: 'test1'}},
          {firstName: 'test2', home: {address: 'test2'}},
          {firstName: 'test3', home: {address: 'test3'}},
        ])

        await new Promise((resolve, reject) => {
          people.findAndModify({firstName: /^test/}, [['_id', 'asc']], {$inc: {books: 1}}, {new: true}, (err, doc) => {
            if (err) return reject(err)
            this.doc = doc
            resolve()
          })
        })
      })
      it('should find doc', function() { expect(this.doc).to.exist })
      it('should find doc', function() { expect(this.doc.firstName).to.equal('test1') })
      it('should merge doc with Model', function() { expect(typeof this.doc.fullName).to.equal('string') })
      it('should increment property', function() { expect(this.doc.books).to.equal(1) })
      it('should merge doc\'s subdoc with Address Model', function() { expect(typeof this.doc.home.fullAddress).to.equal('string') })
    })
  })

  describe('upsert', function() {
    describe('When upsert new doc', function() {
      before(async function() {
        let c = shared.db.collection('people')
        await c.removeMany({})

        await new Promise((resolve, reject) => {
          people.upsert({firstName: 'test1'}, {firstName: 'test1', home: {address: 'test'}}, (err, found) => {
            if (err) return reject(err)
            this.doc = found
            return resolve()
          })
        })
      })
      it('should find doc', function() { expect(this.doc).to.exist })
      it('should find matching doc', function() { expect(this.doc.firstName).to.equal('test1') })
      it('should merge doc with Model', function() { expect(typeof this.doc.fullName).to.equal('string') })
      it('should merge doc\'s subdoc with Address Model', function() { expect(typeof this.doc.home.fullAddress).to.equal('string') })
    })
  })

  describe('count', function() {
    describe('When counting', function() {
      before(async function() {
        let c = shared.db.collection('people')
        await c.removeMany({})
        await c.insertMany([
          {firstName: 'test1', home: {address: 'test1'}},
          {firstName: 'test2', home: {address: 'test2'}},
          {firstName: 'test3', home: {address: 'test3'}},
        ])

        await new Promise((resolve, reject) => {
          people.count({firstName: /^test/}, (err, total) => {
            if (err) return reject(err)
            this.total = total
            resolve()
          })
        })
      })
      it('should find doc', function() { expect(this.total).to.equal(3) })
    })
  })

  describe('aggregate', function() {
    describe('When aggregating; default mode: buffered', function() {
      before(async function() {
        let c = shared.db.collection('people')
        await c.removeMany({})
        await c.insertMany([
          {firstName: 'test1', home: {address: 'test1'}},
          {firstName: 'test2', home: {address: 'test2'}},
          {firstName: 'test3', home: {address: 'test3'}},
        ])
        await new Promise((resolve, reject) => {
          people.aggregate([
            {$match: {firstName: /^test/}},
            {$group: {_id: 1, total: {$sum: 1}}},
          ], (err, cursor) => {
            if (err) return reject(err)
            cursor.toArray((err, results) => {
              if (err) return reject(err)
              this.results = results
              resolve()
            })
          })
        })
      })
      it('should count docs', function() { expect(this.results[0].total).to.equal(3) })
    })
  })
})

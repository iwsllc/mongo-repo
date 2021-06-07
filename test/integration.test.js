/* eslint-disable no-unused-expressions */

const people = require('../examples/collection-people')
const Model = require('../examples/model-person')
const shared = require('../index').db

describe('Integration tests', function() {
  describe('insert', function() {
    before(async function() {
      // native reset
      let c = shared.db.collection('people')
      await c.deleteMany({})
      this.model = new Model({firstName: 'test3'})
      this.result = await people.insert(this.model)
    })
    it('should return the inserted doc', function() { expect(this.result.doc.firstName).to.equal('test3') })
    it('should merge doc with Model', function() { expect(typeof this.result.doc.doSomething).to.equal('function') })
    it('should return the driver result', function() { expect(this.result.driver.result.ok).to.equal(1) })
  })
  describe('removeById', function() {
    before(async function() {
      // native resaet
      let c = shared.db.collection('people')
      await c.deleteMany({})
      let result = await c.insertOne({firstName: 'test3'})
      let id = result.insertedId
      let result2 = await people.removeById(id)
      this.result = result2
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
      let result2 = await people.remove({firstName: /^test/})
      this.result = result2
    })
    it('should work', function() { expect(this.result.result.ok).to.equal(1) })
    it('should return affected rows 3', function() { expect(this.result.result.n).to.equal(3) })
  })
  describe('findOne; model init', function() {
    describe('When finding matching doc', function() {
      before(async function() {
        let c = shared.db.collection('people')
        await c.deleteMany({})
        await c.insertMany([{firstName: 'test1'}, {firstName: 'test2'}, {firstName: 'test3'}])
        let result = await people.findOne({firstName: /^test/})
        this.result = result
      })
      it('should find doc', function() { expect(this.result.firstName).to.equal('test1') })
      it('should merge doc with Model', function() { expect(typeof this.result.doSomething).to.equal('function') })
    })
  })
  describe('find; model init', function() {
    describe('When finding matching docs', function() {
      before(async function() {
        let c = shared.db.collection('people')
        await c.deleteMany({})
        await c.insertMany([{firstName: 'test1'}, {firstName: 'test2'}, {firstName: 'test3'}])
        let result = await people.find({firstName: /^test/})
        this.result = result
      })
      it('should find docs', function() { expect(this.result.length).to.equal(3) })
      it('should map/merge docs with Model', function() { expect(this.result.map(d => typeof d.doSomething)).to.include.members(['function']) })
    })
    describe('When finding matching doc with sub-type', function() {
      before(async function() {
        let c = shared.db.collection('people')
        await c.deleteMany({})
        await c.insertMany([
          {firstName: 'test1', home: {address: 'test1'}},
          {firstName: 'test2', home: {address: 'test2'}},
          {firstName: 'test3', home: {address: 'test3'}},
        ])
        let docs = await people.find({firstName: /^test/})
        this.docs = docs
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
        await c.deleteMany({})
        await c.insertMany([
          {firstName: 'test1', home: {address: 'test1'}},
          {firstName: 'test2', home: {address: 'test2'}},
          {firstName: 'test3', home: {address: 'test3'}},
        ])

        let result = await people.findAndModify({firstName: /^test/}, [['_id', 'asc']], {$inc: {books: 1}}, {new: true})
        this.doc = result.value
      })
      it('should find doc', function() { expect(this.doc).to.exist })
      it('should find matching doc', function() { expect(this.doc.firstName).to.equal('test1') })
      it('should merge doc with Model', function() { expect(typeof this.doc.fullName).to.equal('string') })
      it('should increment property', function() { expect(this.doc.books).to.equal(1) })
      it('should merge doc\'s subdoc with Address Model', function() { expect(typeof this.doc.home.fullAddress).to.equal('string') })
    })
  })
  describe('upsert', function() {
    describe('When upsert new doc', function() {
      before(async function() {
        let c = shared.db.collection('people')
        await c.deleteMany({})

        let doc = await people.upsert({firstName: 'test1'}, {firstName: 'test1', home: {address: 'test'}})
        this.doc = doc
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
        await c.deleteMany({})
        await c.insertMany([
          {firstName: 'test1', home: {address: 'test1'}},
          {firstName: 'test2', home: {address: 'test2'}},
          {firstName: 'test3', home: {address: 'test3'}},
        ])

        this.total = await people.count({firstName: /^test/})
      })
      it('should find doc', function() { expect(this.total).to.equal(3) })
    })
  })

  describe('aggregate', function() {
    describe('When aggregating; default mode: buffered', function() {
      before(async function() {
        let c = shared.db.collection('people')
        await c.deleteMany({})
        await c.insertMany([
          {firstName: 'test1', home: {address: 'test1'}},
          {firstName: 'test2', home: {address: 'test2'}},
          {firstName: 'test3', home: {address: 'test3'}},
        ])
        let cursor = await people.aggregate([
          {$match: {firstName: /^test/}},
          {$group: {_id: 1, total: {$sum: 1}}},
        ])
        await new Promise((resolve, reject) => {
          cursor.toArray((err, results) => {
            if (err) return reject(err)
            this.results = results
            resolve()
          })
        })
      })
      it('should count docs', function() { expect(this.results[0].total).to.equal(3) })
    })
  })
})

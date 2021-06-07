/* eslint-disable no-unused-expressions */

const people = require('../examples/collection-people')
const Model = require('../examples/model-person')

describe('Generic DB', function() {
  describe('Repo defaults', function() {
    it('should change the collection name', function() { expect(people.collectionName).to.equal('people') })
    it('should include override', function() { expect(typeof people.findByEmail).to.equal('function') })
  })

  describe('Model defaults', function() {
    describe('When creating new instance of empty model', function() {
      before(function() {
        this.model = new Model()
      })
      it('should setup a new instance', function() { expect(this.model).to.exist })
    })

    describe('When creating new instance of an existing model', function() {
      before(function() {
        this.model = people.new({firstName: 'test', books: 123})
      })

      it('should setup a new instance with merged text', function() { expect(this.model.firstName).to.equal('test') })
      it('should setup a new instance with merged number', function() { expect(this.model.books).to.equal(123) })
    })
  })
})

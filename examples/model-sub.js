var BaseRecord = require('./model-base')

class AddressRecord extends BaseRecord {
  constructor(props) {
    super(props)
    this.initDefaults({
      address: null,
      city: null,
      state: null,
      postalCode: null,
      country: null,
    })
  }

  get fullAddress() {
    return `${this.address}; ${this.city}, ${this.state} ${this.postalCode}; ${this.country}`
  }
}

module.exports = AddressRecord

const expect = require('chai').expect

process.env.MONGODB_URI = 'mongodb://localhost:27017/mongo-repo-test'
global.expect = expect

console.log('Loaded mocha globals')

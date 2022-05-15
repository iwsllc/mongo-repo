{ init } = require('../src/db')

process.env.DEBUG=''

options = {
  connectTimeoutMS: 5000,
  reconnectTries: 0,
  autoReconnect: false
}

try
  await init "mongodb://localhost:27017/#{process.env.DB_NAME || 'mongo_repo_test'}", options
  run()
catch err
  console.error err if err?
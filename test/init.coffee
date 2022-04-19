require('../src').db.init "mongodb://localhost:27017/#{process.env.DB_NAME || 'mongo_repo_test'}", (err) ->
  return console.error err if err?
  run()
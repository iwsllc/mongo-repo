require('./globals')

async function start() {
  try {
    console.log(`connecting to: ${process.env.MONGODB_URI}`)
    const mongo = require('../index').db
    await mongo.connect(process.env.MONGODB_URI)
  } catch (err) {
    console.error('Unable to connect to mongodb:', err)
    process.exit(1)
  }
}
start()
  .then(global.run)
  .catch((err) => { console.error(err) })

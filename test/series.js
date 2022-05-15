const { promisify } = require('util')
/**
 * @param {Array<Promise>} promises List of promises to execute in sequence
 */
async function callInSequence(promises = []) {
  const results = new Array(promises.length)
  for (let ix = 0; ix < promises.length; ix++) {
    const pFn = promises[ix]
    try {
      const result = await pFn()
      results[ix] = { result }
    } catch (err) {
      results[ix] = { error: err }
    }
  }
  return results
}

exports.series = function(arrOfCallbackFuncs, done) {
  const promises = arrOfCallbackFuncs.map(f => promisify(f))
  callInSequence(promises)
    .then((results) => {
      done(null, results)
    })
    .catch(done)
}

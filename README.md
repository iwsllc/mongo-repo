# Simple MongoDb Wrapper (LEGACY)
[![Run tests](https://github.com/IWSLLC/mongo-repo/actions/workflows/tests.yml/badge.svg)](https://github.com/IWSLLC/mongo-repo/actions/workflows/tests.yml)

This is a really old, thin wrapper around the native mongoDB driver (originally v2) to support some repository-style use-cases.  The idea was to allow "models" and "collections" to be defined with pre-existing funcionality and those models be instantiated when enumerating a collection result.

This first version will just be a placeholder while we get projects updated to more recent versions of MongoDb Driver.


## Included Helpers
 - find          - `function({query}, callback)` callback returns array of documents
 - findOne       - `function({query}, callback)` callback returns matching document
 - findById      - `function(_id, callback)` callback returns document
 - findAndModify - `function({query}, [sort], {update}, {options}, callback)` - native passthrough
 - insert        - `function({data}, callback)`  callback returns inserted document; assuming one doc
 - update        - `function({data}, callback)`  native passthrough
 - upsert        - `function({data}, callback)`  native passthrough
 - removeById    - `function(_id, callback)` native passthrough
 - remove        - `function({query}, callback)` native passthrough
 - count         - `function({query}, callback)` native passthrough
 - aggregate     - `function({query}, callback)` native passthrough

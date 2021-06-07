#Simple MongoDb Wrapper
[![Build Status](https://travis-ci.org/IWSLLC/mongo-repo.svg?branch=master)](https://travis-ci.org/IWSLLC/mongo-repo)

This library is only really useful for mapping results to models. I would advise using the native MongoDb driver over a middleware like this.

[Model example](./examples/model-person.js)
[Collection example](./examples/collection-people.js)

## Included Helpers in legacy: `generic-db.js`
 - find          - `function({query}, callback)` callback returns array of documents
 - findOne       - `function({query}, callback)` callback returns matching document
 - findById      - `function(_id, callback)` callback returns document
 - findAndModify - `function({query}, [sort], {update}, {options}, callback)` - native passthrough [deprecated]
 - insert        - `function({data}, callback)`  callback returns inserted document; assuming one doc
 - update        - `function({data}, callback)`  native passthrough [deprecated]
 - upsert        - `function({data}, callback)`  native passthrough [deprecated]
 - removeById    - `function(_id, callback)` native passthrough
 - remove        - `function({query}, callback)` native passthrough [deprecated]
 - count         - `function({query}, callback)` native passthrough
 - aggregate     - `function({query}, callback)` native passthrough

## Included Helpers in updated: `collection.js`. All methods return `Promise`
 - find          - `function({query})` returns array of mapped documents
 - findOne       - `function({query}` returns matched document mapped to Model
 - findById      - `function(_id)` returns matched document mapped to Model
 - findOneAndUpdate - `function({query}, {update}, {options})` - native passthrough; returns after document mapped to Model
 - insert        - `function({data})`  native: `insertOne`; returns modified doc
 - update        - `function({data})`  native passthrough to `updateOne`
 - upsert        - `function({data})`  native passthrough to `findOneAndUpdate`; returns modified doc
 - removeById    - `function(_id) removes document by id; native: `deleteOne`
 - remove        - `function(_id) removes many documents; native: `deleteMany`
 - count         - `function({query})` native passthrough
 - aggregate     - `function({query})` promisified, returns aggregation cursor

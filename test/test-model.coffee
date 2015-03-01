generic = require "../generic-db"
_       = require "lodash"

#modeled after our basic base class on generic; assumes constructor arg can be merged into itself.
base = (defaults) ->
  _.merge(@, defaults) if (defaults)
  @

subrecord = (defaults)->
  @test = 'test'
  base.call @,defaults
  @

subrecord.prototype.testData = ->
  return @test

#custom default type
record = (defaults) ->
  @something = 'test'
  @name = 'test'
  @number = 1235
  @sub = null
  base.call @,defaults

  #custom sub type info.
  if defaults?.sub?
    @sub = new subrecord(defaults.sub)

  @

record.prototype.whatsMyName = ->
  return @name

#custom collection; one should be implemented per collection
collection = ->
  generic.call @
  @collectionName = 'students'
  @record = record
  @

require("util").inherits(collection, generic)

collection.prototype.findBySomething = (something, done) -> done()

module.exports =
  base : base
  record : record
  collection : collection

/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1894687828")

  // remove field
  collection.fields.removeById("bool4103720211")

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "number4131033149",
    "max": 300,
    "min": 0,
    "name": "xp",
    "onlyInt": true,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1894687828")

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "bool4103720211",
    "name": "validated",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // remove field
  collection.fields.removeById("number4131033149")

  return app.save(collection)
})

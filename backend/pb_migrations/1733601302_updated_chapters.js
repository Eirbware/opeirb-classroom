/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1894687828")

  // update collection data
  unmarshal({
    "updateRule": null
  }, collection)

  // update field
  collection.fields.addAt(1, new Field({
    "hidden": true,
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

  // update collection data
  unmarshal({
    "updateRule": ""
  }, collection)

  // update field
  collection.fields.addAt(1, new Field({
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
})

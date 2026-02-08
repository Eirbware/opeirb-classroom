/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1894687828")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": true,
    "id": "bool1872035370",
    "name": "certified",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1894687828")

  // remove field
  collection.fields.removeById("bool1872035370")

  return app.save(collection)
})

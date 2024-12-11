/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1894687828")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  // remove field
  collection.fields.removeById("url2216472865")

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2216472865",
    "max": 0,
    "min": 0,
    "name": "uri",
    "pattern": "^(/[^?#]*)$",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1894687828")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_j0PC5NBqqC` ON `chapters` (`uri`)"
    ]
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "exceptDomains": [],
    "hidden": false,
    "id": "url2216472865",
    "name": "uri",
    "onlyDomains": [],
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  // remove field
  collection.fields.removeById("text2216472865")

  return app.save(collection)
})

/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1894687828")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_j0PC5NBqqC` ON `chapters` (`uri`)"
    ],
    "name": "chapters"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1894687828")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_j0PC5NBqqC` ON `uris` (`uri`)"
    ],
    "name": "uris"
  }, collection)

  return app.save(collection)
})

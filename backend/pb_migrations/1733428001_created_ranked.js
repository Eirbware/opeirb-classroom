/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 0,
        "min": 0,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "json2782187217",
        "maxSize": 1,
        "name": "total_xp",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      }
    ],
    "id": "pbc_1984923209",
    "indexes": [],
    "listRule": null,
    "name": "ranked",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "SELECT users.id as id, SUM(uris.xp) as total_xp\n  FROM users left outer join validate on users.id = validate.user\n             inner join uris on validate.chapter = uris.id\n  GROUP BY users.id;",
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1984923209");

  return app.delete(collection);
})

/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1984923209")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT users.id as id, COALESCE(calculated_sum.total_xp, 0) as total_xp\n  FROM users left outer join (SELECT users.id as id, SUM(chapters.xp) as total_xp\n  FROM users inner join validate on users.id = validate.user\n             inner join chapters on validate.chapter = chapters.id\n  GROUP BY users.id) as calculated_sum on users.id = calculated_sum.id;"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1984923209")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT users.id as id, SUM(chapters.xp) as total_xp\n  FROM users left outer join validate on users.id = validate.user\n             inner join chapters on validate.chapter = chapters.id\n  GROUP BY users.id;"
  }, collection)

  return app.save(collection)
})

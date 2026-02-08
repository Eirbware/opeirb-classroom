/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1984923209")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT users.id AS id, COALESCE(calculated_sum.total_xp, 0) AS total_xp\n  FROM users LEFT OUTER JOIN (\n    SELECT users.id AS id, SUM(\n      CASE WHEN chapters.certified THEN chapters.xp ELSE 1 END\n    ) AS total_xp\n    FROM users INNER JOIN validate ON users.id = validate.user\n             INNER JOIN chapters ON validate.chapter = chapters.id\n    GROUP BY users.id\n  ) AS calculated_sum ON users.id = calculated_sum.id;"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1984923209")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT users.id AS id, COALESCE(calculated_sum.total_xp, 0) AS total_xp\n  FROM users LEFT OUTER JOIN (\n    SELECT users.id AS id, SUM(chapters.xp) AS total_xp\n    FROM users INNER JOIN validate ON users.id = validate.user\n             INNER JOIN chapters ON validate.chapter = chapters.id\n    GROUP BY users.id\n  ) AS calculated_sum ON users.id = calculated_sum.id;"
  }, collection)

  return app.save(collection)
})

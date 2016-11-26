exports.up = (knex, Promise) => {
  return knex.schema.hasTable('posts').then((exists) => {
    if (exists) return
    return knex.schema.createTable('posts', (table) => {
      table.string('id', 20).primary().unique()
      table.string('title', 100)
      table.string('name', 100)
      table.string('passkey', 150)
      table.text('content')
      table.date('createdAt')
    })
  }).then(() => {
    return knex.schema.hasTable('replies')
  }).then((exists) => {
    if (exists) return
    return knex.schema.createTable('replies', (table) => {
      table.string('id', 25).primary().unique()
      table.string('name', 100)
      table.string('passkey', 150)
      table.text('comment')
      table.date('createdAt')
    })
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('posts').then(() => {
    return knex.schema.dropTableIfExists('replies')
  })
}

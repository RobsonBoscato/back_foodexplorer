exports.up = knex => knex.schema.createTable('plates', table => {
  table.increments('id')
  table.text('title')
  table.text('description')
  table.binary('image').nullable()
  table.integer('user_id').references('id').inTable('users')
  table.enum('role', ['admin', 'customer'], { useNative: true, enumName: 'roles' })
    .notNullable().default('customer')

  table.timestamp('created_at').default(knex.fn.now())
  table.timestamp('updated_at').default(knex.fn.now())
})

exports.down = knex => knex.schema.dropTable('plates')


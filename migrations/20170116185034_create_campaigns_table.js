
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('campaigns', function(table) {
      table.increments('id').primary();
      table.string('name').unique().notNullable();
      table.string('localpart').unique().notNullable();
      table.timestamp('starts_at');
      table.timestamp('ends_at');
      table.timestamps(true, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('campaigns')
  ]);
};

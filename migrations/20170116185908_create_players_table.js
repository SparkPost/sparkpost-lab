
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('players', function(table) {
      table.increments('id').primary();
      table.integer('account_id').unique();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('players')
  ]);
};

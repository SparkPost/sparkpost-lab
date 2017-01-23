
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('players', function(table) {
      table.increments('id').primary();
      table.integer('account_id').unique();
      table.string('email').unique();
      table.string('first_name');
      table.string('last_name');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('players')
  ]);
};

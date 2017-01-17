
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('completions', function(table) {
      table.increments('id').primary();
      table.integer('participant_id').references('id').inTable('participants').notNullable();
      table.string('challenge_id').notNullable();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('completions')
  ]);
};

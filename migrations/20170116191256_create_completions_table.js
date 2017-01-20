
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('completions', function(table) {
      table.increments('id').primary();
      table.integer('player_id').references('id').inTable('players').notNullable();
      table.integer('campaign_id').references('id').inTable('campaigns').notNullable();
      table.unique(['player_id', 'campaign_id']);
      table.string('challenge_id').notNullable();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('completions')
  ]);
};

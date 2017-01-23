
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('completions', function(table) {
      table.increments('id').primary();
      table.integer('player_id').references('id').inTable('players').notNullable();
      table.integer('campaign_id').references('id').inTable('campaigns').notNullable();
      table.string('challenge_id').notNullable();
      table.unique(['player_id', 'campaign_id', 'challenge_id']);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('completions')
  ]);
};

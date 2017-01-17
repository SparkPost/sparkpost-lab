
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('participants', function(table) {
      table.increments('id').primary();
      table.integer('account_id');
      table.integer('campaign_id').references('id').inTable('campaigns').notNullable();
      table.unique(['account_id', 'campaign_id']);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('participants')
  ]);
};

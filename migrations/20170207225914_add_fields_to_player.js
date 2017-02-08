
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('players', function(table) {
      table.string('mailing_address');
      table.string('twitter');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('players', function(table) {
      table.dropColumn('mailing_address');
      table.dropColumn('twitter');
    })
  ]);
};

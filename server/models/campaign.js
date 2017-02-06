'use strict';
const Model = require('../utils/model');
const knex = require('../utils/knex');

function Campaign() {
  Model.apply(this, arguments);
}

Model.extend(Campaign);
Campaign.tableName = 'campaigns';

Campaign.findWhereActive = function() {
  return this.query().whereNotNull('starts_at')
    .where('starts_at', '<', knex.fn.now())
    .where(function() {
      this.whereNull('ends_at').orWhere('ends_at', '>', knex.fn.now());
    });
}

Campaign.findByLocalpart = function (localpart) {
  return this.findWhereActive().where({ localpart }).first();
};

module.exports = Campaign;
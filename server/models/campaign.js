'use strict';
const Model = require('../utils/model');

function Campaign() {
  Model.apply(this, arguments);
}

Model.extend(Campaign);
Campaign.tableName = 'campaigns';

Campaign.findByLocalpart = function (localpart) {
  return this.query().where({ localpart }).first();
};

module.exports = Campaign;
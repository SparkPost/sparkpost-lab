'use strict';
const Model = require('../utils/model');
const _ = require('lodash');

function Admin() {
  Model.apply(this, arguments);
}

Model.extend(Admin);
Admin.tableName = 'admins';

Admin.findById = function (id) {
  return this.query().where({ id }).first();
};

Admin.findByGoogleId = function (google_id) {
  return this.query().where({ google_id }).first();
};

module.exports = Admin;
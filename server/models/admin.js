'use strict';
const Model = require('../utils/model');
const _ = require('lodash');

function Admin() {
  Model.apply(this, arguments);
}

Model.extend(Admin);
Admin.tableName = 'admins';

module.exports = Admin;
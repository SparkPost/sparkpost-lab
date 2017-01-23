const knex = require('../utils/knex');
const Model = require('objection').Model;

Model.knex(knex);

module.exports = Model;
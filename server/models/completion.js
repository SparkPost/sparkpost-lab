'use strict';
const Model = require('../utils/model');

function Completion() {
  Model.apply(this, arguments);
}

Model.extend(Completion);
Completion.tableName = 'completions';

module.exports = Completion;
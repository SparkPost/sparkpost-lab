'use strict';
const Model = require('../utils/model');
const _ = require('lodash');

function Player() {
  Model.apply(this, arguments);
}

Model.extend(Player);
Player.tableName = 'players';

Player.relationMappings = {
  completions: {
    relation: Model.HasManyRelation,
    modelClass: `${__dirname}/completion`,
    join: {
      from: 'players.id',
      to: 'completions.player_id'
    }
  }
};

Player.find = function() {
  return this.query().eager('completions');
};

Player.findByAccountId = function (account_id) {
  return this.find().where({ account_id }).first();
};


Player.prototype.didChallenge = function(campaign, challengeId) {
  return _.filter(this.completions, (completion) => {
    return completion.campaign_id === capmaign.id && completion.challenge_id === challengeId;
  }).length > 0;
}

module.exports = Player;
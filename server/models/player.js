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
  },
  campaigns: {
    relation: Model.ManyToManyRelation,
    modelClass: `${__dirname}/campaign`,
    join: {
      from: 'players.id',
      through: {
        from: 'completions.player_id',
        to: 'completions.campaign_id'
      },
      to: 'campaigns.id'
    }
  }
};

Player.find = function() {
  return this.query()
             .eager('[completions, campaigns]')
             .modifyEager('campaigns', (builder) => {
                builder.distinct('campaigns.id');
              });
};

Player.findById = function (id) {
  return this.find().where({ id }).first();
};

Player.findByAccountId = function (account_id) {
  return this.find().where({ account_id }).first();
};

Player.findByEmail = function (email) {
  return this.find().where({ email }).first();
};


Player.prototype.didChallenge = function(campaign, challengeId) {
  return _.filter(this.completions, (completion) => {
    return completion.campaign_id === campaign.id && completion.challenge_id === challengeId;
  }).length > 0;
}

Player.prototype.completeChallenge = function(campaign, challengeId) {
  return this.$relatedQuery('completions').insert({ challenge_id: challengeId, campaign_id: campaign.id });
};

module.exports = Player;
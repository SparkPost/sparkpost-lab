const Fuse = require('fuse-email');
const _ = require('lodash');
const Player = require('./models/player');
const Campaign = require('./models/campaign');
const htmlToText = require('html-to-text');

const fuse = Fuse({
  email_key: process.env.SPARKPOST_API_KEY,
  domain: 'lab.sparkpost.com',
  name: 'SparkPost Lab',
  sending_address: 'robot@lab.sparkpost.com',
  inbound_address: 'robot@lab.sparkpost.com',
  restrict_inbound: false,
  endpoint: '/incoming'
});

fuse.hears({ subject: ['Challenge 1'] }, 'direct_email', function(responder, inboundMessage) {
  let accountId = getAccountId(inboundMessage);

  let accountDetails = parseForAccountDetails(inboundMessage);

  getOrCreatePlayer(accountId, accountDetails)
    .then((player) => {
      console.log(player);
      getCampaign(inboundMessage)
        .then((campaign) => {
          if (campaign) {
            doChallenge('CHALLENGE_ONE', player, campaign, responder, inboundMessage);
          }
          else {
            console.log('unknown campaign');
          }
        });
    });
});


function getAccountId(inboundMessage) {
  // get it from the list id
  if (_.has(inboundMessage, ['headers', 'list-id'])) {
    let match = inboundMessage.headers['list-id'].match(/^<spc-([0-9]+)-[0-9]>$/i);
    
    if (match && match.length > 1) {
      return match[1];
    }
  }

  // get it from the return path
  if (_.has(inboundMessage, ['headers', 'return-path'])) {
    let match = inboundMessage.headers['return-path'].match(/^<\S*-([0-9]+)@.\S*\.com>$/i);
    
    if (match && match.length > 1) {
      return match[1];
    }
  }

  return null;
}

function parseForAccountDetails(inboundMessage) {
  const keys = ['email', 'first name', 'last name'];

  let details = {};

  let lines = htmlToText.fromString(inboundMessage.html, _.assign({}, fuse.config.htmlToTextOpts, {
    ignoreImage: true,
    ignoreHref: true,
    preserveNewlines: true,
  })).trim().split('\n');



  _.each(keys, (key) => {
    let pattern = new RegExp(key + ':(.*)', 'i')
    let match = null;

    _.each(lines, (line, index) => {
      match = line.match(pattern);

      if (match) {
        return false;

        line.splice(index, 1);
      }
    });

    if (match) {
      details[_.snakeCase(key)] = _.trim(_.last(match));
    }
  });

  return details;
}

function getOrCreatePlayer(accountId, data) {
  return Player.findByAccountId(accountId)
    .then((player) => {

      if (!player) {
        return Player.query().insert(_.assign({}, data, {
          account_id: accountId
        }))
        .then((player) => {
          return Player.findByAccountId(accountId);
        });
      }

      return player;
    });
}

function getCampaign(inboundMessage) {
  let localpart = inboundMessage.to.email.split('@')[0].toLowerCase();

  return Campaign.findByLocalpart(localpart);
}

function preload(inboundMessage) {
  let accountId = getAccountId(inboundMessage);

 return Player.findByAccountId(accountId)
    .then((player) => {
      return getCampaign(inboundMessage)
        .then((campaign) => {
          return { player, campaign };
        });
    });
}

function doChallenge(challengeId, player, campaign, responder, inboundMessage) {
  if (player.didChallenge(campaign, challengeId)) {
    console.log('I already did that challenge');
  }
  else {
    console.log('Ooh a new challenge');
  }
}

module.exports = fuse;
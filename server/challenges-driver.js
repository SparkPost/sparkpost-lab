const Fuse = require('fuse-email');
const router = require('express').Router();
const _ = require('lodash');
const Player = require('./models/player');
const Campaign = require('./models/campaign');
const htmlToText = require('html-to-text');
const challengeConfig = require('./challenges');
const DO_FIRST = 'SEND_WITH_SANDBOX';

const fuse = Fuse({
  email_key: process.env.SPARKPOST_API_KEY,
  domain: 'lab.sparkpost.com',
  name: 'SparkPost Lab',
  sending_address: 'sparkpost_lab@lab.sparkpost.com',
  inbound_address: 'sparkpost_lab@lab.sparkpost.com',
  restrict_inbound: false,
  endpoint: '/incoming',
});

fuse.hears({ subject: ['Challenge 1'] }, 'direct_email', function(responder, inboundMessage) {
  let accountId = getAccountId(inboundMessage);
  let accountDetails = parseForAccountDetails(inboundMessage);
  let challengeId = 'SEND_WITH_SANDBOX';

  getOrCreatePlayer(accountId, accountDetails)
    .then((player) => {
      if (!player) { return; } // log something

      getCampaign(inboundMessage)
        .then((campaign) => {
          if (campaign) {
            doChallenge({ challengeId, player, campaign, responder, inboundMessage });
          }
          else {
            handleUnknownCampaign();
          }
        });

    });
});

fuse.hears({ subject: ['Challenge 2'] }, 'direct_email', function(responder, inboundMessage) {
  let accountId = getAccountId(inboundMessage);
  let challengeId = 'SEND_WITH_CUSTOM';

  Player.findByAccountId(accountId)
    .then((player) => {
      if (!player) { return; } // log something

      getCampaign(inboundMessage)
        .then((campaign) => {
          if (campaign) {
            doChallenge({ challengeId, player, campaign, responder, inboundMessage });
          }
          else {
            handleUnknownCampaign();
          }
        });
    });
});

router.post('/relay/:localpart/:playerId', function(req, res) {
  let { localpart, playerId } = req.params;
  let responder = fuse.responder();
  let challengeId = 'RECEIVE_MAIL';

  Player.findById(playerId)
    .then((player) => {
      if (!player) { return; } // log something

      getCampaign({ localpart })
        .then((campaign) => {
          if (campaign) {
            doChallenge({ challengeId, player, responder, campaign, req, res });
          }
          else {
            handleUnknownCampaign();
          }
        });
    });
});

router.post('/webhook/:localpart/:playerId', function(req, res) {
  let { localpart, playerId } = req.params;
  let responder = fuse.responder();
  let challengeId = 'CREATE_WEBHOOK';

  Player.findById(playerId)
    .then((player) => {
      if (!player) { return; } // log something

      getCampaign({ localpart })
        .then((campaign) => {
          if (campaign) {
            doChallenge({ challengeId, player, responder, campaign, req, res });
          }
          else {
            handleUnknownCampaign();
          }
        });
    });
});



function addLabResponders({ responder, player, campaign, challengeId }) {
  let challenge = challengeConfig[challengeId];

  let outboundMessageDefaults = {
    options: {
      transactional: true,
    },
    recipients: [
      { name: `${player.first_name} ${player.last_name}`, email: player.email }
    ],
    from: {
      email: `${campaign.localpart}@lab.sparkpost.com`
    },
    reply_to: {
      email: 'feedback@lab.sparkpost.com'
    },
    substitution_data: { player, campaign, challenge }
  };

  responder.completedChallenge = function(data) {
    data = data || {};

    data.subject = data.subject || `Awesome! You finished "{{challenge.name}}"`;
    data.body = data.body || 'Well done! You\'re doing great';

    responder.send(_.defaults(data, outboundMessageDefaults));
  };

  responder.failedChallenge = function(data) {
    data = data || {};

    data.subject = data.subject || `Woops a bit of a mistake somewhere for "${challenge.name}"`;
    data.body = data.body || 'Try again. Here are the instructions again...';


    responder.send(_.defaults(data, outboundMessageDefaults));
  };
}

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

function getCampaign({ to, localpart }) {
  localpart = localpart || to.email.split('@')[0].toLowerCase();

  return Campaign.findByLocalpart(localpart);
}

function doChallenge({ player, campaign, challengeId, responder, res }) {
  addLabResponders({ player, campaign, challengeId, responder });

  if (!player.didChallenge(campaign, DO_FIRST) && challengeId !== DO_FIRST) {
    handleSkippedFirstChallenge(responder, challengeConfig[DO_FIRST]);
    return;
  }

  if (player.didChallenge(campaign, challengeId)) {
    if (!_.isUndefined(res)) {
      res.sendStatus(400);
    }
    else {
      responder.failedChallenge({
        subject: 'Woops! Been there, done that.',
        body: 'Hey {{ player.name }},<br>Looks like you already did that challenge for the {{ campaign.name }} campaign.'
      });
    }
    return;
  }
  

  require(`${__dirname}/challenges/${challengeId.toLowerCase()}`)(arguments[0]);
}

function handleUnknownCampaign() {
  console.log('unkown campaign');
}

function handleSkippedFirstChallenge(responder, challenge) {
  return responder.failedChallenge({
    subject: 'First comes first',
    body: `Hey {{ player.first_name }},<br>Looks like you haven\'t done ${challenge.name}. You must do that challenge before the others. After that, go crazy.`
  });
}

module.exports = { fuse, router };
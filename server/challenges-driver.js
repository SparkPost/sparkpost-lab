const Fuse = require('fuse-email');
const router = require('express').Router();
const _ = require('lodash');
const Player = require('./models/player');
const Campaign = require('./models/campaign');
const htmlToText = require('html-to-text');
const challengeConfig = require('./challenges');
const DO_FIRST = 'SEND_WITH_SANDBOX';
const config = require('./config');
const sparkpostLabTemplate = `${__dirname}/challenges/response.html`;
const fs = require('fs');

const fuse = Fuse({
  email_key: process.env.SPARKPOST_API_KEY,
  domain: 'lab.sparkpost.com',
  name: 'SparkPost Lab',
  sending_address: `sparkpost_lab@${config.email_domain}`,
  inbound_address: `sparkpost_lab@${config.email_domain}`,
  restrict_inbound: false,
  endpoint: '/incoming'
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
  let nextChallenge = challenge.up_next ? challengeConfig[challenge.up_next] : null;

  let outboundMessageDefaults = {
    options: {
      transactional: true,
      inline_css: true
    },
    recipients: [
      { name: `${player.first_name} ${player.last_name}`, email: player.email }
    ],
    from: {
      email: `${campaign.localpart}@${config.email_domain}`
    },
    reply_to: {
      email: `feedback@${config.email_domain}`
    },
    substitution_data: { player, campaign, challenge },
  }; 

  responder.sendTemplate = function(data) {
    data = data || {};

    _.defaults(outboundMessageDefaults.substitution_data, data.substitution_data || {});
    delete data.substitution_data;

    fs.readFile(sparkpostLabTemplate, function (err, template) {
      if (!err) {
        template = template.toString();
        template = template.replace(/{{\s+body\s+}}/, data.body || '');
        data.body = template;
       }

       responder.send(_.defaults(data, outboundMessageDefaults));
    });
  };

  responder.completedChallenge = function(data) {
    data = data || {};

    if (nextChallenge) {
      data.substitution_data = _.defaults({
        nextLinks: _.map(nextChallenge.links, (url, label) => {
          return { url, label };
        }) || []
      }, data.substitution_data);
    }

    data.subject = data.subject || `Awesome! You finished "{{ challenge.name }}"`;
    data.body = data.body || `<h1 class="text--center">Great job!</h1>
      <img src="http://www.bhmpics.com/walls/success_kid-other.jpg" alt="Success Kid" width="300" style="margin: 20px auto; display: block;"/>
      {{ if message }}
        {{ message }}
      {{ end }}
      <hr />
      ${nextChallenge ? `<h2>For your next challenge...${nextChallenge.name}</h2>
                         ${nextChallenge.instructions({ player, campaign })}
                         <hr />
                         {{ each nextLinks }}
                         <a href="{{{ loop_var.label }}}">{{ loop_var.label }}</a>&nbsp;&nbsp;&nbsp;
                         {{ end }}
                         <br />` : ''}
      <div class="text--center"><a href="http://lab.sparkpost.com/campaign/${campaign.id}/player/${player.id}" class="button">Your Dashboard</a></div>`;

    responder.sendTemplate(data);
  };

  responder.failedChallenge = function(data) {
    data = data || {};

    data.substitution_data = _.defaults({
      links: _.map(challenge.links, (url, label) => {
        return { url, label };
      })
    }, data.substitution_data);

    data.subject = data.subject || `Woops a bit of a mistake somewhere for "{{ challenge.name }}"`;
    data.body = data.body || `<h2>Hey {{ player.first_name }},</h2>
    Looks like there was a bit of a mistake somewhere for "{{ challenge.name }}".
    Give it another try! <h2>Instructions</h2>${challenge.instructions({ player, campaign })}
    <hr />
    {{ each links }}
    <a href="{{{ loop_var.label }}}">{{ loop_var.label }}</a>&nbsp;&nbsp;&nbsp;
    {{ end }}`;

    responder.sendTemplate(data);
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
      responder.sendTemplate({
        subject: 'Woops! Been there, done that.',
        body: '<h2>Hey {{ player.first_name }},</h2>Looks like you already did "{{ challenge.name }}" for {{ campaign.name }}.'
      });
    }
    return;
  }
  

  require(`${__dirname}/challenges/${challengeId.toLowerCase()}`)(arguments[0]);
}

function handleUnknownCampaign() {
  console.log('unkown campaign');
}

function handleSkippedFirstChallenge(responder, firstChallenge) {
  return responder.sendTemplate({
    subject: 'First comes first',
    body: `<h2>Hey {{ player.first_name }},</h2>Looks like you haven\'t done ${firstChallenge.name}. You must do that challenge before the others.`
  });
}

module.exports = { fuse, router };
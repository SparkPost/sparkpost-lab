const Player = require('../models/player');

module.exports = function({ challengeId, player, campaign, responder, inboundMessage, accountDetails }) {
  if (inboundMessage.from.email.indexOf('sparkpostbox.com') === -1) {
    if (accountDetails.mailing_address && accountDetails.twitter) {
      Player.query().where({ id: player.id }).update(accountDetails)
        .then(() => {
          player.completeChallenge(campaign, challengeId)
            .then(() => {
              responder.completedChallenge();
            });
        });
    }
    else {
      responder.failedChallenge();
    }
  }
  else {
    responder.failedChallenge();
  }
};
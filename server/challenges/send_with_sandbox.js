module.exports = function({ challengeId, player, campaign, responder, inboundMessage }) {
  if (inboundMessage.from.email.indexOf('sparkpostbox.com') >= 0) {
    player.completeChallenge(campaign, challengeId)
      .then(() => {
        responder.completedChallenge();
      });
  }
  else {
    responder.failedChallenge();
  }
};
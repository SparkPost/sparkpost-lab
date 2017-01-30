const _ = require('lodash');
const requestbin = require('../utils/requestbin');

module.exports = function({ challengeId, player, campaign, responder, req, res }) {
  let data = req.body;

  if (_.has(data, '0.msys') && !_.isUndefined(req.header('X-Messagesystems-Batch-Id')) && req.header('User-Agent').toLowerCase() === 'sparkpost') {
    player.completeChallenge(campaign, challengeId)
      .then(() => {
        requestbin({ data })
          .then((url) => {
            responder.completedChallenge({
              body: `View the results at ${url}`
            });

            res.sendStatus(200);
          });
      });
  }
  else {
    responder.failedChallenge();
  }
};
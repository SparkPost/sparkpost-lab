const _ = require('lodash');
const requestbin = require('../utils/requestbin');

module.exports = function({ challengeId, player, campaign, responder, req, res }) {
  let data = req.body;

  // make sure we are getting the message from the right account
  if (_.has(data, '0.msys.relay_message') && player.account_id === parseInt(_.get(data, '0.msys.relay_message.customer_id'))) {
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
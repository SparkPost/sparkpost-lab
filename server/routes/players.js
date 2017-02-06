'use strict';

const router = require('express').Router();
const Player = require('../models/player');
const Completion = require('../models/completion');
const _ = require('lodash');

// player find
router.get('/', (req, res) => {
  let { search } = req.query;

  if (_.isUndefined(search)) {
    return res.sendError({
      message: 'No search query given'
    });
  }

  if (!isNaN(search)) {
    Player.findByAccountId(search)
      .then((player) => {
        return res.sendResults(player);
      })
      .catch((err) => {
        return res.sendError(err);
      });
  }
  // assume its an email
  else {
    Player.findByEmail(search)
      .then((player) => {
        return res.sendResults(player);
      })
      .catch((err) => {
        return res.sendError(err);
      });
  }
});

// player overview
router.get('/:player_id', (req, res) => {
  let { player_id } = req.params;

  Player.findById(player_id)
    .then((player) => {
      return res.sendResults(player);
    })
    .catch((err) => {
      return res.sendError(err);
    });
});

// player completions for a campaign
router.get('/:player_id/completions/:campaign_id', (req, res) => {
  let { player_id, campaign_id } = req.params;

  Completion.query()
    .where({ player_id, campaign_id })
    .then((completions) => {
      return res.sendResults(completions);
    })
    .catch((err) => {
      return res.sendError(err);
    });
});

module.exports = router;

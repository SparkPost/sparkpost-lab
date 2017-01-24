'use strict';

const router = require('express').Router();
const Player = require('../models/player');

router.get('/:id', (req, res) => {
  Player
    .query()
    .where('id', req.params.id)
    .first()
    .then((player) => {
      return res.json({
        results: player
      });
    })
    .catch((err) => {
      console.log('oh noes', err);
    });
});

module.exports = router;

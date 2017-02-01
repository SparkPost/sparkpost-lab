'use strict';

const router = require('express').Router();
const knex = require('../utils/knex');
const Campaign = require('../models/campaign');
const { isLoggedIn } = require('../utils/middleware');

router.get('/', (req, res) => {
  Campaign
    .query()
    .then((campaigns) => {
      return res.sendResults(campaigns);
    })
    .catch((err) => {
      return res.sendError(err);
    });
});

router.get('/:id', (req, res) => {
  Campaign
    .query()
    .where('id', req.params.id)
    .first()
    .then((campaign) => {
      return res.sendResults(campaign);
    })
    .catch((err) => {
      return res.sendError(err);
    });
});

// Admin endpoints
router.post('/', isLoggedIn, function(req, res) {
  let { name, localpart, starts_at, ends_at } = req.params;

  Campaign
    .query()
    .insert({ name, localpart, starts_at, ends_at })
    .then((campaign) => {
      return res.sendResults(campaign);
    })
    .catch((err) => {
      return res.sendError(err);
    });
});

// Admin endpoints
router.put('/:id/start', isLoggedIn, function(req, res) {
  let { id } = req.params;

  Campaign
    .query()
    .updateAndFetchById(id, { start: knex.fn.now() })
    .then((campaign) => {
      return res.sendResults(campaign);
    })
    .catch((err) => {
      return res.sendError(err);
    });
});

// Admin endpoints
router.put('/:id/end', isLoggedIn, function(req, res) {
  let { id } = req.params;

  Campaign
    .query()
    .updateAndFetchById(id, { ends_at: knex.fn.now() })
    .then((campaign) => {
      return res.sendResults(campaign);
    })
    .catch((err) => {
      return res.sendError(err);
    });
});

module.exports = router;

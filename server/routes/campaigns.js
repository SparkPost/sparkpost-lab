'use strict';

const router = require('express').Router();
const knex = require('../utils/knex');
const Campaign = require('../models/campaign');
const { isLoggedIn } = require('../utils/middleware');


router.get('/', (req, res) => {
  Campaign
    .findWhereActive()
    .then((campaigns) => {
      return res.sendResults(campaigns);
    })
    .catch((err) => {
      return res.sendError(err);
    });
});

// admin get route
router.get('/all', isLoggedIn, (req, res) => {
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
    .findWhereActive()
    .where('id', req.params.id)
    .first()
    .then((campaign) => {
      return res.sendResults(campaign);
    })
    .catch((err) => {
      return res.sendError(err);
    });
});

// Admin create endpoints
router.post('/', isLoggedIn, function(req, res) {
  let { name, localpart } = req.body;

  console.log({ name, localpart });

  Campaign
    .query()
    .insert({ name, localpart })
    .then((campaign) => {
      return res.sendResults(campaign);
    })
    .catch((err) => {
      return res.sendError(err);
    });
});

router.put('/:id/start', isLoggedIn, function(req, res) {
  let { id } = req.params;

  Campaign
    .query()
    .updateAndFetchById(id, { starts_at: knex.fn.now() })
    .then((campaign) => {
      return res.sendResults(campaign);
    })
    .catch((err) => {
      return res.sendError(err);
    });
});

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

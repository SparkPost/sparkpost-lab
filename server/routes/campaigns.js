'use strict';

const router = require('express').Router();
const Campaign = require('../models/campaign');

router.get('/', (req, res) => {
  Campaign
    .query()
    .then((campaigns) => {
      return res.json({
        results: campaigns
      });
    })
    .catch((err) => {
      console.log('oh noes', err);
    });
});

router.get('/:id', (req, res) => {
  Campaign
    .query()
    .where('id', req.params.id)
    .first()
    .then((campaign) => {
      return res.json({
        results: campaign
      });
    })
    .catch((err) => {
      console.log('oh noes', err);
    });
});

module.exports = router;

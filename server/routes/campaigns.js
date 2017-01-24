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

router.post('/', (req, res) => {
  Campaign
    .query()
    .insert(req.body)
    .then((campaign) => {
      return res.json({
        results: campaign
      });
    })
    .catch((err) => {
      console.log('oh noes', err);
    });
});

router.put('/:id', (req, res) => {
  Campaign
    .query()
    .patchAndFetchById(req.params.id, req.body)
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

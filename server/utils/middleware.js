'use strict';

const _ = require('lodash');

function responseHelpers(req, res, next) {
  res.sendError = function(error) {
    if (_.isError(error)) {
      error = {
        code: error.code,
        message: error.message
      };
    }

    this.json({ error });
  }

  res.sendResults = function(results) {
    this.json({ results });
  }

  next();
}


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.sendError({
    message: 'Admin not logged in'
  });
}

module.exports = { responseHelpers, isLoggedIn };
'use strict';

const passport = require('passport');
const emailDomain = process.env.AUTH_EMAIL_DOMAIN;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const Admin = require('../models/admin');
const _ = require('lodash');
const config = require('../config');

passport.serializeUser(function(admin, done) {
  done(null, admin.id);
});

passport.deserializeUser(function(id, done) {
  Admin.findById(id)
    .then((admin) => {
      if (admin) {
        done(null, admin);
      }
      else {
        done(new Error('Failed to find admin on deserializion'));
      }
    });
});

passport.use(new GoogleStrategy({
    clientID        : process.env.GOOGLE_CLIENT_ID,
    clientSecret    : process.env.GOOGLE_CLIENT_SECRET,
    callbackURL     : `${config.api_base}/auth/callback`,
}, function(token, refreshToken, profile, done) {
  let email = _.get(profile, 'emails.0.value') || '';
  
  if (_.last(email.split('@')) !== emailDomain && emailDomain !== '*') {
    return done(new Error(`Email must be at ${emailDomain}`));
  }

  Admin.findByGoogleId(profile.id)
    .then((admin) => {
      if (admin) {
        done(null, admin);
      }
      else {
        return Admin.query()
          .insert({
            google_id: profile.id,
            email: email,
            first_name: _.get(profile, 'name.givenName'),
            last_name: _.get(profile, 'name.familyName')
          })
          .then(function (admin) {
            done(null, admin);
          })
          .catch(function (err) {
            done(err);
          });
      }
    });
}));

module.exports = passport;
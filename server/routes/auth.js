'use strict';

const router = require('express').Router();
const passport = require('../utils/passport');

router.get('/', passport.authenticate('google', { scope : ['profile', 'email'], access_type: 'online', hd: process.env.AUTH_EMAIL_DOMAIN }));

router.get('/callback', passport.authenticate('google', { successRedirect: '/admin', failureRedirect: '/'}));

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


module.exports = router;
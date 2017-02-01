'use strict';

process.env.EMAIL_DOMAIN = process.env.EMAIL_DOMAIN || '*';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const challengesDriver = require('./challenges-driver');
const campaignRouter = require('./routes/campaigns');
const playerRouter = require('./routes/players');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('./utils/passport');
const { responseHelpers } = require('./utils/middleware');

app.set('port', process.env.PORT || 3001);
// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'mysupersecretcode',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(responseHelpers);
app.use('/api/campaigns', campaignRouter);
app.use('/api/players', playerRouter);

challengesDriver.fuse.setupEndpoint(app);
app.use(challengesDriver.router);

// Authentication
app.get('/auth', passport.authenticate('google', { scope : ['profile', 'email'], access_type: 'online', hd: process.env.EMAIL_DOMAIN }));
app.get('/auth/callback', passport.authenticate('google', { successRedirect : '/', failureRedirect : '/' }));

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});

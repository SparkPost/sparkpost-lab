'use strict';

process.env.AUTH_EMAIL_DOMAIN = process.env.AUTH_EMAIL_DOMAIN || '*';

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const app = express();
const challengesDriver = require('./challenges-driver');
const authRouter = require('./routes/auth');
const campaignRouter = require('./routes/campaigns');
const playerRouter = require('./routes/players');
const passport = require('./utils/passport');
const { responseHelpers } = require('./utils/middleware');
const config = require('./config');
const knex = require('./utils/knex');

if (process.env.NODE_ENV === 'production') {
  knex.migrate.latest();
}

app.set('port', process.env.PORT || 3001);

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'mysupersecretcode',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
  next();
});

app.use(responseHelpers);

/**
 * Setup API and authentication
 */
app.use('/api/campaigns', campaignRouter);
app.use('/api/players', playerRouter);
app.use('/auth', authRouter)

/**
 * Setup the challenges
 */
challengesDriver.fuse.setupEndpoint(app);
app.use(challengesDriver.router);

/**
 * Return the UI for any unsatisfied request
 */
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});

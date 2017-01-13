'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Fuse = require('fuse-email');

const fuse = Fuse({
  email_key: process.env.SPARKPOST_API_KEY,
  domain: 'lab.sparkpost.com',
  name: 'SparkPost Lab',
  sending_address: 'robot@lab.sparkpost.com',
  inbound_address: 'robot@lab.sparkpost.com',
  endpoint: '/incoming'
});

const app = express();

app.set('port', process.env.PORT || 3001);

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

app.use(bodyParser.json());

fuse.setupEndpoint(app);

fuse.on('email_received', function(responder, inboundMessage) {
  responder.send({
    subject: 'Thank you for your interest in SparkPost Lab',
    body: 'Check back later for some super exciting fun!'
  });
});

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});

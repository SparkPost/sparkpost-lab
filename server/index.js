'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const fuse = require('./fuse');

app.set('port', process.env.PORT || 3001);

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.use(bodyParser.json());

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

fuse.setupEndpoint(app);

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});
const Fuse = require('fuse-email');

const fuse = Fuse({
  email_key: process.env.SPARKPOST_API_KEY,
  domain: 'lab.sparkpost.com',
  name: 'SparkPost Lab',
  sending_address: 'robot@lab.sparkpost.com',
  inbound_address: 'robot@lab.sparkpost.com',
  endpoint: '/incoming'
});

fuse.on('email_received', function(responder, inboundMessage) {
  responder.send({
    subject: 'Thank you for your interest in SparkPost Lab',
    body: 'Check back later for some super exciting fun!'
  });
});

module.exports = fuse;
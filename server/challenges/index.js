// must be es5 because it is required in uglify
const config = require('../config');

const challenges = {
  SEND_WITH_SANDBOX: {
    name: 'Send with sparkpostbox.com',
    up_next: 'SEND_WITH_CUSTOM',
    instructions: function(data) {
      var campaign = data.campaign;
      return 'Send an email to '+campaign.localpart+'@'+config.email_domain+' using the sparkpostbox.com sandbox domain. ' +
        'Be sure to do the following: <ul>' +
        '<li>Set the Subject to "Challenge 1"</li>' +
        '<li>In the body of the email, copy/paste and fill in the following: <br />' +
        'First Name: <br />Last Name: <br />Email: </li>' +
        '</ul>' +
        '<em>Note: you must complete this before any other campaigns.</em><br />' +
        '<strong>Prize:</strong> A SparkPost Lab "I Emailed" Sticker';
    },
    links: {
      "Sign Up for SparkPost": "https://app.sparkpost.com/sign-up?"+config.tracking_code,
      "Sending Your First Email": "https://support.sparkpost.com/customer/portal/articles/2035409-sending-your-first-email"
    },
  },
  SEND_WITH_CUSTOM: {
    name: 'Send with your own sending domain',
    up_next: 'CREATE_WEBHOOK',
    instructions: function(data) {
      var campaign = data.campaign;
      return 'Send an email to '+campaign.localpart+'@'+config.email_domain+' using your own sending domain. ' +
        'Be sure to do the following: <ul>' +
        '<li>Create and verify a Sending Domain in your account.</li>' +
        '<li>Set the Subject to "Challenge 2"</li>' +
        '<li>In the body of the email, copy/paste and fill in the following: <br />' +
        'Mailing Address: <br />Twitter: </li>' +
        '</ul>' +
        '<strong>Prize:</strong> A SparkPost Tool Pen';
    },
    links: {
      "Create Sending Domains": "https://support.sparkpost.com/customer/portal/articles/1933318-creating-sending-domains",
      "Verify Sending Domains": "https://support.sparkpost.com/customer/portal/articles/1933360-verify-sending-domains"
    }
  },
  CREATE_WEBHOOK: {
    name: 'Create a webhook',
    instructions: function(data) {
      var campaign = data.campaign, player = data.player;

      return 'Create a Webhook. <ul>' +
        '<li>Create a Webhook in your account.</li>' +
        '<li>' +
        (player ? ('Set the Target URL to http://lab.sparkpost.com/webhook/' + campaign.localpart + '/'  + player.id + '.') : 'Enter your email or SparkPost ID above to see your custom endpoint.') +
        '</li>' +
        '</ul>' +
        '<strong>Prize:</strong> A SparkPost Beanie';
    },
    links: {
      "Defining Webhooks": "https://support.sparkpost.com/customer/portal/articles/1929974?_ga=1.216332630.1390593345.1485868716",
      "Webhook Event Reference": "https://support.sparkpost.com/customer/portal/articles/1976204?_ga=1.216332630.1390593345.1485868716",
      "What are Webhooks?": "https://en.wikipedia.org/wiki/Webhook"
    }
  },
    // RECEIVE_MAIL: {
  //   name: 'Start receiving mails',
  //   instructions: function(data) {
  //     return 'To receive mails you need to';
  //   }
  // },
};

module.exports = challenges;

// must be es5 because it is required in uglify
const config = require('../config');

const challenges = {
  SEND_WITH_SANDBOX: {
    name: 'Send with sparkpostbox.com',
    up_next: 'SEND_WITH_CUSTOM',
    instructions: function(data) {
      var campaign = data.campaign;
      return 'Send an email to '+campaign.localpart+'@'+config.email_domain+' using the sparkpostbox.com sandbox domain. Note: you must complete this before any other campaigns.';
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
      return 'Send an email to '+campaign.localpart+'@'+config.email_domain+' using your own sending domain.';
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

      if (player) {
        return '';
      }
      else {

      }
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
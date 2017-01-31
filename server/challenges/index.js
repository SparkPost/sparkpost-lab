module.exports = {
  SEND_WITH_SANDBOX: {
    name: 'Send with sparkpostbox.com',
    instructions: function(campaign) {
      return `Send an email to ${campaign.localpart}@lab.sparkpost.com using the sparkpostbox.com sandbox domain. Note: you must complete this before any other campaigns.`;
    }
  },
  SEND_WITH_CUSTOM: {
    name: 'Send with your own sending domain',
    instructions: function(campaign) {
      return `Send an email to ${campaign.localpart}@lab.sparkpost.com using your own sending domain.`;
    }
  },
  RECEIVE_MAIL: {
    name: 'Receive mail',
    instructions: function(campaign) {
      return '';
    }
  },
  CREATE_WEBHOOK: {
    name: 'create webhook',
    instructions: function(campaign) {
      return '';
    }
  },
}
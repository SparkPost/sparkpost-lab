let config = {
  'email_domain': 'challenge.sparkpost.com',
  'api_base': process.env.NODE_ENV !== 'production' ? 'http://localhost:3000' : 'http://lab.sparkpost.com', 
  'tracking_code': 'src=Dev-Website&sfdcid=701600000011daf'
};

module.exports = config;
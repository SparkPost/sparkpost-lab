let config = {
  'email_domain': 'challenge.sparkpost.com',
  'api_base': process.env.NODE_ENV !== 'production' ? 'http://localhost:3000' : 'http://lab.sparkpost.com', 
  'tracking_code': 'src=DevEvent&sfdcid=70160000000pq7Z'
};

module.exports = config;
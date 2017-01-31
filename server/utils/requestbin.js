const axios = require('axios');
const base = 'http://requestb.in/api/v1';

module.exports = function(data) {
  var url;

  return axios.post(`${base}/bins`)
    .then((bin) => {
      url = `http://requestb.in/${bin.data.name}`;

      data.method = data.method || 'post';
      data.url = url;

      return axios(data);
    })
    .then(() => {
      return `${url}?inspect`;
    });
};
const util = require('util');
const fetch = require('node-fetch');

const prettyPrintResponse = response => {
  console.log(util.inspect(response.data, { colors: true, depth: 4 }));
};

const groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    // eslint-disable-next-line no-param-reassign
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

const getPublicUrlForBackend = async function() {
  // Port 4040 matches the port specified in docker-compose.yml
  const response = await fetch('http://ngrok:4040/api/tunnels');
  const { tunnels } = await response.json();

  console.log(tunnels);

  const httpTunnel = tunnels.find(t => t.proto === 'https');
  return httpTunnel.public_url;
};

module.exports = {
  prettyPrintResponse,
  getPublicUrlForBackend,
  groupBy,
};

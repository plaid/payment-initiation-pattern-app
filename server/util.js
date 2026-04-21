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
  let response;
  try {
    response = await fetch('http://localhost:4040/api/tunnels');
  } catch (e) {
    throw new Error(
      'ngrok is not running. Webhooks are required for payment initiation. ' +
      'Start ngrok in a separate terminal with: ngrok http 5001'
    );
  }

  const { tunnels } = await response.json();
  const httpTunnel = tunnels.find(t => t.proto === 'https');
  if (!httpTunnel) {
    throw new Error(
      'No ngrok HTTPS tunnel found. Make sure ngrok is tunneling to port 5001: ngrok http 5001'
    );
  }
  return httpTunnel.public_url;
};

module.exports = {
  prettyPrintResponse,
  getPublicUrlForBackend,
  groupBy,
};

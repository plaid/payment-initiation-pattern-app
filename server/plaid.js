/**
 * @file Defines the connection to the Plaid client.
 */

const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const axios = require('axios');

// Your Plaid API keys and secrets are loaded as environment variables.
// They are set in your `.env` file. See the repo README for more info.
const {
  PLAID_CLIENT_ID,
  PLAID_ENV,
  PLAID_SECRET_PRODUCTION,
  PLAID_SECRET_SANDBOX,
} = process.env;

// The Plaid secret is unique per environment.
const PLAID_SECRET =
  PLAID_ENV === 'production' ? PLAID_SECRET_PRODUCTION : PLAID_SECRET_SANDBOX;

// We want to log requests to / responses from the Plaid API (via the Plaid client), as this data
// can be useful for troubleshooting.
const axiosInstance = axios.create();

const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
      'Plaid-Version': '2020-09-14',
    },
  },
});

const client = new PlaidApi(
  configuration,
  configuration.basePath,
  axiosInstance
);

module.exports = {
  plaid: client,
  axiosInstance,
};

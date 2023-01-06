/**
 * @file Exports the queries for interacting with the database.
 */

const { createAccount, retrieveAccountsByUserId } = require('./accounts');

const {
  createUser,
  retrieveUserById,
  retrieveUserByUsername,
} = require('./users');
const {
  retrieveOrdersByAccountIds,
  createOrder,
  markOrderExecutedByPaymentId,
} = require('./orders');
const {
  createPaymentStatusUpdate,
  retrievePaymentStatusUpdatesByPaymentIds,
} = require('./payment_status_updates');

module.exports = {
  // users
  createUser,
  retrieveUserById,
  retrieveUserByUsername,
  // accounts
  createAccount,
  retrieveAccountsByUserId,
  // orders
  createOrder,
  retrieveOrdersByAccountIds,
  markOrderExecutedByPaymentId,
  // payment status updates
  createPaymentStatusUpdate,
  retrievePaymentStatusUpdatesByPaymentIds,
};

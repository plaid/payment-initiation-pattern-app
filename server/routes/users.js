/**
 * @file Defines all routes for the Users route.
 */

const express = require('express');
const Boom = require('@hapi/boom');
const {
  retrieveUserByUsername,
  createUser,
  retrieveUserById,
  createAccount,
  retrieveAccountsByUserId,
  retrieveOrdersByAccountIds,
  retrievePaymentStatusUpdatesByPaymentIds,
} = require('../db/queries');
const { asyncWrapper } = require('../middleware');
const { groupBy } = require('../util');

const router = express.Router();

/**
 * Computes account balance based on a list of payment orders
 */
const computeBalance = orders => {
  return orders.reduce((sum, order) => {
    if (order.payment_executed) {
      // eslint-disable-next-line no-param-reassign
      sum += order.amount / 100;
    }
    return sum;
  }, 0);
};

const getUserWithRelations = async userId => {
  const user = await retrieveUserById(userId);
  if (user == null) throw new Boom('User does not exist.', { statusCode: 400 });

  const accounts = await retrieveAccountsByUserId(userId);
  const orders = await retrieveOrdersByAccountIds(
    accounts.map(account => account.id)
  );

  const paymentStatusUpdates = await retrievePaymentStatusUpdatesByPaymentIds(
    orders.map(order => order.payment_id)
  );

  const ordersByAccountId = groupBy(orders, 'account_id');
  const paymentStatusUpdatesByPaymentId = groupBy(
    paymentStatusUpdates,
    'payment_id'
  );

  /* eslint-disable no-param-reassign */
  accounts.forEach(account => {
    account.orders = ordersByAccountId[account.id] || [];
    account.orders.forEach(order => {
      order.payment_status_updates =
        paymentStatusUpdatesByPaymentId[order.payment_id] || [];
    });

    account.balance = computeBalance(account.orders);
    return account;
  });
  /* eslint-enable no-param-reassign */

  user.accounts = accounts;
  return user;
};

/**
 * Creates a new user (unless the username is already taken).
 */
router.post(
  '/',
  asyncWrapper(async (req, res) => {
    const { username } = req.body;
    const usernameExists = await retrieveUserByUsername(username);
    if (usernameExists)
      throw new Boom('Username already exists', { statusCode: 409 });
    const user = await createUser(username);

    // create some accounts by default
    await createAccount(user.id, 'Current');
    await createAccount(user.id, 'Savings');

    const userWithRelations = await getUserWithRelations(user.id);
    res.json(userWithRelations);
  })
);

/**
 * Retrieves all user information. Object structure:
 * - user
 *  - accounts
 *    - orders
 *      - payment_status_updates
 * To simplify the client-side state management of this demo application, all relevant user data is
 * returned by this single endpoint. Whenever data is updated, the backend will emit a "USER_UPDATED" message via socket.
 * The client will then requery all data through this endpoint. Also see: client/src/components/Sockets.jsx.
 */
router.get(
  '/:userId',
  asyncWrapper(async (req, res) => {
    const { userId } = req.params;

    const userWithRelations = await getUserWithRelations(userId);
    res.json(userWithRelations);
  })
);

module.exports = router;

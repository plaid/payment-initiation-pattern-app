/**
 * @file Defines all root routes for the application.
 */

const usersRouter = require('./users');
const sessionsRouter = require('./sessions');
const unhandledRouter = require('./unhandled');
const paymentsRouter = require('./payments');
const webhooksRouter = require('./webhooks');

module.exports = {
  usersRouter,
  unhandledRouter,
  sessionsRouter,
  paymentsRouter,
  webhooksRouter,
};

/**
 * @file Defines the queries for the orders table.
 */

const format = require('pg-format');
const db = require('../');

const createOrder = async (accountId, paymentId, paymentReference, amount) => {
  const query = {
    text: `
        INSERT INTO orders
          (
            account_id,
            payment_id,
            payment_reference,
            amount
          )
        VALUES
          ($1, $2, $3, $4)
        RETURNING
          *
      `,
    values: [accountId, paymentId, paymentReference, amount],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

const retrieveOrdersByAccountIds = async accountIds => {
  if (accountIds.length === 0) {
    return [];
  }
  const query =
    'SELECT * FROM orders WHERE account_id IN (%L) ORDER BY id DESC';
  const sql = format(query, accountIds);
  const { rows } = await db.query(sql);
  return rows;
};

const markOrderExecutedByPaymentId = async paymentId => {
  const query = {
    text: 'UPDATE orders SET payment_executed = true WHERE payment_id = $1',
    values: [paymentId],
  };
  const { rows } = await db.query(query);
  return rows;
};

module.exports = {
  createOrder,
  retrieveOrdersByAccountIds,
  markOrderExecutedByPaymentId,
};

/**
 * @file Defines the queries for the payment_status_updates table.
 */

const format = require('pg-format');
const db = require('../');

const createPaymentStatusUpdate = async (
  paymentId,
  paymentStatus,
  webhookTimestamp
) => {
  const query = {
    text: `
        INSERT INTO payment_status_updates
          (
            payment_id,
            payment_status,
            created_at
          )
        VALUES
          ($1, $2, $3)
        RETURNING
          *
      `,
    values: [paymentId, paymentStatus, webhookTimestamp],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

const retrievePaymentStatusUpdatesByPaymentIds = async paymentIds => {
  if (paymentIds.length === 0) {
    return [];
  }
  const query =
    'SELECT * FROM payment_status_updates WHERE payment_id IN (%L) ORDER BY created_at, id ASC';
  const sql = format(query, paymentIds);
  const { rows } = await db.query(sql);
  return rows;
};

module.exports = {
  createPaymentStatusUpdate,
  retrievePaymentStatusUpdatesByPaymentIds,
};

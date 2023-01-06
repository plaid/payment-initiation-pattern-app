/**
 * @file Defines the queries for the accounts table.
 */

const db = require('../');

const createAccount = async (userId, name) => {
  const query = {
    text: `
        INSERT INTO accounts
          (
            user_id,
            name
          )
        VALUES
          ($1, $2)
        RETURNING
          *
      `,
    values: [userId, name],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

const retrieveAccountsByUserId = async userId => {
  const query = {
    text: 'SELECT * FROM accounts WHERE user_id = $1 ORDER BY id',
    values: [userId],
  };
  const { rows: accounts } = await db.query(query);
  return accounts;
};

const retrieveAccountById = async accountId => {
  const query = {
    text: 'SELECT * FROM accounts WHERE id = $1',
    values: [accountId],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

module.exports = {
  createAccount,
  retrieveAccountById,
  retrieveAccountsByUserId,
};

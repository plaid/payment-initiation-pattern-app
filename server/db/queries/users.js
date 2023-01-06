/**
 * @file Defines the queries for the users table.
 */

const db = require('../');

const createUser = async username => {
  const query = {
    // RETURNING is a Postgres-specific clause that returns a list of the inserted items.
    text: 'INSERT INTO users (username) VALUES ($1) RETURNING *;',
    values: [username],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

const retrieveUserById = async userId => {
  const query = {
    text: 'SELECT * FROM users WHERE id = $1',
    values: [userId],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

const retrieveUserByUsername = async username => {
  const query = {
    text: 'SELECT * FROM users WHERE username = $1',
    values: [username],
  };
  const { rows } = await db.query(query);
  // the username column has a UNIQUE constraint, so this will never return more than one row.
  return rows[0];
};

module.exports = {
  createUser,
  retrieveUserById,
  retrieveUserByUsername,
};

/**
 * @file Defines all routes for the Users route.
 */

const express = require('express');
const Boom = require('@hapi/boom');
const { retrieveUserByUsername } = require('../db/queries');
const { asyncWrapper } = require('../middleware');

const router = express.Router();

/**
 * Retrieves user information for a single user.
 *
 * @param {string} username the name of the user.
 * @returns {Object[]} an array containing a single user.
 */
router.post(
  '/',
  asyncWrapper(async (req, res) => {
    const { username } = req.body;
    const user = await retrieveUserByUsername(username);
    if (user == null)
      throw new Boom('User does not exist.', { statusCode: 400 });

    res.json(user);
  })
);

module.exports = router;

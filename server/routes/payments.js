/**
 * @file Defines all routes for the /payments route.
 */

const express = require('express');
const { asyncWrapper } = require('../middleware');
const { plaid } = require('../plaid');
const { getPublicUrlForBackend } = require('../util');
const { retrieveAccountById } = require('../db/queries/accounts');
const { createOrder } = require('../db/queries');

const { PLAID_SANDBOX_REDIRECT_URI } = process.env;
const COMPANY_NAME = 'Company Name';

const router = express.Router();
const userIdToLinkTokenMapping = new Map();

/**
 * @desc This endpoint creates the resources required to initiate a payment with Plaid. It returns a link token which is used by the client to initiate Link.
 * This endpoint also creates a payment "order" which is used to manage payment reconciliation.
 */
router.post(
  '/create_link_token',
  asyncWrapper(async (req, res) => {
    const { amount, accountId } = req.body;

    const account = await retrieveAccountById(accountId);
    const userId = account.user_id;
    const paymentReference = `account${accountId}`;

    /**
     * Read more about the payment_initiation/recipient/create endpoint:
     * https://plaid.com/docs/api/products/payment-initiation/#payment_initiationrecipientcreate
     */
    const recipientCreateResponse = await plaid.paymentInitiationRecipientCreate(
      {
        name: COMPANY_NAME, // The beneficiary of the bank account. This will be displayed on the Link UI.
        iban: 'NL06INGB5632579034', // non-existent example IBAN. In the UK provide "bacs" instead.
      }
    );

    /**
     * Plaid recommends using integers for arithmetic operations as accuracy might be lost when using floats.
     */
    const amountCents = Math.round(100 * amount);

    /**
     * Read more about the payment_initiation/payment/create endpoint:
     * https://plaid.com/docs/api/products/payment-initiation/#payment_initiationpaymentcreate
     */
    const paymentCreateResponse = await plaid.paymentInitiationPaymentCreate({
      recipient_id: recipientCreateResponse.data.recipient_id,
      amount: {
        currency: 'EUR',
        /**
         * The amount value is to be specified as a float with up 2 decimals of precision.
         */
        value: amountCents / 100,
      },
      /**
       * The payment reference will be displayed on the Link UI and will be passed to the bank when initiating the payment.
       * It may appear on the end user's bank statement, and can be used for payments reconciliation.
       */
      reference: paymentReference,
    });

    /**
     * To receive webhooks your application will need to expose an endpoint which can be accessed by a set of Plaid IPs.
     * Read more about webhooks and webhook verification here:
     * https://plaid.com/docs/api/webhooks/#configuring-webhooks
     */
    const publicUrlBackend = await getPublicUrlForBackend();
    const webhookUrl = `${publicUrlBackend}/webhooks`;

    /**
     * Read more about the link/token/create endpoint:
     * https://plaid.com/docs/api/tokens/#linktokencreate
     */
    const linkTokenCreateResponse = await plaid.linkTokenCreate({
      client_name: COMPANY_NAME,
      language: 'en', // Supported languages: https://plaid.com/docs/api/link/#link-token-create-request-language
      country_codes: ['GB', 'DE', 'NL'], // Supported countries: https://plaid.com/docs/api/link/#link-token-create-request-country-codes
      user: {
        client_user_id: `${userId}`,
        /**
         * You optionally may pass additional fields which can help identify returning users which can improve conversion.
         * name: {
         *  given_name: '',
         *  family_name: '',
         * },
         * email_address: '',
         * email_address_verified_time: '',
         * phone_number: '',
         * phone_number_verified_time: '',
         * */
      },
      products: ['payment_initiation'],
      payment_initiation: {
        payment_id: paymentCreateResponse.data.payment_id,
      },
      /**
       * In certain mobile flows we may need to redirect users to their financial institutions for authorization.
       * To support these flows and redirect users back to your client application you will need to implement a publicly accessible OAuth endpoint.
       * Read more about Oauth: https://plaid.com/docs/link/oauth/
       */
      redirect_uri: PLAID_SANDBOX_REDIRECT_URI,
      webhook: webhookUrl,
    });

    /**
     * Plaid recommends persisting an object in your backend to track the state of a payment order while PAYMENT_STATUS_UPDATE webhooks come in.
     * In this example application we will only count a payment towards the account balance once the payment order has been marked as `payment_executed = true`.
     * This happens in server/routes/webhooks.js when a PAYMENT_STATUS_UPDATE webhook with payment status PAYMENT_STATUS_EXECUTED comes in.
     */
    await createOrder(
      accountId,
      paymentCreateResponse.data.payment_id,
      paymentReference,
      amountCents
    );

    /**
     * See the comments near the /user_link_token endpoint below to learn why this mapping is maintained.
     */
    const linkToken = linkTokenCreateResponse.data.link_token;
    userIdToLinkTokenMapping.set(userId, linkToken);

    /**
     * This socket message is published to the front-end to trigger a client-side update.
     * It is needed to provide a smooth demo experience and is not a requirement for integrating with Plaid.
     */
    const { io } = req;
    io.emit('USER_UPDATED');

    /**
     * The returned link token will be used by the client to initiate Link. See:
     * 1. client/src/components/PaymentButton.tsx
     * 2. client/src/components/Link.tsx
     */
    return res.json({
      link_token: linkToken,
    });
  })
);

/**
 * To support OAuth flows, Plaid recommends maintaining a link token and user association on the back-end.
 * During OAuth flows, users may be redirected to a different browser which means
 * the used link token cannot be retrieved from local storage for the second initialization of Link.
 * In such cases, Plaid suggests to have the client retrieve the link token from the backend.
 *
 * See client/src/components/OAuth.tsx for an example implementation.
 *
 * A suitable backend storage may be Redis with a 30-minute expiration.
 * For simplicity’s sake, this sample app uses an in-memory mapping.
 */
router.get(
  '/user_link_token',
  asyncWrapper(async (req, res) => {
    const { userId: userIdString } = req.query;
    const userId = parseInt(userIdString, 10);

    console.log(userId, req.query, userIdToLinkTokenMapping);

    return res.json({
      link_token: userIdToLinkTokenMapping.has(userId)
        ? userIdToLinkTokenMapping.get(userId)
        : null,
    });
  })
);

module.exports = router;

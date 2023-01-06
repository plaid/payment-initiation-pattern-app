const express = require('express');

const router = express.Router();

const { asyncWrapper } = require('../middleware');
const {
  createPaymentStatusUpdate,
  markOrderExecutedByPaymentId,
} = require('../db/queries');

/**
 * Handles incoming webhooks from Plaid. Read more about webhooks:
 * https://plaid.com/docs/#webhooks
 */
router.post(
  '/',
  asyncWrapper(async (request, response) => {
    const {
      webhook_code: webhookCode,
      timestamp: webhookTimestamp,
    } = request.body;
    const { io } = request;

    /**
     * Read more about PAYMENT_STATUS_UPDATE webhooks:
     * https://plaid.com/docs/api/products/payment-initiation/#payment_status_update
     */
    if (webhookCode === 'PAYMENT_STATUS_UPDATE') {
      const {
        payment_id: paymentId,
        new_payment_status: paymentStatus,
      } = request.body;
      /**
       * It is not strictly required to persist payment status updates themselves but,
       * Plaid recommends doing so for auditability purposes.
       */
      await createPaymentStatusUpdate(
        paymentId,
        paymentStatus,
        webhookTimestamp
      );

      /**
       * Plaid recommends only releasing funds when a payment reaches an EXECUTED state.
       * Read more about all possible payment statuses here:
       * https://plaid.com/docs/api/products/payment-initiation/#PaymentStatusUpdateWebhook-new-payment-status
       */
      if (paymentStatus === 'PAYMENT_STATUS_EXECUTED') {
        /**
         * This payment order was created as part of the link token create process defined in:
         * - server/routes/payments.js
         */
        markOrderExecutedByPaymentId(paymentId);
      }

      /**
       * This socket message is published to the front-end to trigger a client-side update.
       * It is needed to provide a smooth demo experience and is not a requirement for integrating with Plaid.
       */
      io.emit('USER_UPDATED');
    }

    /**
     * This socket message is published to power the "Developer Console" which is part of this demo.
     * It is not a requirement for integrating with Plaid.
     */
    io.emit('TERMINAL', {
      data: `${webhookCode}\n${JSON.stringify(request.body)}`,
      source: 'BACKEND',
      type: 'WEBHOOK',
      time: new Date(webhookTimestamp),
    });

    response.json({ status: 'ok' });
  })
);

module.exports = router;

/**
 * @file Verifies that incoming webhooks actually came from Plaid.
 *
 * Why this exists: our /webhooks route trusts the request body to decide when to
 * mark a payment order as executed (which releases funds to the account balance).
 * Without verification, anyone who can reach that endpoint could POST a forged
 * PAYMENT_STATUS_EXECUTED body and trigger that release without a real payment
 * ever happening. Plaid signs every webhook body with a JWT in the
 * `Plaid-Verification` header so the receiver can check it wasn't forged or
 * tampered with in transit. See: https://plaid.com/docs/api/webhooks/webhook-verification/
 */

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const { plaid } = require('./plaid');

/**
 * Plaid's signing keys rotate infrequently, and the same `kid` is reused across
 * many webhooks. Calling `/webhook_verification_key/get` on every request would
 * just re-fetch a key we already have, so we cache by `kid` and only call the
 * API the first time we see a given key. Plaid docs recommend keeping keys
 * cached indefinitely, but discarding a cached key once Plaid reports it as
 * expired (via `expired_at`) so rotation is picked up.
 */
const keyCache = new Map();

const getVerificationKey = async keyId => {
  const cached = keyCache.get(keyId);
  if (cached && !(cached instanceof Promise) && cached.expired_at == null) {
    return cached;
  }

  /**
   * Cache the in-flight promise, not just the resolved key, so a burst of
   * webhooks for a kid we haven't seen yet (e.g. right after Plaid rotates
   * its signing key) share one fetch instead of each firing their own
   * webhookVerificationKeyGet call.
   */
  if (cached instanceof Promise) {
    return cached;
  }

  const keyPromise = plaid
    .webhookVerificationKeyGet({ key_id: keyId })
    .then(response => response.data.key)
    .catch(err => {
      // Allow a later request to retry fetching this key if this attempt failed.
      keyCache.delete(keyId);
      throw err;
    });
  keyCache.set(keyId, keyPromise);

  const key = await keyPromise;
  keyCache.set(keyId, key);
  return key;
};

/**
 * @param {Buffer} rawBody the exact, unparsed request body bytes as sent by
 *   Plaid. The signature covers these bytes, so verification must run against
 *   the raw buffer rather than the JSON re-serialized by Express - re-serializing
 *   can reorder keys or change whitespace and would make a legitimate webhook
 *   fail verification.
 * @param {string} signedJwt the value of the `Plaid-Verification` header.
 * @throws if the header is missing, the JWT is malformed, the signature doesn't
 *   verify, the token is stale, or the body hash doesn't match.
 */
const verifyWebhook = async (rawBody, signedJwt) => {
  if (!signedJwt) {
    throw new Error('Missing Plaid-Verification header.');
  }
  /**
   * express.json({verify}) only populates rawBody when the request's
   * Content-Type matches application/json. A request that arrives with a
   * different or missing Content-Type (e.g. manual testing with curl) would
   * otherwise reach the hashing step below with rawBody undefined and fail
   * with a cryptic Buffer/TypeError instead of an explanation.
   */
  if (!rawBody) {
    throw new Error('Webhook body is unavailable for verification.');
  }

  const decodedHeader = jwt.decode(signedJwt, { complete: true });
  if (!decodedHeader || decodedHeader.header.alg !== 'ES256') {
    throw new Error('Invalid webhook JWT header.');
  }

  const keyId = decodedHeader.header.kid;
  const key = await getVerificationKey(keyId);
  if (key.expired_at != null) {
    throw new Error(`Webhook verification key ${keyId} has expired.`);
  }

  const pem = jwkToPem(key);
  const payload = jwt.verify(signedJwt, pem, { algorithms: ['ES256'] });

  /**
   * Reject tokens that aren't fresh. Without this, a captured webhook body/JWT
   * pair could be replayed indefinitely to re-trigger the same side effects.
   * Plaid recommends rejecting anything older than 5 minutes.
   */
  const ageSeconds = Date.now() / 1000 - payload.iat;
  if (ageSeconds > 5 * 60) {
    throw new Error('Webhook verification token is too old.');
  }

  /**
   * The JWT signature only proves Plaid issued this token - it says nothing
   * about which body it was issued for. Plaid binds the two together by
   * embedding a SHA-256 hash of the body in the `request_body_sha256` claim,
   * so we recompute that hash ourselves and compare.
   */
  const bodyHash = crypto.createHash('sha256').update(rawBody).digest('hex');
  if (
    !crypto.timingSafeEqual(
      Buffer.from(bodyHash),
      Buffer.from(payload.request_body_sha256)
    )
  ) {
    throw new Error('Webhook body hash does not match.');
  }
};

module.exports = { verifyWebhook };

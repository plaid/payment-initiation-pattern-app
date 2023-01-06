-- This trigger updates the value in the updated_at column. It is used in the tables below to log
-- when a row was last updated.

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- USERS
-- Stores the users of this demo application.
CREATE TABLE users
(
  id SERIAL PRIMARY KEY,
  username text UNIQUE NOT NULL,
  created_at timestamptz default now()
);

-- ACCOUNTS
-- Stores the accounts that can be topped-up, belonging to each user.

CREATE TABLE accounts
(
  id SERIAL PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz default now()
);

-- ORDERS
-- Stores payment orders which are linked to payments and are used for reconciling account balance.

CREATE TABLE orders
(
  id SERIAL PRIMARY KEY,
  account_id integer NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  payment_id text UNIQUE NOT NULL,
  payment_reference text NOT NULL,
  payment_executed boolean NOT NULL DEFAULT false,
  amount integer NOT NULL,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

CREATE TRIGGER orders_at_timestamp
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();


-- PAYMENT_STATUS_UPDATES
-- Stores PAYMENT_STATUS_UPDATE webhook events
-- https://plaid.com/docs/api/products/payment-initiation/#payment_status_update

CREATE TABLE payment_status_updates
(
  id SERIAL PRIMARY KEY,
  payment_id text NOT NULL REFERENCES orders(payment_id) ON DELETE CASCADE,
  payment_status text NOT NULL,
  created_at timestamptz default now()
);
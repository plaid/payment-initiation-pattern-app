import React from 'react';
import { AccountType } from './types';
import { Box } from 'plaid-threads';
import Accordion from 'plaid-threads/Accordion';
import Order from './Order';
import { currencyFormatter } from './util';

interface Props {
  account: AccountType;
}

const Account: React.FC<Props> = (props: Props) => {
  const { account } = props;
  return (
    <>
      <Box border={1} px={2} pt={3}>
        <small>Balance</small>
        <h3 className="balance">{currencyFormatter.format(account.balance)}</h3>
      </Box>
      <h4>Payment Orders</h4>
      {account.orders.length ? (
        <Accordion.Group>
          {account.orders.map((order, index) => (
            <Order key={order.id} order={order} initiallyOpen={index === 0} />
          ))}
        </Accordion.Group>
      ) : (
        <p>
          No payment orders yet. Start by making a payment using the sidebar.
        </p>
      )}
    </>
  );
};

Account.displayName = 'Account';
export default Account;

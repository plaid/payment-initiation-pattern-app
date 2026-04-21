import React from 'react';
import { AccountType } from './types';
import { AccordionGroup } from './ui/Accordion';
import Order from './Order.tsx';
import { currencyFormatter } from './util.tsx';

interface Props {
  account: AccountType;
}

const Account: React.FC<Props> = (props: Props) => {
  const { account } = props;
  return (
    <>
      <div className="border border-gray-300 px-[1.6rem] pt-[2.4rem]">
        <small>Balance</small>
        <h3 className="mt-0">{currencyFormatter.format(account.balance)}</h3>
      </div>
      <h4>Payment Orders</h4>
      {account.orders.length ? (
        <AccordionGroup>
          {account.orders.map((order, index) => (
            <Order key={order.id} order={order} initiallyOpen={index === 0} />
          ))}
        </AccordionGroup>
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

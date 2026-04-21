import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Select from './ui/Select';
import NumberInput from './ui/NumberInput';
import Spinner from './ui/Spinner';
import PaymentButton from './PaymentButton.tsx';
import useCurrentUser from '../services/currentUser.tsx';
import Account from './Account.tsx';
import { currencyFormatter } from './util.tsx';

const Profile: React.FC = () => {
  const { state } = useCurrentUser();
  const [amount, setAmount] = useState<string>('20.00');
  const [accountId, setAccountId] = useState<number | null>(null);
  const user = state.user;

  if (user == null) {
    return (
      <>
        <Link
          to="/"
          className="inline-flex items-center text-plaid-blue hover:underline mb-4 text-[1.6rem]"
        >
          &larr; Back
        </Link>
        <Spinner />
      </>
    );
  }

  if (accountId == null) {
    setAccountId(user.accounts[0].id);
  }

  const account = user.accounts.find(account => account.id === accountId);

  return (
    <>
      <Link
        to="/"
        className="inline-flex items-center text-plaid-blue hover:underline mb-4 text-[1.6rem]"
      >
        &larr; Back
      </Link>
      <h3>Manage {user.username}'s accounts</h3>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        <div className="col-span-full">
          <Select
            id="accounts"
            label="Account"
            onChange={selectedAccount => {
              setAccountId(selectedAccount.value);
            }}
            options={user.accounts.map(account => {
              return {
                value: account.id,
                label: `${account.name} - ${currencyFormatter.format(
                  account.balance
                )}`,
              };
            })}
            value={{
              label: account?.name || '',
              value: account?.id || 0,
            }}
          />
        </div>
        {account ? (
          <>
            <div className="order-2 lg:order-none lg:col-span-8">
              <Account account={account} />
            </div>
            <div className="order-1 lg:order-none lg:col-span-4">
              <div className="px-[2.4rem] pb-[3.2rem] border border-gray-300 rounded-threads">
                <h4>Fund your account</h4>
                <p>Choose the amount</p>
                <NumberInput
                  id="amount"
                  large={true}
                  label=""
                  onChange={e => setAmount(e.target.value)}
                  value={`${amount}`}
                  prefix={() => <>€</>}
                />
                <PaymentButton accountId={account.id} amount={Number(amount)} />
              </div>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};

Profile.displayName = 'Profile';
export default Profile;

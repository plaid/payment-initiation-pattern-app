import React, { useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import NavigationLink from 'plaid-threads/NavigationLink';

import { Box, Column, Grid, LoadingSpinner, Select } from 'plaid-threads';
import { NumberInput } from 'plaid-threads/NumberInput';
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
        <NavigationLink component={Link} to="/">
          Back
        </NavigationLink>
        <LoadingSpinner />
      </>
    );
  }

  if (accountId == null) {
    setAccountId(user.accounts[0].id);
  }

  const account = user.accounts.find(account => account.id === accountId);

  return (
    <>
      <NavigationLink component={Link} to="/">
        Back
      </NavigationLink>
      <h3>Manage {user.username}'s accounts</h3>
      <Grid fullWidth={true}>
        <Column>
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
        </Column>
        {account ? (
          <>
            <Column smallOrder={2} large={8}>
              <Account account={account} />
            </Column>
            <Column smallOrder={1} large={4}>
              <Box px={3} pb={4} border={1} className="payment-box">
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
              </Box>
            </Column>
          </>
        ) : null}
      </Grid>
    </>
  );
};

Profile.displayName = 'Profile';
export default Profile;

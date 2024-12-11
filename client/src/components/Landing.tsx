import React from 'react';
import Button from 'plaid-threads/Button';
import { useHistory } from 'react-router-dom';

import CreateUser from './CreateUser.tsx';
import Login from './Login.tsx';
import { Box, InlineLink } from 'plaid-threads';
import { useCurrentUser } from '../services';

const Landing: React.FC = () => {
  const { state } = useCurrentUser();
  const history = useHistory();
  const user = state.user;

  const returnToCurrentUser = () => {
    history.push(`/profile`);
  };

  return (
    <>
      <h1>Europe Account Funding</h1>
      <p className="h3">
        This is an example <strong>account funding</strong> app that outlines an
        end-to-end integration with Plaid.
      </p>
      <p>
        To learn more about account funding and the Payment Initiation product,
        see the{' '}
        <InlineLink
          target="_blank"
          href="https://plaid.com/docs/payment-initiation/user-onboarding-and-account-funding/"
        >
          account funding guide
        </InlineLink>
        . The buttons below act as a simplified version of your user onboarding
        flow. If you haven't created a User yet, start by clicking "Create
        User".
      </p>
      <Box pt={1}>
        <CreateUser />
        <Login />

        {user != null && (
          <Button secondary={true} inline={true} onClick={returnToCurrentUser}>
            Back to "{user.username}"
          </Button>
        )}
      </Box>
    </>
  );
};

Landing.displayName = 'Landing';
export default Landing;

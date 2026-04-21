import React from 'react';
import { useHistory } from 'react-router-dom';

import Button from './ui/Button';
import CreateUser from './CreateUser.tsx';
import Login from './Login.tsx';
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
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://plaid.com/docs/payment-initiation/user-onboarding-and-account-funding/"
          className="text-plaid-blue underline hover:text-plaid-blue/80"
        >
          account funding guide
        </a>
        . The buttons below act as a simplified version of your user onboarding
        flow. If you haven't created a User yet, start by clicking "Create
        User".
      </p>
      <div className="pt-[0.8rem]">
        <CreateUser />
        <Login />

        {user != null && (
          <Button variant="secondary" onClick={returnToCurrentUser}>
            Back to "{user.username}"
          </Button>
        )}
      </div>
    </>
  );
};

Landing.displayName = 'Landing';
export default Landing;

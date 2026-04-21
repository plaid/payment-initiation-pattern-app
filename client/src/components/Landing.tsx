import React from 'react';
import { useHistory } from 'react-router-dom';

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
          className="text-blue-900 underline hover:text-blue-800"
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
          <button
            onClick={returnToCurrentUser}
            className="inline-flex items-center justify-center px-4 py-[1.2rem] text-[1.6rem] font-semibold text-black-1000 border border-gray-400 rounded-threads hover:border-blue-900 hover:text-blue-900 transition-colors"
          >
            Back to "{user.username}"
          </button>
        )}
      </div>
    </>
  );
};

Landing.displayName = 'Landing';
export default Landing;

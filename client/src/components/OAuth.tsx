import React, { useEffect, useState } from 'react';
import Link from './Link';
import { useHistory } from 'react-router-dom';
import { getUserLinkToken } from '../services/api';
import { useCurrentUser } from '../services';
import { LoadingSpinner } from 'plaid-threads';

interface Props {}

const OAuth: React.FC<Props> = (props: Props) => {
  const history = useHistory();
  const { state } = useCurrentUser();
  const [fetchedLinkToken, setFetchedLinkToken] = useState<boolean>(false);

  /**
   * 1. We first attempt to retrieve the link token from local storage.
   * It is set inside client/src/components/PaymentButton.tsx.
   */
  const [linkToken, setLinkToken] = useState<string | null>(
    localStorage.getItem('link_token')
  );

  const fetchLinkToken = async () => {
    if (state.userId == null) {
      setFetchedLinkToken(true);
      return;
    }

    try {
      const getUserLinkTokenResponse = await getUserLinkToken(state.userId);
      setLinkToken(getUserLinkTokenResponse.data?.link_token || null);
    } catch (e) {
      console.error(e);
    }
    setFetchedLinkToken(true);
  };

  useEffect(() => {
    /**
     * 2. In case the user has been redirected to a different browser on their device, the local storage will be empty.
     * In this case we try to fetch the link token from the backend.
     *
     * See server/routes/payments.js to learn how this request is handled.
     */
    if (linkToken == null && !fetchedLinkToken) {
      fetchLinkToken();
    }
  }, [linkToken, fetchedLinkToken]);

  if (!fetchedLinkToken && linkToken == null) {
    return <LoadingSpinner />;
  }

  if (linkToken == null) {
    history.push('/');
    return null;
  }

  /**
   * To demo the OAuth flow you may use the Chrome browser to simulate a mobile device.
   * Learn how to do this under "Mobile Device Viewport Mode" here:
   * https://developer.chrome.com/docs/devtools/device-mode/
   */
  return <Link token={linkToken} receivedRedirectUri={window.location.href} />;
};

OAuth.displayName = 'OAuth';
export default OAuth;

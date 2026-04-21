import React, { useEffect, useState } from 'react';
import Link from './Link.tsx';
import { useHistory } from 'react-router-dom';
import { getUserLinkToken } from '../services/api.tsx';
import useCurrentUser from '../services/currentUser.tsx';
import Spinner from './ui/Spinner';

interface Props {}

const OAuth: React.FC<Props> = (props: Props) => {
  const history = useHistory();
  const { state } = useCurrentUser();
  const [fetchedLinkToken, setFetchedLinkToken] = useState<boolean>(false);

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
    if (linkToken == null && !fetchedLinkToken) {
      fetchLinkToken();
    }
  }, [linkToken, fetchedLinkToken]);

  if (!fetchedLinkToken && linkToken == null) {
    return <Spinner />;
  }

  if (linkToken == null) {
    history.push('/');
    return null;
  }

  return <Link token={linkToken} receivedRedirectUri={window.location.href} />;
};

OAuth.displayName = 'OAuth';
export default OAuth;

import React, { useEffect } from 'react';
import {
  PlaidLinkOnEvent,
  PlaidLinkOnExit,
  PlaidLinkOptions,
  usePlaidLink,
} from 'react-plaid-link';
import { PlaidLinkOnSuccess } from 'react-plaid-link/src/types';
import useTerminal from '../services/terminal';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

interface Props {
  token: string | null;
  receivedRedirectUri?: string;
  onClose?: () => void;
}

const Link: React.FC<Props> = (props: Props) => {
  const { token, receivedRedirectUri, onClose } = props;
  const { terminalAppend } = useTerminal();
  const history = useHistory();

  const redirectToCurrentUserIfNeeded = () => {
    /**
     * When a redirectUri is passed, it means this is the second initialisation of Link which is part of the OAuth flow.
     * To align the experience we will redirect the user back to the same page as they started the flow.
     * Read more about OAuth here: https://plaid.com/docs/link/oauth/
     */
    if (receivedRedirectUri) {
      history.push(`/profile`);
    }
  };

  const onSuccess: PlaidLinkOnSuccess = (public_token, metadata) => {
    redirectToCurrentUserIfNeeded();

    /**
     * Unlike other products, for payment_initiation it is not necessary to exchange the public_token
     * for an access_token. You only need the payment_id to interact with the payment_initiation endpoints.
     */

    terminalAppend({
      data: 'onSuccess: { ... }',
      source: 'CLIENT',
      type: 'LINK',
      time: new Date(),
    });
    if (onClose) {
      onClose();
    }
  };

  const onExit: PlaidLinkOnExit = (error, metadata) => {
    redirectToCurrentUserIfNeeded();
    terminalAppend({
      data: 'onExit: { ... }',
      source: 'CLIENT',
      type: 'LINK',
      time: new Date(),
    });
    toast.error(error?.display_message || 'An error occurred');
    if (onClose) {
      onClose();
    }
  };

  const onEvent: PlaidLinkOnEvent = (eventName, metadata) => {
    terminalAppend({
      data: 'onEvent: ' + eventName + ' { ... }',
      source: 'CLIENT',
      type: 'LINK',
      time: new Date(metadata.timestamp),
    });
  };

  const linkConfig: PlaidLinkOptions = {
    token,
    receivedRedirectUri,
    onSuccess,
    onExit,
    onEvent,
  };
  const { open, ready } = usePlaidLink(linkConfig);

  useEffect(() => {
    if (ready) {
      open();
    }
  }, [ready, open]);

  return <></>;
};

Link.displayName = 'Link';
export default Link;

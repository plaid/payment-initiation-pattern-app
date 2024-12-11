import React, { useState } from 'react';
import { Button } from 'plaid-threads';
import { createPaymentAndLinkToken } from '../services/api.tsx';
import { toast } from 'react-toastify';
import Link from './Link.tsx';
import useTerminal from '../services/terminal.tsx';

interface Props {
  accountId: number;
  amount: number;
}

const PaymentButton: React.FC<Props> = (props: Props) => {
  const { accountId, amount } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const { terminalAppend } = useTerminal();
  const createPayment = async () => {
    try {
      terminalAppend({
        time: new Date(),
        type: 'USER',
        source: 'CLIENT',
        data: 'Clicks "Make Payment" Button',
      });
      setLoading(true);
      const createPaymentResponse = await createPaymentAndLinkToken(
        amount,
        accountId
      );

      const linkToken = createPaymentResponse.data.link_token;
      localStorage.setItem('link_token', linkToken);
      setLinkToken(linkToken);
    } catch (err: any) {
      toast.error(err?.message || 'An error occurred.');
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        disabled={loading}
        centered
        onClick={() => createPayment()}
        wide={true}
      >
        {loading ? 'Loading...' : 'Make payment'}
      </Button>
      {linkToken ? (
        <Link
          token={linkToken}
          onClose={() => {
            setLoading(false);
          }}
        />
      ) : null}
    </>
  );
};

PaymentButton.displayName = 'PaymentButton';
export default PaymentButton;

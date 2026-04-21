import React, { useState } from 'react';
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
      <button
        disabled={loading}
        onClick={() => createPayment()}
        className="w-full flex items-center justify-center px-6 py-[1.2rem] text-[1.6rem] font-semibold text-white bg-black-1000 rounded-threads hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors mt-4"
      >
        {loading ? 'Loading...' : 'Make payment'}
      </button>
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

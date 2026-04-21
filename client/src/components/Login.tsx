import React, { useState } from 'react';

import Modal from './ui/Modal';
import TextInput from './ui/TextInput';
import useCurrentUser from '../services/currentUser.tsx';

const Login: React.FC = () => {
  const { login } = useCurrentUser();
  const [show, setShow] = useState(false);
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    setShow(false);
    login(value);
    setValue('');
  };

  return (
    <>
      <Modal
        isOpen={show}
        onClose={() => {
          setShow(false);
          setValue('');
        }}
        header="User Login"
        isLoading={false}
        onConfirm={handleSubmit}
        confirmText="Submit"
      >
        <TextInput
          id="username"
          label=""
          placeholder="Username"
          value={value}
          onChange={e => setValue(e.currentTarget.value)}
        />
      </Modal>
      <button
        onClick={() => setShow(!show)}
        className="inline-flex items-center justify-center px-4 py-[1.2rem] text-[1.6rem] font-semibold text-black-1000 border border-gray-400 rounded-threads hover:border-blue-900 hover:text-blue-900 transition-colors mr-2"
      >
        Login
      </button>
    </>
  );
};

Login.displayName = 'Login';
export default Login;

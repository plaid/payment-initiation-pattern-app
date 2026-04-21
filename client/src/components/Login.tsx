import React, { useState } from 'react';

import Button from './ui/Button';
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
      <Button
        variant="secondary"
        onClick={() => setShow(!show)}
        className="mr-2"
      >
        Login
      </Button>
    </>
  );
};

Login.displayName = 'Login';
export default Login;

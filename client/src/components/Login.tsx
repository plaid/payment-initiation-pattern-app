import React, { useState } from 'react';
import Modal from 'plaid-threads/Modal';
import ModalBody from 'plaid-threads/ModalBody';
import Button from 'plaid-threads/Button';
import TextInput from 'plaid-threads/TextInput';

import { useCurrentUser } from '../services';

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
        onRequestClose={() => {
          setShow(false);
          setValue('');
        }}
      >
        <>
          <ModalBody
            onClickCancel={() => {
              setShow(false);
              setValue('');
            }}
            header="User Login"
            isLoading={false}
            onClickConfirm={handleSubmit}
            confirmText="Submit"
          >
            <TextInput
              label=""
              id="username"
              placeholder="Username"
              value={value}
              onChange={e => setValue(e.currentTarget.value)}
            />
          </ModalBody>
        </>
      </Modal>
      <Button
        inline={true}
        secondary={true}
        onClick={() => setShow(!show)}
        centered
      >
        Login
      </Button>
    </>
  );
};

Login.displayName = 'Login';
export default Login;

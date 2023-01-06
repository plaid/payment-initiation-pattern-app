import React, { useState } from 'react';
import Button from 'plaid-threads/Button';

import ModalBody from 'plaid-threads/ModalBody';
import Modal from 'plaid-threads/Modal';
import { useCurrentUser } from '../services';
import TextInput from 'plaid-threads/TextInput';
import { toast } from 'react-toastify';
import { addNewUser } from '../services/api';
const CreateUser: React.FC = () => {
  const [showModal, setShowModalModal] = useState(false);
  const [username, setUsername] = useState('');

  const { login } = useCurrentUser();

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      await addNewUser(username);
      login(username);
      setShowModalModal(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <Button inline={true} onClick={() => setShowModalModal(true)} centered>
        Create User
      </Button>
      <Modal
        isOpen={showModal}
        onRequestClose={() => {
          setShowModalModal(false);
          setUsername('');
        }}
      >
        <>
          <ModalBody
            onClickCancel={() => {
              setShowModalModal(false);
              setUsername('');
            }}
            header="Create User"
            isLoading={false}
            onClickConfirm={handleSubmit}
            confirmText="Submit"
          >
            <TextInput
              id="username"
              label="Username"
              onChange={e => setUsername(e.target.value)}
              value={username}
            />
          </ModalBody>
        </>
      </Modal>
    </>
  );
};

CreateUser.displayName = 'CreateUser';
export default CreateUser;

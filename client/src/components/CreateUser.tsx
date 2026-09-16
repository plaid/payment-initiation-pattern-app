import React, { useState } from 'react';

import Button from './ui/Button';
import Modal from './ui/Modal';
import useCurrentUser from '../services/currentUser.tsx';
import TextInput from './ui/TextInput';
import { toast } from 'react-toastify';
import { addNewUser, getErrorMessage } from '../services/api.tsx';

const CreateUser: React.FC = () => {
  const [showModal, setShowModalModal] = useState(false);
  const [username, setUsername] = useState('');

  const { login } = useCurrentUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      await addNewUser(username);
      login(username);
      setShowModalModal(false);
    } catch (err) {
      toast.error(
        getErrorMessage(err, 'An error occurred while creating user.')
      );
    }
  };

  return (
    <>
      <Button onClick={() => setShowModalModal(true)} className="mr-2">
        Create User
      </Button>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModalModal(false);
          setUsername('');
        }}
        header="Create User"
        isLoading={false}
        onConfirm={handleSubmit}
        confirmText="Submit"
      >
        <TextInput
          id="username"
          label="Username"
          onChange={e => setUsername(e.target.value)}
          value={username}
        />
      </Modal>
    </>
  );
};

CreateUser.displayName = 'CreateUser';
export default CreateUser;

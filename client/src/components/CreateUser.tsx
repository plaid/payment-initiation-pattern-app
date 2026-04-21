import React, { useState } from 'react';

import Button from './ui/Button';
import Modal from './ui/Modal';
import useCurrentUser from '../services/currentUser.tsx';
import TextInput from './ui/TextInput';
import { toast } from 'react-toastify';
import { addNewUser } from '../services/api.tsx';

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
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'An error occurred while creating user.';
      toast.error(errorMessage);
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

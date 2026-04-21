import React, { useState } from 'react';

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
      <button
        onClick={() => setShowModalModal(true)}
        className="inline-flex items-center justify-center px-4 py-[1.2rem] text-[1.6rem] font-semibold text-white bg-black-1000 rounded-threads hover:bg-gray-800 transition-colors mr-2"
      >
        Create User
      </button>
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

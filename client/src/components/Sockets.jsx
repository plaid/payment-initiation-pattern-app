import React, { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

import useCurrentUser from '../services/currentUser.tsx';
import useTerminal from '../services/terminal.tsx';

const VITE_SERVER_PORT = import.meta.env.VITE_SERVER_PORT;

const Sockets = () => {
  const socket = useRef();
  const { terminalAppend } = useTerminal();
  const { state, getUser } = useCurrentUser();

  useEffect(() => {
    socket.current = io(`http://localhost:${VITE_SERVER_PORT}`);

    socket.current.on('TERMINAL', entry => {
      terminalAppend(entry);
    });

    socket.current.on('USER_UPDATED', () => {
      getUser();
    });

    return () => {
      socket.current.removeAllListeners();
      socket.current.close();
    };
  }, [getUser]);

  return <div />;
};

Sockets.displayName = 'Sockets';
export default Sockets;

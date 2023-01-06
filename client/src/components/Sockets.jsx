import React, { useEffect, useRef } from 'react';

import { useCurrentUser } from '../services';
import useTerminal from '../services/terminal';

const io = require('socket.io-client');
const { REACT_APP_SERVER_PORT } = process.env;

const Sockets = () => {
  const socket = useRef();
  const { terminalAppend } = useTerminal();
  const { state, getUser } = useCurrentUser();

  useEffect(() => {
    socket.current = io(`http://localhost:${REACT_APP_SERVER_PORT}`);

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

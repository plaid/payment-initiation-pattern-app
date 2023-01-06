/**
 * @file The application root. Defines the Express server configuration.
 */

const socketIo = require('socket.io');

const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const { errorHandler } = require('./middleware');

const {
  usersRouter,
  sessionsRouter,
  unhandledRouter,
  paymentsRouter,
  webhooksRouter,
} = require('./routes');
const { prettyPrintResponse } = require('./util');
const { axiosInstance } = require('./plaid');

const app = express();

const { PORT } = process.env;

const server = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

const io = socketIo(server);
// middleware to pass socket to each request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Set socket.io listeners.
io.on('connection', socket => {
  console.log('SOCKET CONNECTED');

  socket.on('disconnect', () => {
    console.log('SOCKET DISCONNECTED');
  });
});

axiosInstance.interceptors.request.use(request => {
  io.emit('TERMINAL', {
    data: request.data,
    url: request.url,
    source: 'BACKEND',
    type: 'REQUEST',
    time: Date.now(),
  });
  prettyPrintResponse(request);
  return request;
});

axiosInstance.interceptors.response.use(response => {
  io.emit('TERMINAL', {
    data: JSON.stringify(response.data),
    source: 'BACKEND',
    type: 'RESPONSE',
    time: Date.now(),
  });
  prettyPrintResponse(response);
  return response;
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/users', usersRouter);
app.use('/sessions', sessionsRouter);
app.use('/payments', paymentsRouter);
app.use('/webhooks', webhooksRouter);
app.use('*', unhandledRouter);

// Error handling has to sit at the bottom of the stack.
// https://github.com/expressjs/express/issues/2718
app.use(errorHandler);

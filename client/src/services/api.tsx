import axios from 'axios';

const baseURL = '/';

const api = axios.create({
  baseURL,
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: 0,
  },
});

api.interceptors.response.use(
  response => response,
  error => {
    if (
      error.response.data.message &&
      error.response.status >= 400 &&
      error.response.status < 500
    ) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
);

// login
export const loginUser = (username: string) =>
  api.post('/sessions', { username });

// register
export const addNewUser = (username: string) =>
  api.post('/users', { username });

// user state
export const getUserById = (userId: number) => api.get(`/users/${userId}`);

// payments
export const createPaymentAndLinkToken = (amount: number, accountId: number) =>
  api.post(`/payments/create_link_token`, {
    amount,
    accountId,
  });

export const getUserLinkToken = (userId: number) =>
  api.get(`/payments/user_link_token`, {
    params: {
      userId,
    },
  });

export default api;

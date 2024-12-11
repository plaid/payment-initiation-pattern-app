import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useCallback,
  useEffect,
} from 'react';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { getUserById as apiGetUserById, loginUser } from './api.tsx';
import { UserType } from '../components/types';

interface CurrentUserState {
  userId: number | null;
  user: UserType | null;
}

const localStorageUserId = localStorage.getItem('user_id');
const initialState = {
  userId: localStorageUserId ? Number(localStorageUserId) : null,
  user: null,
};
type CurrentUserAction =
  | {
      type: 'LOGIN';
      userId: number;
    }
  | {
      type: 'GET';
      user: UserType;
    };

interface CurrentUserContextShape extends CurrentUserState {
  login: (username: string) => void;
  getUser: () => void;
  state: CurrentUserState;
}
const CurrentUserContext = createContext<CurrentUserContextShape>(
  initialState as CurrentUserContextShape
);

/**
 * @desc Maintains the currentUser context state and provides functions to update that state
 */
export function CurrentUserProvider(props: any) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const history = useHistory();

  useEffect(() => {
    if (state.user == null && state.userId != null) {
      getUser();
    }
  }, [state.userId, state.user]);

  /**
   * @desc Mimic a user login. In this sample app, for the sake of simplicity:
   * - A user login is mimicked by merely POST'ing a username to a /sessions endpoint.
   * - This means no real user authentication or session management is present.
   * - The currently logged-in user state is maintained by simply persisting the user ID in local storage.
   * - DO NOT copy this in any production setting as it exposes countless attack vectors.
   */
  const login = useCallback(
    async username => {
      try {
        const loginResponse = await loginUser(username);
        dispatch({ type: 'LOGIN', userId: loginResponse.data.id });
        history.push(`/profile`);
        toast.success(`Successful login. Welcome ${username}.`);
      } catch (err: any) {
        toast.error(err.message);
      }
    },
    [dispatch, loginUser, history]
  );

  const getUser = useCallback(async () => {
    if (state.userId == null) {
      return;
    }
    try {
      const getUserResponse = await apiGetUserById(state.userId);
      dispatch({ type: 'GET', user: getUserResponse.data });
    } catch (err: any) {
      toast.error(err.message);
    }
  }, [dispatch, apiGetUserById, state.userId]);

  /**
   * @desc Builds a more accessible state shape from the CurrentUser data. useMemo will prevent
   * these from being rebuilt on every render unless the state is updated in the reducer.
   */
  const value = useMemo(() => {
    return {
      login,
      state,
      getUser,
    };
  }, [login, getUser, state]);

  return <CurrentUserContext.Provider value={value} {...props} />;
}

/**
 * @desc Handles updates to the CurrentUser state as dictated by dispatched actions.
 */
function reducer(state: CurrentUserState, action: CurrentUserAction) {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('user_id', String(action.userId));
      return {
        userId: action.userId,
        user: null,
      };
    case 'GET':
      return {
        userId: state.userId,
        user: action.user,
      };
    default:
      console.warn('unknown action: ', action);
      return state;
  }
}

/**
 * @desc A convenience hook to provide access to the CurrentUsers context state in components.
 */
export default function useCurrentUser() {
  const context = useContext(CurrentUserContext);

  if (!context) {
    throw new Error(`useCurrentUser must be used within a CurrentUserProvider`);
  }

  return context;
}

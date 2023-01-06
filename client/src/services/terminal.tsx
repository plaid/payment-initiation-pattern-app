import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useCallback,
  Dispatch,
} from 'react';
import { TerminalEntryType } from '../components/types';

interface TerminalState {
  entries: TerminalEntryType[];
}

const initialState = {
  entries: [],
};

type TerminalAction = { type: 'APPEND'; entry: TerminalEntryType };

interface TerminalContextShape extends TerminalState {
  dispatch: Dispatch<TerminalAction>;
  terminalState: TerminalState;
  terminalAppend: (entry: TerminalEntryType) => void;
}
const TerminalContext = createContext<TerminalContextShape>(
  initialState as unknown as TerminalContextShape
);

/**
 * @desc Maintains the currentUser context state and provides functions to update that state
 */
export function TerminalProvider(props: any) {
  const [terminalState, dispatch] = useReducer(reducer, initialState);
  /**
   * @desc Requests details for a single User.
   */
  const append = useCallback(entry => {
    dispatch({ type: 'APPEND', entry: entry });
  }, []);

  /**
   * @desc Builds a more accessible state shape from the Users data. useMemo will prevent
   * these from being rebuilt on every render unless usersById is updated in the reducer.
   */
  const value = useMemo(() => {
    return {
      terminalState,
      terminalAppend: append,
    };
  }, [terminalState, append]);

  return <TerminalContext.Provider value={value} {...props} />;
}

/**
 * @desc Handles updates to the Users state as dictated by dispatched actions.
 */
function reducer(state: TerminalState, action: TerminalAction): TerminalState {
  switch (action.type) {
    case 'APPEND':
      const entries = [
        ...state.entries,
        {
          ...action.entry,
          time: new Date(action.entry.time),
        },
      ];
      return {
        entries: entries.sort((a, b) =>
          a.time > b.time ? 1 : b.time > a.time ? -1 : 0
        ),
      };
    default:
      console.warn('unknown action: ', action.type, action.entry);
      return state;
  }
}

/**
 * @desc A convenience hook to provide access to the Users context state in components.
 */
export default function useTerminal() {
  const context = useContext(TerminalContext);

  if (!context) {
    throw new Error(`useUsers must be used within a TerminalProvider`);
  }

  return context;
}

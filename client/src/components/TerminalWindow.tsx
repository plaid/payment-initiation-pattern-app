import React, { useEffect, useRef, useState } from 'react';
import { Button, CodeBlockHighlighted } from 'plaid-threads';
import useTerminal from '../services/terminal.tsx';

interface Props {}

const TerminalWindow: React.FC<Props> = (props: Props) => {
  const { terminalState } = useTerminal();
  const [open, setOpen] = useState(false);
  const bottomRef = useRef<any>();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    // Open on first message
    if (terminalState.entries.length == 1) {
      setOpen(true);
    }
  }, [terminalState, open]);

  return (
    <div className="terminal">
      <Button
        wide={true}
        onClick={() => {
          setOpen(!open);
        }}
        animatedCaret={false}
      >
        Developer Console
      </Button>
      {open ? (
        <div className="entries">
          {terminalState.entries.length == 0 ? (
            <CodeBlockHighlighted
              code={''}
              lang="json"
              wrap={true}
              preChildren={
                <div className="prefix">
                  No logs yet. Try to fund an account by making a payment.
                </div>
              }
            />
          ) : null}
          {terminalState.entries.map(entry => (
            <CodeBlockHighlighted
              key={entry.time.toISOString()}
              code={entry.data || ''}
              lang="json"
              wrap={true}
              preChildren={
                <div className="prefix">
                  [{entry.time.toISOString().substring(11, 23)}
                  ][{entry.source}][{entry.type}] {entry.url}
                </div>
              }
            />
          ))}
          <div ref={bottomRef} />
        </div>
      ) : null}
    </div>
  );
};

TerminalWindow.displayName = 'TerminalWindow';
export default TerminalWindow;

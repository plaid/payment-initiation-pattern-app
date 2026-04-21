import React, { useEffect, useRef, useState } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

SyntaxHighlighter.registerLanguage('json', json);
import useTerminal from '../services/terminal.tsx';

interface Props {}

const TerminalWindow: React.FC<Props> = (props: Props) => {
  const { terminalState } = useTerminal();
  const [open, setOpen] = useState(false);
  const bottomRef = useRef<any>();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (terminalState.entries.length == 1) {
      setOpen(true);
    }
  }, [terminalState, open]);

  return (
    <div className="fixed bottom-[-1px] left-0 right-0 z-[2147483647] rounded-threads shadow-threads lg:w-[56rem] lg:left-auto lg:right-[5.6rem] lg:bottom-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-[1.2rem] text-[1.6rem] font-semibold text-white bg-black-1000 rounded-t-threads hover:bg-gray-800 transition-colors text-left"
      >
        Developer Console
      </button>
      {open ? (
        <div className="bg-black overflow-y-scroll h-[40rem] w-full scrollbar-hide">
          {terminalState.entries.length == 0 ? (
            <div>
              <div className="px-4 pt-2 text-gray-500 text-[1.6rem]">
                No logs yet. Try to fund an account by making a payment.
              </div>
            </div>
          ) : null}
          {terminalState.entries.map(entry => (
            <div
              key={entry.time.toISOString()}
              className="border-t border-gray-800"
            >
              <div className="px-4 pt-2 text-gray-500 text-[1.6rem]">
                [{entry.time.toISOString().substring(11, 23)}
                ][{entry.source}][{entry.type}] {entry.url}
              </div>
              <SyntaxHighlighter
                language="json"
                style={atomOneDark}
                wrapLongLines
                customStyle={{
                  padding: '0.5rem 1rem 1rem 1rem',
                  margin: 0,
                  background: 'transparent',
                  fontSize: '1.6rem',
                }}
              >
                {entry.data || ''}
              </SyntaxHighlighter>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      ) : null}
    </div>
  );
};

TerminalWindow.displayName = 'TerminalWindow';
export default TerminalWindow;

import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import { CurrentUserProvider } from './services/currentUser.tsx';
import { TerminalProvider } from './services/terminal.tsx';

import './app-overrides.css';
import { LearnIcon } from './components/ui/icons';
import Sockets from './components/Sockets.jsx';
import Landing from './components/Landing.tsx';
import Profile from './components/Profile.tsx';
import TerminalWindow from './components/TerminalWindow.tsx';
import OAuth from './components/OAuth.tsx';

function App() {
  toast.configure({
    autoClose: 8000,
    draggable: false,
    toastClassName: 'box toast__background',
    bodyClassName: 'toast__body',
    hideProgressBar: true,
  });

  return (
    <TerminalProvider>
      <TerminalWindow />
      <CurrentUserProvider>
        <Sockets />
        <div className="fixed top-[-1px] right-0 lg:right-[5.6rem] block">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfF4Xev5w9RPGr7fNkSHjmtE_dj0ELuHRbDexQ7Tg2xoo6tQg/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-[1.2rem] text-[1.6rem] font-semibold text-black-1000 border border-gray-400 rounded-threads hover:border-plaid-blue hover:text-plaid-blue transition-colors"
          >
            <LearnIcon className="w-5 h-5 mr-1" />
            &nbsp; Provide feedback
          </a>
        </div>
        <div className="max-w-[120rem] mx-auto px-[4rem] py-[5.6rem] relative h-full lg:relative">
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route path="/profile" component={Profile} />
            <Route path="/oauth-link" component={OAuth} />
          </Switch>
        </div>
      </CurrentUserProvider>
    </TerminalProvider>
  );
}

export default withRouter(App);

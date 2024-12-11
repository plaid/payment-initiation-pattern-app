import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import { CurrentUserProvider } from './services/currentUser.tsx';
import { TerminalProvider } from './services/terminal.tsx';

import './App.scss';
import Button from 'plaid-threads/Button';
import { Learn } from 'plaid-threads';
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
        <div className="feedback">
          <Button
            href="https://docs.google.com/forms/d/e/1FAIpQLSfF4Xev5w9RPGr7fNkSHjmtE_dj0ELuHRbDexQ7Tg2xoo6tQg/viewform"
            target="_blank"
            rel="noopener noreferrer"
            inline
            centered
            secondary
          >
            <Learn />
            &nbsp; Provide feedback
          </Button>
        </div>
        <div className="App">
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

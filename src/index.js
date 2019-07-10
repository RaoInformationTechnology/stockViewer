import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Router} from 'react-router-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Signup from './components/Sign-up';
import Login from './components/Login';
import Companylist from './components/Company-list';
import createHistory from 'history/createBrowserHistory'

const history = createHistory({
        hashType: '#' // the default
      });
      
ReactDOM.render(
                 <HashRouter  history={history}>
                        <div>
                                <Route exact path='/' component={App} />
                                <Route path='/sign-up' render={() => (localStorage.getItem('email1') ? (<Route component={Companylist} />)
                                        : (<Route component={Signup} />)
                                )} />
                                <Route path='/login' render={() => (localStorage.getItem('email1') ? (<Route component={Companylist} />)
                                        : (<Route component={Login} />)
                                )} />
                                <Route path='/Company-list' render={() => (localStorage.getItem('email1') ? (<Route component={Companylist} />)
                                        : (<Route component={Login} />)
                                )} />
                                 <Route path='/Watch-list' render={() => (localStorage.getItem('email1') ? (<Route component={Companylist} />)
                                        : (<Route component={Login} />)
                                )} />
                        </div>
                </HashRouter>,
        document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

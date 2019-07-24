import React, { Component } from 'react';
import Login from './components/Login';
import Companylist from './components/Company-list';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = localStorage.getItem('email1');
  }

  render() {
    if (!this.state) {
      return (
        <div>
          <Login />
        </div>
      );
    } else {
      return (
        <div>
          <Companylist />
        </div>
      );
    }
  }
}

export default App;

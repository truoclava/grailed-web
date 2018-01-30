import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import NavBar from './Components/NavBar.js';
import LoginSignup from './Components/LoginSignup.jsx';
import Messenger from './Components/Messenger.jsx';

import cookie from 'react-cookies'
import _ from 'lodash';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      conversations: [],
      user: null,
      signUp: false,
      messages: []
    };
  }

  componentWillMount() {
    let token = cookie.load('token');
    var state = this.state;
    if (token && localStorage.user) {
      this.state = _.merge({}, state, {authenticated: true, user: JSON.parse(localStorage.user)});
    } else {
      this.state = _.merge({}, state, {initialLoad: false, authenticated: false});
    }
  }

  handleSignOut() {
    this.setState({authenticated: false, user: null});
    localStorage.removeItem('user');
    cookie.remove('token');
    location.reload();
  }

  handleLoginSuccess(user) {
    this.setState({authenticated: true, user: user});
  }

  handleToggleSignUp() {
    this.setState({signUp: !this.state.signUp});
  }

  handleConvSuccess(conversations) {
    this.setState({conversations: conversations, messages: []});
  }

  renderLoginSignup() {
    if (!this.state.authenticated) {
      return (
        <LoginSignup
          signUp={this.state.signUp}
          onLoginSuccess={this.handleLoginSuccess.bind(this)}
        />
      );
    }

    return '';
  }

  renderWelcome() {
    let text = this.state.authenticated ? `Welcome to messaging, ${this.state.user.name}!` : 'Login or Signup to Message!'

    return (
      <h2 className="welcome_message">{text}</h2>
    );
  }

  renderMessenger() {
    if (this.state.authenticated && this.state.conversations.length > 0) {
      return (
        <Messenger
          user={this.state.user}
          messages={this.state.messages}
          conversations={this.state.conversations}
        />
      );
    }

    return '';
  }


  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Grailed Chat App</h2>
        </div>
        <div className="app_body">
          <NavBar
            authenticated={this.state.authenticated}
            onSignOut={this.handleSignOut.bind(this)}
            onToggleSignUp={this.handleToggleSignUp.bind(this)}
            signUp={this.state.signUp}
            onConvSuccess={this.handleConvSuccess.bind(this)}
          />
          {this.renderWelcome()}
          {this.renderLoginSignup()}
          {this.renderMessenger()}
        </div>
      </div>
    );
  }
}

export default App;

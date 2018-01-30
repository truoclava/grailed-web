import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { Link } from 'react-router'
import axios from 'axios';

import '../Styles/NavBar.css';

class NavBar extends Component {
  static propTypes = {
    authenticated: PropTypes.bool,
    onSignOut: PropTypes.func,
    onToggleSignUp: PropTypes.func,
    signUp: PropTypes.bool,
    onConvSuccess: PropTypes.func
  };

  loadConversations() {
    axios.get('/api/v1/conversations')
      .then( (response) => {
        if (response.data.conversations) {
          this.props.onConvSuccess(response.data.conversations);
        }
      })
      .catch( (error) => {
        console.log(error);
      });
  }

  onToggleSignUp() {
    if (this.props.onToggleSignUp) {
      this.props.onToggleSignUp();
    }
  }

  onSignOut() {
    if (this.props.onSignOut) {
      this.props.onSignOut();
    }
  }

  render() {
    if (this.props.authenticated) {
      return (
        <ul className="nav_bar flex_row">
          <li onClick={this.loadConversations.bind(this)}>Messages</li>
          <li onClick={this.onSignOut.bind(this)}>
            Sign Out
          </li>
        </ul>
      );
    }

    let text = this.props.signUp ? 'Log In' : 'Sign Up';

    return (
      <ul className="nav_bar signed_out flex_row">
        <li onClick={this.onToggleSignUp.bind(this)}>
          {text}
        </li>
      </ul>
    );
  }


}

export default NavBar;

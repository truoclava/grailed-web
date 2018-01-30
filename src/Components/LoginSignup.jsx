import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import cookie from 'react-cookies'

class LoginSignup extends React.Component {
  static propTypes = {
    onLoginSuccess: PropTypes.func,
    signUp: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null,
      password: null,
      errorMessage: null
    };
  }

  _login(data) {
    let token = data.token.token;
    if (token) {
      this.setState({
        user: data.user,
        token: token,
        authenticated: true
      });
      let expiresAt = new Date(data.token.expires_at);
      cookie.save('token', token, {expires: expiresAt});
      localStorage.setItem('user', JSON.stringify(data.user));
    }
  }

  handleNameChange(e) {
    let value = e.target.value;
    this.setState({name: value});
  }

  handleEmailChange(e) {
    let value = e.target.value;
    this.setState({email: value});
  }

  handlePasswordChange(e) {
    let value = e.target.value;
    this.setState({password: value});
  }

  handleSignUp(e) {
    if (e) {
      e.preventDefault();
    }
    axios.post('/api/v1/users', {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password
      })
      .then( (response) => {
        if (response.data.token) {
          this._login(response.data);
          this.props.onLoginSuccess(response.data.user);
        }
      })
      .catch( (error) => {
        this.setState({errorMessage: error.response.data})
      });
  }

  handleLogin(e) {
    if (e) {
      e.preventDefault();
    }
    axios.post('/api/v1/login', {
        email: this.state.email,
        password: this.state.password
      })
      .then( (response) => {
        if (response.data.token) {
          this._login(response.data);
          this.props.onLoginSuccess(response.data.user);
        }
      })
      .catch( (error) => {
        console.log(error);
      });
  }

  renderForm() {
    if (this.props.signUp) {
      return (
        <div className="signup_form">
          <form onSubmit={this.handleSignUp.bind(this)}>
            <input type="name" name="name" placeholder="Name" onChange={this.handleNameChange.bind(this) }/>
            <input type="email" name="email" placeholder="Email" onChange={this.handleEmailChange.bind(this) }/>
            <input type="password" name="password" placeholder="Password" onChange={this.handlePasswordChange.bind(this) } />
            <button type="submit" className="btn black_btn">
              Sign Up
            </button>
          </form>
        </div>
      );
    }

    return (
      <div className="login_form">
        <form onSubmit={this.handleLogin.bind(this)}>
          <input placeholder="Email" type="email" name="email" onChange={this.handleEmailChange.bind(this) }/>
          <input placeholder="Password" type="password" name="password" onChange={this.handlePasswordChange.bind(this) } />
          <button type="submit" className="btn black_btn">
            Login
          </button>
        </form>
      </div>
    );
  }

  render() {
    let headerText = this.props.signUp ? 'Sign Up' : 'Log In';

    return (
      <div className="login_signup_form">
        <div className="header">{headerText}</div>
        {this.renderForm()}
        <div className="error_message">{this.state.errorMessage}</div>
      </div>
    );


  }
}

export default LoginSignup;

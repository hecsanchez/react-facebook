import React, { Component } from 'react';
import logo from './logo.svg';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom'

const App = () => (
  <Router>
    <div>
      <AuthButton/>
      <Route exact path="/" component={Public}/>
      <Route path="/login" component={Login}/>
    </div>
  </Router>
)

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true

    setTimeout(cb, 100) // fake async
  },
  signout(cb) {
      localStorage.user = '';
    this.isAuthenticated = false
    setTimeout(cb, 100)
  }
}

const AuthButton = withRouter(({ history }, { component: Component, ...rest }) => (
    <Route {...rest} render={props => (
      localStorage.user ? (
          <p>
            <button onClick={() => {
              fakeAuth.signout(() => history.push('/'))
            }}>Sign out</button>
          </p>
      ) : (
        <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }}/>
      )
    )}/>
))

const Public = () => <h3>Public</h3>

let email;
let password;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.user = {};
    this.handleFieldChanged = this.handleFieldChanged.bind(this);
    this.login = this.login.bind(this);
    // This binding is necessary to make `this` work in the callback
    // this.login = this.login.bind(this);
      localStorage.user ? (
          <Redirect to={{
            pathname: '/',
            state: { from: props.location }
          }}/>
      ) : (
        <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }}/>
      )

  }

  state = {
    redirectToReferrer: false
  }

  login(event) {
    event.preventDefault();
    var user = {
        email: email,
        password: password
    }

    if (user.email.length > 0 && user.password.length > 0) {
        fakeAuth.authenticate(() => {
          this.setState({ redirectToReferrer: true })

          localStorage.user = JSON.stringify(user);
          console.log(localStorage.user);
        })
    } else {
        <Redirect to={{
          pathname: '/login',
          state: { }
        }}/>
    }

  }

  handleFieldChanged(event) {
      const emailPattern = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;

      if (event.target.name == 'email') {
          if(event.target.value.length === 0){
             this.setState({  emailError : 'The email address field can\'t be empty' })
          } else if (!emailPattern.test(event.target.value)) {
             this.setState({  emailError : 'Enter a valid email address' })
          } else {
              this.setState({  emailError : '' })
              email = event.target.value;
          }

      } else if (event.target.name == 'password'){
          if(event.target.value.length === 0) {
              this.setState({  passwordError : 'You need to specify a password' })
          } else {
              this.setState({  passwordError : '' })
              password = event.target.value;
          }
      }

  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    const { redirectToReferrer } = this.state

    if (redirectToReferrer) {
      return (
        <Redirect to={from}/>
      )
    }

    return (
        <div id="container" className="container-fluid">
            <div className="row">
                <div className="col col-md-6 full-height col-bg col-ab-left"></div>
                <div className="col col-md-6 full-height">
                    <div className="form-container">
                        <div className="button--container alt">
                            <a href="#" className="button button--alt">Sign up</a>
                        </div>
                        <div className="logo">
                            <span className="icon-facebook"></span>
                        </div>
                        <div className="login">
                            <h1>Sign in</h1>
                            <div id="login">
                                <form method="post" className="form--login" onSubmit={this.login}>
                                    <input className={this.state.emailError ? 'error' : ''} type="text" name="email" placeholder="Email" onBlur={this.handleFieldChanged} />
                                    <span>{this.state.emailError}</span>
                                    <input className={this.state.passwordError ? 'error' : ''}  type="password" name="password" placeholder="Password" onBlur={this.handleFieldChanged} />
                                    <span>{this.state.passwordError}</span>
                                    <input className="button button--blue" type="submit" value="Sign in" />
                                </form>
                            </div>
                            <a href="#" className="link">Forgotten account?</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
  }
}

export default App

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
    localStorage.posts = '';
    this.isAuthenticated = false
    setTimeout(cb, 100)
  }
}

const AuthButton = withRouter(({ history }, { component: Component, ...rest }) => (
    <Route {...rest} render={props => (
      localStorage.user ? (
          <header className="header">
              <div id="container" className="container-fluid">
                  <div className="row">
                      <div className="col col-md-3">
                        <div className="logo-container">
                            <span className="icon-facebook"></span>
                            <div className="toggle-trigger">
                                <span className="user-name">Hector Sánchez</span>
                                <div className="caret"></div>
                            </div>
                            <div className="toggle">
                              <button onClick={() => {
                                fakeAuth.signout(() => history.push('/'))
                              }}>Sign out</button>
                            </div>
                        </div>
                      </div>
                      <div className="col col-md-6">
                          <div className="post-container">

                          </div>
                      </div>
                      <div className="col col-md-3"></div>
                  </div>
              </div>
          </header>
      ) : (
        <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }}/>
      )
    )}/>
))

class Posts extends React.Component {
  constructor(props) {
    super(props);
    console.log('this', this)
    this.state = {
      editing: ''
    }
  }

  edit(e) {
    console.log('this()', this)
    this.state = {
      editing: 'editing'
    }
  }

  autoSave(e) {
    this.state = {
      textpost: e.target.value,
    };
  }

  save(e) {
    e.preventDefault()
    this.state = {
      editing: ''
    }

  }

  remove(e) {
    console.log('Delete()', e)
  }

  render() {
      var content;
      var Posts = this;
      var state = this.state.editing;

      console.log('this.state', this.state)
      if (this.props.items.length > 0) {
          // console.log('this.props.items', this.props.items)
        var posts = [...this.props.items];
        posts.sort((a,b) => b.id - a.id);
        content = posts.map(function(item, i) {
          if (item.text && item.img ) {
            return (
              <div className="post" key={i}>
                <div className="post__img">
                  <img src={item.img}/>
                </div>
                <div className="post__text" style={state === 'editing' ? {display:"none"} : {display:"block"}}>
                  <p>{item.text}</p>
                </div>
                <div className="post__textarea" style={state === '' ? {display:"none"} : {display:"block"}}>
                  <form onSubmit={Posts.save}>
                    <textarea ref="textarea" onInput={Posts.autoSave}>{item.text}</textarea>
                    <button type="submit" className="button button--save">Update</button>
                  </form>
                </div>
                <div className="actions">
                 <a href="#" className="edit" onClick={Posts.edit(i)}>Edit</a>
                 <a href="#" className="delete" onClick={Posts.remove(i)}>Delete</a>
                 </div>
              </div>)
          } else if (item.text && !item.img ) {
            return (
              <div className="post" key={i}>
                <div className="post__text">
                  <p>{item.text}</p>
                </div>
                <div className="actions">
                 <a href="#" className="edit" onClick={Posts.edit(i)}>Edit</a>
                 <a href="#" className="delete" onClick={Posts.remove(i)}>Delete</a>
                 </div>
              </div>)
            } else if (item.img && !item.text ) {
              return (
                <div className="post" key={i}>
                  <div className="post__img">
                    <img src={item.img}/>
                  </div>
                  <div className="actions">
                   <a href="#" className="edit" onClick={Posts.edit(i)}>Edit</a>
                   <a href="#" className="delete" onClick={Posts.remove(i)}>Delete</a>
                   </div>
                </div>)
            }

        })
      } else {
        content = <div className="post" item="No content Available!" />
      }

      return (
          <div className="posts">
              {content}
          </div>
      )
  }
}

class Public extends React.Component {
    constructor(props) {
      super(props);
        // This binding is necessary to make `this` work in the callback
        this.state = {
          file: '',
          imagePreviewUrl: '',
          buttonClass: "button button--round button--privacy button--Friends",
          privacy: "Friends"
        };
        localStorage.user ? (
            console.log('All good')
        ) : (
          <Redirect to={{
            pathname: '/login',
            state: { from: props.location }
          }}/>
        )

        if (localStorage.posts && localStorage.posts.length > 0) {
          console.log('localStorage', JSON.parse(localStorage.posts))
        } else {
          var posts = []
          var post = {
            "text": "",
            "img": ""
          }
          posts.push(post)
          localStorage.posts = JSON.stringify(posts)
          console.log('No posts found on localStorage', JSON.parse(localStorage.posts))
        }

    }

    autoResize(e) {
      // console.log(e);
      e.target.style.overflowY = 'hidden'
      e.target.style.height = 'auto'
      e.target.style.height = e.target.scrollHeight+'px'
      this.setState({
        textpost: e.target.value,
      });
    }

    _handleImageChange(e) {
       e.preventDefault();

       let reader = new FileReader();
       let file = e.target.files[0];

       reader.onloadend = () => {
         this.setState({
           file: file,
           imagePreviewUrl: reader.result
         });
       }

       reader.readAsDataURL(file)
     }

     selectPrivacy(e) {
       var value = e.currentTarget.textContent
       this.setState({
         privacy: value,
         buttonClass: "button button--round button--privacy button--" + e.currentTarget.textContent
       });
     }

    post(event) {
      event.preventDefault();
      if (this.state.textpost || this.state.imagePreviewUrl) {
        var newPosts = JSON.parse(localStorage.posts)
        var post = {
            "text":this.state.textpost,
            "img": this.state.imagePreviewUrl,
            "id": newPosts.length + 1,
            "privacy": this.state.privacy
        }
        this.setState({
          recentPost: JSON.stringify(post),
          textpost: null,
          imagePreviewUrl: null
        });
        this.refs.text.value = '';

        newPosts.push(post)
        localStorage.posts = JSON.stringify(newPosts)
        // console.log('posts', localStorage.posts)

      } else {
        alert('There is no content to post')
      }

    }

    render() {
      let {imagePreviewUrl} = this.state;
      let $imagePreview = null;
      if (imagePreviewUrl) {
        $imagePreview = (<img src={imagePreviewUrl} />);
      } else {
        $imagePreview = (<div></div>);
      }

      return (
          <div id="container" className="container-fluid">
              <div className="row">
                  <div className="col col-md-3 full-height"></div>
                  <div className="col col-md-6 full-height">
                      <div className="post-container">
                          <div className="avatar"><img src="img/avatar.jpeg" /></div>
                          <form method="post" className="form--post" onSubmit={this.post.bind(this)}>

                              <div className="textarea">
                                <textarea className="post__content" placeholder="What's on your mind?" onInput={this.autoResize.bind(this)} ref="text"></textarea>
                                <input type="file" className="input--file" name="file" id="file" onChange={(e)=>this._handleImageChange(e)}/>
                                <div className="imgPreview">
                                  {$imagePreview}
                                </div>
                              </div>
                              <div className="button-group">
                                <button className={this.state.buttonClass}  name="privacy" value={this.state.privacy}><div className="caret"></div></button>
                                <div className="select">
                                  <div className={this.state.privacy === 'Friends' ? "option option--selected" : "option" } onClick={this.selectPrivacy.bind(this)}>Friends</div>
                                  <div className={this.state.privacy === 'Public' ? "option option--selected" : "option" } onClick={this.selectPrivacy.bind(this)}>Public</div>
                                </div>
                                  <label htmlFor="file" className="file-label button--round button--img"></label>
                                  <button className="button button--round button--post" type="submit" value="Post"></button>
                              </div>
                          </form>
                      </div>
                      <div className="posts-list">
                        <Posts items={localStorage.posts ? JSON.parse(localStorage.posts) : ''} />
                      </div>
                    </div>
                  <div className="col col-md-3"></div>
              </div>
          </div>
      )
    }
}

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

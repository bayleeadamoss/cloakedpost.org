import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import Editor from 'react-medium-editor'

require('../css/style.scss')
require('medium-editor/dist/css/medium-editor.css')
require('medium-editor/dist/css/themes/default.css')

class App extends Component {
  render() {
    return (
      <div>
        <div className='content'>
          {this.props.children}
        </div>
      </div>
    )
  }
}

class Home extends Component {
  render() {
    return (
      <div>
        Home
      </div>
    )
  }
}

class Post extends Component {
  render() {
    return (
      <div>
        a post!
      </div>
    )
  }
}

class CreatePost extends Component {
  render() {
    return (
      <div>
        <Editor />
      </div>
    )
  }
}

const routes = (
  <Router history={hashHistory}>
    <Route path='/' component={App}>
      <IndexRoute component={Home} />
      <Route path='/post/new' component={CreatePost}/>
      <Route path='/post/:id' component={Post}/>
    </Route>
  </Router>
)

render(routes, document.getElementById('react'))

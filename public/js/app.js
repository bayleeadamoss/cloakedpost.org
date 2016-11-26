import React, { Component } from 'react'
import { render } from 'react-dom'
import { Link, Router, Route, IndexRoute, browserHistory } from 'react-router'
import Editor from 'react-medium-editor'
import moment from 'moment'

require('../css/style.scss')
require('medium-editor/dist/css/medium-editor.css')
require('medium-editor/dist/css/themes/default.css')

class Header extends Component {
  render() {
    return (
      <header>
        <div className='wrapper'>
          <h1><Link to='/'>Light Medium</Link></h1>
          <ul>
            <li className='new'><Link to='/post/new' activeClassName='active'>Create</Link></li>
            <li className='search'><Link to='/search' activeClassName='active'>Search</Link></li> <li className='github'><a target='_blank' href='https://github.com'>GitHub</a></li>
          </ul>
        </div>
      </header>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <div className='content'>
          <div className='wrapper'>
            {this.props.children}
          </div>
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
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor (props, context) {
    super(props, context)
    this.state = {
      error: false,
      post: null,
    }
  }

  componentWillMount () {
    const { id } = this.context.router.params
    fetch(`/post/${id}`, {
      method: 'GET',
      headers: new Headers({
        'Accept': 'application/json',
      }),
    }).then((res) => {
      return res.json()
    }).then(({ post }) => {
      this.setState({
        post,
      })
    }).catch(() => {
      this.setState({
        error: true,
      })
    })
  }

  render() {
    const { post } = this.state
    return (
      <div>
        { post && (
          <article>
            <h1>{post.title}</h1>
            <p className='credentials'>
              <span className='name'>{post.name}</span>
              <span className='key' title={post.passkey}>{post.passkey.substr(0,7)}</span>
              <span className='date'>{moment(post.createdAt).format('LL')}</span>
            </p>
            <div dangerouslySetInnerHTML={{__html: post.content}} />
          </article>
        )}
        { this.state.error && (
          <h1>Post not found</h1>
        )}
      </div>
    )
  }
}

class Search extends Component {
  render() {
    return (
      <div>
        Search
      </div>
    )
  }
}

class CreatePost extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor (props, context) {
    super(props, context)
    this.state = {
      title: '',
      name: '',
      story: '',
    }
  }

  handleTitleChange = (title) => {
    this.setState({
      title,
    })
  }

  handleNameChange = (name) => {
    this.setState({
      name,
    })
  }

  handleContentChange = (content) => {
    this.setState({
      content,
    })
  }

  handlePublish = () => {
    fetch('/post', {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then((response) => {
      return response.json()
    }).then(({id}) => {
      this.context.router.push({
        pathname: `/post/${id}`,
      })
    })
  }

  render() {
    return (
      <div>
        <Editor
          text={this.state.title}
          onChange={this.handleTitleChange}
          options={{placeholder: { text: 'Title' }, disableReturn: true, toolbar: {buttons: []}}}
          tag='h1'/>
        <Editor
          text={this.state.name}
          onChange={this.handleNameChange}
          options={{placeholder: { text: 'Your name' }, disableReturn: true, toolbar: {buttons: []}}}
          tag='p'/>
        <Editor
          text={this.state.content}
          onChange={this.handleContentChange}
          options={{placeholder: { text: 'Your story...' }}}
          tag='p'/>
        <button onClick={this.handlePublish}>Publish</button>
      </div>
    )
  }
}

const routes = (
  <Router history={browserHistory}>
    <Route path='/' component={App}>
      <IndexRoute component={Home} />
      <Route path='/post/new' component={CreatePost}/>
      <Route path='/post/:id' component={Post}/>
      <Route path='/search' component={Search}/>
      <Route path='/search/:search' component={Search}/>
    </Route>
  </Router>
)

render(routes, document.getElementById('react'))

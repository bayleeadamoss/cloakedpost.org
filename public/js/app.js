import React, { Component } from 'react'
import { render } from 'react-dom'
import { Link, Router, Route, IndexRoute, browserHistory } from 'react-router'
import Editor from 'react-medium-editor'
import moment from 'moment'

require('../css/style.scss')
require('medium-editor/dist/css/medium-editor.css')
require('medium-editor/dist/css/themes/default.css')

class StaySafe extends Component {
  render () {
    return (
      <article>
        <h2>Stay Safe</h2>
        <p>Use the <a target='_blank' href='https://www.torproject.org/projects/torbrowser.html.en'>Tor Browser</a> to keep your identity anonymous online.</p>
        <h2>Trip Codes</h2>
        <p>Trip codes can help you maintain continuity over posts and comments, without registering. To use trip codes simply, place a hash sign (<i>"#"</i>) followed by a word or short phrase after your name.</p>
        <p>For example if you put your name as <i>'lolcat#password'</i> will turn into the name <i>'lolcat'</i> with the hash <i>'b109f3b'</i> attached to it. If both the name and hash are the same, you can be reasonably sure you are talking to the same user.</p>
        <h2>Privacy</h2>
        <p>This site does NOT contain any tracking software, or use cookies. It does record the date of the post, but it does not record the times of posts or any other information about the posts other than what you type in.</p>
        <p>Even with the best software, avoid giving away hints about your identify like locations or unique names of people you might talk about.</p>
        <p>The software running this blog is open source on <a target='_blank' href='https://github.com/tinytacoteam/cloakedpost.org'>GitHub</a></p>
      </article>
    )
  }
}

class Header extends Component {
  render () {
    return (
      <header>
        <div className='wrapper'>
          <h1><Link to='/'>Cloaked Post</Link></h1>
          <ul>
            <li className='new'><Link to='/post/new' activeClassName='active'>Create</Link></li>
            <li className='github'><a target='_blank' href='https://github.com/tinytacoteam/cloakedpost.org'>GitHub</a></li>
          </ul>
        </div>
      </header>
    )
  }
}

class App extends Component {
  render () {
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

class Excerpt extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    passkey: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    content: React.PropTypes.string.isRequired,
    createdAt: React.PropTypes.string.isRequired,
  }

  handleClick = () => {
    this.context.router.push({
      pathname: `/post/${this.props.id}`,
    })
  }

  render () {
    return (
      <article onClick={this.handleClick} className='excerpt'>
        <h1>{this.props.title}</h1>
        <p className='credentials'>
          <span className='name'>{this.props.name}</span>
          <span className='key' title={this.props.passkey}>{this.props.passkey.substr(0,7)}</span>
          <span className='date'>{moment(this.props.createdAt).format('LL')}</span>
        </p>
        <div dangerouslySetInnerHTML={{__html: this.props.content}} />
      </article>
    )
  }
}

class Home extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      loading: true,
    }
  }

  componentWillMount () {
    fetch('/post', {
      headers: new Headers({
        'Accept': 'application/json',
      }),
    }).then((res) => {
      return res.json()
    }).then(({ posts }) => {
      this.setState({
        loading: false,
        posts,
      })
    }).catch(() => {
      this.setState({
        loading: false,
        error: true,
      })
    })
  }

  render() {
    if (this.state.loading) {
      return <div className='loader'>Loading...</div>
    }

    return (
      <div className='home'>
        <div id='stay-safe'>
          <StaySafe />
        </div>
        <ul id='articles'>
          { this.state.posts.map((post) => {
            return (
              <li key={post.id}>
                <Excerpt
                  id={post.id}
                  name={post.name}
                  passkey={post.passkey}
                  title={post.title}
                  content={post.content}
                  createdAt={post.createdAt} />
              </li>
            )
          })}
        </ul>
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
      loading: true,
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
        loading: false,
        post,
      })
    }).catch(() => {
      this.setState({
        loading: false,
        error: true,
      })
    })
  }

  render() {
    if (this.state.loading) {
      return <div className='loader'>Loading...</div>
    }
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

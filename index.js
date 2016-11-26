const express = require('express')
const app = express()
const hash = require('hash.js')
const sanitizeHtml = require('sanitize-html')

const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './data/mydb.sqlite'
  }
})

function validateId (id) {
  if (id === id.replace(/[^a-z0-9]/g, '')) {
    return id
  }
  throw Error('The field `postId` is invalid.')
}

function cleanTitle (title) {
  return sanitizeHtml(html, { allowedTags: [] })
}

function cleanContent (title) {
  return sanitizeHtml(html, { allowedTags: [] })
}

function hashPasskey (passkey) {
  return hash.sha512().update(passkey).digest('hex')
}

app.use(express.static('public'))
app.set('view engine', 'pug')

app.get('/', function (req, res) {
  res.render('index', {
    pageTitle: 'Meow',
    canonical: 'wattttt',
  })
})

app.get('/post/:id/:title*?', function (req, res) {
  const post = knex('posts')
    .select()
    .where({
      id: validateId(req.params.id)
    })
    .limit(1)
  const replies = knex('replies')
    .select()
    .where({
      id: validateId(req.params.id)
    })
  res.json({
    post,
    replies,
  })
})

app.post('/post', function (req, res) {
  const id = knex('posts').insert({
    name: cleanTitle(req.query.name),
    passkey: hashPasskey(req.query.passkey),
    title: cleanTitle(req.query.title),
    content: cleanContent(req.query.content),
    created_at: Date.now(),
  })
  .returning('id')
  res.sendStatus(201)
  res.json({
    id,
  })
})

app.post('/post/:id/comment', function (req, res) {
  const id = knex('replies').insert({
    post_id: validateId(req.params.id),
    name: cleanTitle(req.query.name),
    passkey: hashPasskey(req.query.passkey),
    content: cleanTitle(req.query.content),
    created_at: Date.now(),
  })
  res.sendStatus(201)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

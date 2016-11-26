const express = require('express')
const app = express()
const hash = require('hash.js')
const sanitizeHtml = require('sanitize-html')
const knex = require('knex')(require('./knexfile').development)
const _ = require('lodash')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json({type: '*/*'})

function validateId (id) {
  if (id.match(/^[a-z0-9]+$/)) {
    return id
  }
  throw Error('The field `postId` is invalid.')
}

function cleanTitle (title) {
  return sanitizeHtml(title, { allowedTags: [] })
}

function cleanContent (title) {
  return sanitizeHtml(title)
}

function hashPasskey (passkey) {
  return hash.sha512().update(passkey).digest('hex')
}

function today () {
  return new Date(new Date().toDateString())
}

function generateId (length = 15) {
  const chars = []
  const possible = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const possibleLen = possible.length
  for (let i = 0; i < length; i++) {
    chars.push(possible.charAt(Math.floor(Math.random() * possibleLen)))
  }

  return chars.join('');
}

app.use(express.static('public'))
app.set('view engine', 'pug')

app.get('/', function (req, res) {
  res.render('index')
})

app.get('/post/:id/:title*?', (req, res) => {
  if (req.accepts('html')) {
    return res.render('index')
  }
  const post = knex('posts')
    .select()
    .where({
      id: validateId(req.params.id)
    })
    .limit(1)
    .then(([post]) => {
      if (_.isEmpty(post)) {
        return res.sendStatus(404)
      }
      res.json({
        post,
      })
    }).catch((err) => {
      res.sendStatus(500)
    })
})

app.post('/post', jsonParser, (req, res) => {
  const [name, passkey] = (req.body.name || 'anonymous').split('#')
  knex('posts').insert({
    id: generateId(15),
    name: cleanTitle(name),
    passkey: hashPasskey(passkey),
    title: cleanTitle(req.body.title),
    content: cleanContent(req.body.content),
    createdAt: new Date(),
  })
  .returning('id')
  .then(([id]) => {
    res.status(201).json({
      id,
    })
  }).catch((err) => {
    console.log(err)
    res.sendStatus(500)
  })
})

app.post('/post/:id/comment', jsonParser, (req, res) => {
  knex('replies').insert({
    id: generateId(20),
    post_id: validateId(req.params.id),
    name: cleanTitle(req.params.name),
    passkey: hashPasskey(req.params.passkey),
    content: cleanTitle(req.params.content),
    createdAt: new Date(),
  }).then(() => {
    res.sendStatus(201)
  }).catch(() => {
    res.sendStatus(500)
  })
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

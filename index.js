const express = require('express')
const app = express()
const hash = require('hash.js')
const sanitizeHtml = require('sanitize-html')
const ENV = process.env.NODE_ENV || 'development'
const knex = require('knex')(require('./knexfile')[ENV])
const _ = require('lodash')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json({type: '*/*'})
const CLOAK_SALT = process.env.CLOAK_SALT || 'EtC9szrmx4HDAZg35aW2x4RtwqW3eL7H03I'
const TorTest = require('tor-test')
const os = require("os")

function validateId (id) {
  if (id.match(/^[a-z0-9]+$/)) {
    return id
  }
  throw Error('The field `postId` is invalid.')
}

function cleanTitle (title) {
  return sanitizeHtml(title, { allowedTags: [] })
}

function cleanContent (content) {
  return sanitizeHtml(content)
}

function hashPasskey (passkey = '') {
  return hash.sha512().update(CLOAK_SALT + passkey).digest('hex')
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

const maybeHtml = (req, res, next) => {
  if (req.accepts('html') && req.method.match(/get/i)) {
    return res.render('index')
  }
  next()
}

app.get('/', maybeHtml, (req, res) => {
  return res.render('index')
})

app.get('/status', (req, res) => {
  exec('git rev-parse HEAD', (error, revision, stderr) => {
    if (error) revision = 'unknown'
    res.json({
      env: ENV,
      hostname: os.hostname(),
      root: process.cwd(),
      revision: revision.trim()
    })
  })
})

app.get('/post', maybeHtml, (req, res) => {
  knex('posts')
    .select()
    .orderBy('createdAt', 'DESC')
    .orderByRaw('RANDOM()')
    .limit(10)
    .then((posts) => {
      res.json({
        posts,
      })
    }).catch((err) => {
      res.status(500).send(err.message)
    })
})

const thirtyMinutes = 30 * 60000
let lastChecked = 0

app.get('/istor', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  let force = false
  if (lastChecked + thirtyMinutes < Date.now()) {
    lastChecked = Date.now()
    force = true
  }
  TorTest.isTor(ip, force, (err, isTor) => {
    res.json({
      isTor,
    })
  })
})


app.get('/post/:id/:title*?', maybeHtml, (req, res) => {
  knex('posts')
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
      res.status(500).send(err.message)
    })
})

app.post('/post', jsonParser, (req, res) => {
  const [name, passkey] = (req.body.name || 'anonymous').split('#')
  // Agreement
  if (!req.body.agreed) {
    return res.status(401).send('Agree to the terms.')
  }

  // Minimum content
  const title = cleanTitle(req.body.title)
  const content = cleanContent(req.body.content)
  if (title.length < 1) return res.status(406).send('Title is required.')
  console.log('content', content.length, content)
  if (content.length < 1) return res.status(406).send('Content is required.')

  // Insert
  knex('posts').insert({
    id: generateId(15),
    name: cleanTitle(name),
    passkey: hashPasskey(passkey),
    title: title,
    content: content,
    createdAt: new Date(),
  })
  .returning('id')
  .then(([id]) => {
    res.status(201).json({
      id,
    })
  }).catch((err) => {
    res.status(500).send(err.message)
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
  }).catch((err) => {
    res.status(500).send(err.message)
  })
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!', ENV)
})

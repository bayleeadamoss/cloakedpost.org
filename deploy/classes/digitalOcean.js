const moment = require('moment')
const https = require('https')
const doUntil = require('../lib/doUntil')
const generateNames = require('../lib/generateNames')

// const CURRENT_TAG = 'CLOAKEDPOST-' + moment().format('YYYY-M-DD-H-mm-ss')
const CURRENT_TAG = 'CLOAKEDPOST-meow'
const DIGITALOCEAN_TOKEN = process.env.DIGITALOCEAN_TOKEN || 'no-digitalocean-token'

const fetch = (method, path, data = {}) => {
  const body = JSON.stringify(data)
  return new Promise((resolve, reject) => {
    if (!DIGITALOCEAN_TOKEN) {
      return reject('No digital ocean token: DIGITALOCEAN_TOKEN')
    }
    const options = {
      hostname: 'api.digitalocean.com',
      port: 443,
      path: path,
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + DIGITALOCEAN_TOKEN,
      },
    }
    const req = https.request(options, (res) => {
      const response = []
      res.on('data', (d) => response.push(d.toString()))
      res.on('end', () => resolve(response.join('')))
    })
    req.on('error', (e) => {
      reject(e)
    })
    req.write(body)
    req.end()
  }).then((response) => {
    return JSON.parse(response)
  })
}

class DigitalOcean {
  getAppSnapshots () {
    return fetch('GET', '/v2/snapshots').then((data) => {
      return data.snapshots.filter((snapshot) => {
        return snapshot.name.indexOf('cloakedpost-app') !== -1
      })
    })
  }

  getAppServers () {
    return fetch('GET', '/v2/droplets?resource_type=droplet&tag_name=app').then((data) => {
      return data.droplets.filter((droplet) => {
        return droplet.tags.indexOf('cloakedpost') !== -1
      })
    })
  }

  getNewServers () {
    return fetch('GET', `/v2/droplets?resource_type=droplet&tag_name=${CURRENT_TAG}`).then((data) => {
      return data.droplets
    })
  }

  serversAreUp (hostCount) {
    return this.getNewServers().then((droplets) => {
      return droplets.length === hostCount
    })
  }

  createAppServers (hostCount) {
    return this.getAppSnapshots().then(([snapshot]) => {
      const names = generateNames(hostCount)
      return fetch('POST', '/v2/droplets', {
        image: snapshot.id,
        names: generateNames(hostCount),
        region: 'nyc3',
        size: '512mb',
        tags: ['cloakedpost', 'app', CURRENT_TAG],
        backups: false,
        ipv6: false,
        private_networking: true,
      })
    }).then(() => {
      return doUntil(() => {
        return this.serversAreUp(hostCount)
      }, 10000)
    })
  }
}

module.exports = new DigitalOcean()

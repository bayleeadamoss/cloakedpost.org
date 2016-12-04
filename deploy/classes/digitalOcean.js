const moment = require('moment')
const https = require('https')
const doUntil = require('../lib/doUntil')
const generateNames = require('../lib/generateNames')

const CURRENT_TAG = 'CLOAKEDPOST-' + moment().format('YYYY-M-DD-H-mm-ss')
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
      console.log(`STATUS: ${res.statusCode}`);
      console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
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

  serversAreUp () {
    this.getNewServers().then((droplets) => {
      return droplets.map((droplet) => {
        return response.droplet.status === 'active'
      })
    }).then((promises) => {
      return Promise.all(promises).then((responses) => {
        return !responses.include(false)
      })
    })
  }

  createAppServers (hostCount) {
    return this.getAppSnapshots().then(([snapshot]) => {
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
        return this.serversAreUp()
      }, 5000)
    })
  }
}

module.exports = new DigitalOcean()

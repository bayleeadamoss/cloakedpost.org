const moment = require('moment')
const https = require('https')
const generateId = require('../../lib/generateId')
const doUntil = require('../lib/doUntil')

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

  createAppServers (hostCount) {
    const names = (function () {
      const result = [];
      for (var i=0; i<hostCount; i++) {
        result.push(`cloadedpost-app-${generateId(7)}`)
      }
      return result
    })()
    return this.getAppSnapshots().then(([snapshot]) => {
      return fetch('POST', '/v2/droplets', {
        image: snapshot.id,
        names: names,
        region: 'nyc3',
        size: '512mb',
        tags: ['cloakedpost', 'app'],
        backups: false,
        ipv6: false,
        private_networking: true,
      })
    }).then(() => {
      return doUntil(() => {
        // check if all hosts are active
      })
    })
  }
}

module.exports = new DigitalOcean()

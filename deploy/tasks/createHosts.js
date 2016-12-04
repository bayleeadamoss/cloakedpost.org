const DigitalOcean = require('../classes/digitalOcean')

const createHosts = (hostCount) => {
  DigitalOcean.createAppServers(hostCount).then((data) => {
    console.log('data', data)
  }).catch((err) => {
    console.log('err', err)
  })
}

createHosts(3)

module.exports = createHosts

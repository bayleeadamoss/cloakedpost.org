const DigitalOcean = require('../classes/digitalOcean')

const createHosts = (hostCount) => {
  return DigitalOcean.createAppServers(hostCount).then(() => {
    return DigitalOcean.getNewServers()
  })
}

module.exports = createHosts

const DigitalOcean = require('../classes/digitalOcean')

const getHostCount = () => {
  return DigitalOcean.getAppServers().then((servers) => {
    return servers.length
  })
}

module.exports = getHostCount

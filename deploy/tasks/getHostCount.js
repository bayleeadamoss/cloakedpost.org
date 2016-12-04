const DigitalOcean = require('../classes/digitalOcean')
const getLatestSnapshot

const getHostCount = () => {
  return DigitalOcean.getAppServers().then((servers) => {
    return servers.length
  })
}

module.exports = getHostCount

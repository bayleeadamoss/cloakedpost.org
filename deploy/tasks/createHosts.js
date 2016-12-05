const DigitalOcean = require('../classes/digitalOcean')

const createHosts = (hostCount) => {
  console.log('creating hosts...')
  return DigitalOcean.createAppServers(hostCount).then(() => {
    console.log('getting new servers')
    return DigitalOcean.getNewServers()
  })
}

module.exports = createHosts

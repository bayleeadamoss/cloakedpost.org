const getHosts = require('./getHosts')

const getHostCount = () => {
  return getHosts().then((hosts) => {
    return hosts.filter((host) => {
      // do the things
    })
  })
}

module.exports = getHostCount

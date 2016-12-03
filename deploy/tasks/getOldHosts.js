const getHosts = require('./getHosts')

const getOldHosts = () => {
  return getHosts().then((hosts) => {
    return hosts.filter((host) => {
      // do the things
    })
  })
}

module.exports = getOldHosts

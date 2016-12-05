const Ssh = require('../classes/ssh')

// TODO
// Rsync to modules
// Start pm2
// Assert `host:3000/status` returns `200` with current sha
const deployHost = (droplet) => {
  const ip = droplet.networks.v4.ip_address
  console.log('ip',ip)
  return new Ssh(ip).run('cd ~/www/current && git pull')
}

module.exports = deployHost

const addToLoadBalancer = (droplets) => {
  // generate nginx conf file
  var Handlebars = require('handlebars')
  var fs = require('fs')
  var ssh = require('../classes/ssh')
  var digitalOcean = require('../classes/digitalOcean')

  var source = fs.readFileSync('../../config/lb.nginx.conf').toString()

  var template = Handlebars.compile(source)

  var data = {
    servers: droplets.map((droplet) => {
      return {
        public_ip: droplet.networks.v4.ip_address,
        name: droplet.name,
      }
    })
  }

  digitalOcean.getLoadBalancers().then((droplets) => {
    droplets.map((droplet) => {
      const ip = droplet.networks.v4.ip_address
      new Ssh(docean)
    })
  })
  // new Ssh().
  fs.writeFileSync('../../config/nginx.conf', template(data))

  // push to both load balancers
}

module.exports = addToLoadBalancer

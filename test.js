var Handlebars = require('handlebars')
var fs = require('fs')

var source = fs.readFileSync('./config/lb.nginx.conf').toString()

var template = Handlebars.compile(source)

var data = {
  servers: [
    { public_ip: '138.197.21.140', name: 'app01' },
    { public_ip: '104.236.209.164', name: 'app02' },
  ],
}

console.log(template(data))

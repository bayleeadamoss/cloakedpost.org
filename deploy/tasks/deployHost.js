const Client = require('ssh2').Client;
const fs = require('fs')
// git pull on server
// Rsync to modules
// Start pm2
// Assert `host:3000/status` returns `200` with current sha
const deployHost = (droplet) => {
  const ip = droplet.networks.v4.ip_address
  return gitPull(ip)
}

deployHost({
  networks: {
    v4: {
      ip_address: '138.197.21.140',
    }
  }
})

function getConnection (ip) {
  const conn = new Client();
  return new Promise((resolve, reject) => {
    conn.on('ready', () => {
      resolve(conn)
    }).connect({
      host: ip,
      port: 22,
      username: 'cloakedpost',
      privateKey: fs.readFileSync('/Users/blainesch/.ssh/id_rsa')
    })
  })
}

function gitPull (ip) {
  return runCommand(ip, 'cd ~/www/current && git pull')
}

function runCommand(ip, command) {
  return getConnection(ip).then((conn) => {
    return new Promise((resolve, reject) => {
      conn.exec(command, (err, stream) => {
        if (err) return reject(err)
        const stdout = []
        const stderr = []
        stream.on('close', (code, signal) => {
          conn.end()
          if (stderr.length > 0) {
            reject(stderr.join(''))
          } else {
            resolve(stdout.join(''))
          }
        }).on('data', (data) => {
          stdout.push(data.toString())
        }).stderr.on('data', (data) => {
          stderr.push(data.toString())
        })
      })
    })
  })
}

module.exports = deployHost

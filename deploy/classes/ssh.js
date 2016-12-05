const Client = require('ssh2').Client;
const fs = require('fs')
const os = require('os')
const path = require('path')

class Ssh {
  constructor (ip) {
    this.ip = ip
  }

  _connect () {
    if (this.conn) {
      return Promise.resolve(this.conn)
    }
    return new Promise((resolve) => {
      const conn = new Client();
      conn.on('ready', () => {
        this.conn = conn
        resolve(this.conn)
      }).connect({
        host: this.ip,
        port: 22,
        username: 'cloakedpost',
        privateKey: fs.readFileSync(path.join(os.homedir(), '.ssh', 'id_rsa'))
      })
    })
  }

  writeFile (path, data) {
    return this._connect().then((conn) => {
      return new Promise((resolve, reject) => {
        conn.sftp((err, sftp) => {
          if (err) return reject(err)
          sftp.writeFile(path, data, (one, two) => {
            console.log('meowowowowow', one, two)
            resolve()
          })
        })
      })
    })
  }

  run (command) {
    return this._connect().then((conn) => {
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
}

module.exports = Ssh
